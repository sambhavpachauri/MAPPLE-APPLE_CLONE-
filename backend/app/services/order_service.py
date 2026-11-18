import json
import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.payment import PaymentRecord
from app.schemas.order import OrderCreate
from app.services.cart_service import calculate_item_price, build_cart_response


def generate_order_id() -> str:
    # Generates a clean, professional MAPPLE order ID e.g. "MPL-98421"
    random_num = uuid.uuid4().int % 100000
    return f"MPL-{random_num:05d}"


def create_order_from_cart(
    db: Session,
    order_in: OrderCreate,
    user_id: Optional[int] = None,
) -> Order:
    # 1. Locate the cart
    cart = None
    if user_id:
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    elif order_in.guest_token:
        cart = db.query(Cart).filter(Cart.guest_token == order_in.guest_token).first()

    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty. Please add products before checking out.",
        )

    # 2. Re-validate inventory & calculate financial totals on the server
    cart_summary = build_cart_response(
        db=db,
        cart=cart,
        discount_code=order_in.discount_code,
        delivery_method=order_in.delivery_method,
    )

    if not cart_summary.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid items in cart.",
        )

    # Check that each item has adequate stock
    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item.product.name if item.product else ''} is no longer available.",
            )
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}. Only {product.stock_quantity} left.",
            )
        # Deduct stock safely
        product.stock_quantity -= item.quantity

    # 3. Create the Order
    order_id = generate_order_id()
    # Check uniqueness
    while db.query(Order).filter(Order.id == order_id).first():
        order_id = generate_order_id()

    shipping_address_str = json.dumps(order_in.shipping_address.model_dump())

    order = Order(
        id=order_id,
        user_id=user_id,
        customer_email=order_in.customer_email,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        status="processing",
        payment_status="paid" if order_in.payment_method in ["mock_gateway", "mock_card"] else "pending",
        payment_method=order_in.payment_method,
        payment_id=f"PAY-{uuid.uuid4().hex[:12].upper()}",
        subtotal_paise=cart_summary.subtotal_paise,
        discount_paise=cart_summary.discount_paise,
        shipping_paise=cart_summary.shipping_paise,
        tax_paise=cart_summary.tax_paise,
        total_paise=cart_summary.total_paise,
        delivery_method=order_in.delivery_method,
        shipping_address_json=shipping_address_str,
        notes=order_in.notes,
    )
    db.add(order)
    db.flush()

    # 4. Create immutable historical OrderItems
    for item in cart.items:
        product = item.product
        unit_price = calculate_item_price(product, item.selected_config)
        item_total = unit_price * item.quantity

        primary_image = None
        if product.images:
            primary_img = next((img for img in product.images if img.is_primary), product.images[0])
            primary_image = primary_img.image_url

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name_snapshot=product.name,
            product_slug_snapshot=product.slug,
            product_image_snapshot=primary_image,
            selected_color=item.selected_color,
            selected_config=item.selected_config,
            unit_price_paise=unit_price,
            quantity=item.quantity,
            total_price_paise=item_total,
        )
        db.add(order_item)

    # 5. Create payment record
    payment_rec = PaymentRecord(
        order_id=order.id,
        provider="mock" if "mock" in order_in.payment_method else order_in.payment_method,
        transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
        amount_paise=order.total_paise,
        currency="INR",
        status="captured" if order.payment_status == "paid" else "pending",
        raw_payload=json.dumps({"method": order_in.payment_method, "note": "MAPPLE Certified Test Mode"}),
    )
    db.add(payment_rec)

    # 6. Clear cart items
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()

    db.commit()
    db.refresh(order)
    return order
