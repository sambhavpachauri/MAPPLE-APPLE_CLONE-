from typing import Optional, Tuple
import uuid
from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product, ProductConfig
from app.models.discount import DiscountCode
from app.schemas.cart import CartOut, CartItemOut


def get_or_create_cart(db: Session, user_id: Optional[int] = None, guest_token: Optional[str] = None) -> Cart:
    cart = None
    if user_id:
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    if guest_token:
        cart = db.query(Cart).filter(Cart.guest_token == guest_token).first()
        if not cart:
            cart = Cart(guest_token=guest_token)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    # If neither provided, generate new guest token
    new_token = f"guest_{uuid.uuid4().hex}"
    cart = Cart(guest_token=new_token)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart


def calculate_item_price(product: Product, selected_config: Optional[str]) -> int:
    unit_price = product.price_paise
    if selected_config:
        config = next((c for c in product.configs if c.label == selected_config or c.value == selected_config), None)
        if config:
            unit_price += config.price_delta_paise
    return unit_price


def build_cart_response(
    db: Session,
    cart: Cart,
    discount_code: Optional[str] = None,
    delivery_method: str = "standard",
) -> CartOut:
    items_out = []
    subtotal_paise = 0
    total_items = 0

    for item in cart.items:
        product = item.product
        if not product or not product.is_active:
            continue
        
        unit_price = calculate_item_price(product, item.selected_config)
        item_total = unit_price * item.quantity
        subtotal_paise += item_total
        total_items += item.quantity

        primary_image = None
        if product.images:
            primary_img = next((img for img in product.images if img.is_primary), product.images[0])
            primary_image = primary_img.image_url

        items_out.append(
            CartItemOut(
                id=item.id,
                cart_id=cart.id,
                product_id=product.id,
                product_name=product.name,
                product_slug=product.slug,
                product_image=primary_image,
                quantity=item.quantity,
                selected_color=item.selected_color,
                selected_config=item.selected_config,
                unit_price_paise=unit_price,
                total_price_paise=item_total,
                in_stock=product.stock_quantity >= item.quantity,
                stock_quantity=product.stock_quantity,
            )
        )

    # Discount calculation
    discount_paise = 0
    valid_discount_code = None
    if discount_code:
        dc = db.query(DiscountCode).filter(
            DiscountCode.code == discount_code.strip().upper(),
            DiscountCode.is_active.is_(True),
        ).first()
        if dc and subtotal_paise >= dc.min_order_paise:
            valid_discount_code = dc.code
            if dc.discount_type == "percentage":
                discount_paise = int((subtotal_paise * dc.discount_value) / 100)
                if dc.max_discount_paise and discount_paise > dc.max_discount_paise:
                    discount_paise = dc.max_discount_paise
            elif dc.discount_type == "fixed_paise":
                discount_paise = min(dc.discount_value, subtotal_paise)

    # Shipping calculation: Complimentary standard delivery on all orders; ₹499 express
    shipping_paise = 0
    if delivery_method == "express":
        shipping_paise = 49900  # ₹499

    # Taxes (Taxes are transparently itemized: 18% GST standard on consumer electronics)
    taxable_amount = max(0, subtotal_paise - discount_paise)
    tax_paise = int(taxable_amount * 0.18) if taxable_amount > 0 else 0

    total_paise = max(0, subtotal_paise - discount_paise + shipping_paise + tax_paise)

    return CartOut(
        id=cart.id,
        guest_token=cart.guest_token,
        items=items_out,
        total_items=total_items,
        subtotal_paise=subtotal_paise,
        discount_paise=discount_paise,
        shipping_paise=shipping_paise,
        tax_paise=tax_paise,
        total_paise=total_paise,
        discount_code=valid_discount_code,
    )


def merge_guest_cart_into_user_cart(db: Session, user_id: int, guest_token: str) -> Cart:
    guest_cart = db.query(Cart).filter(Cart.guest_token == guest_token).first()
    user_cart = get_or_create_cart(db, user_id=user_id)

    if not guest_cart or not guest_cart.items:
        return user_cart

    for g_item in guest_cart.items:
        # Check if identical product + color + config already in user cart
        existing = db.query(CartItem).filter(
            CartItem.cart_id == user_cart.id,
            CartItem.product_id == g_item.product_id,
            CartItem.selected_color == g_item.selected_color,
            CartItem.selected_config == g_item.selected_config,
        ).first()

        if existing:
            existing.quantity = min(10, existing.quantity + g_item.quantity)
        else:
            new_item = CartItem(
                cart_id=user_cart.id,
                product_id=g_item.product_id,
                quantity=g_item.quantity,
                selected_color=g_item.selected_color,
                selected_config=g_item.selected_config,
            )
            db.add(new_item)

    db.delete(guest_cart)
    db.commit()
    db.refresh(user_cart)
    return user_cart
