from typing import Optional, Any
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_optional_current_user
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import (
    CartOut,
    CartItemAdd,
    CartItemUpdate,
    CartMergeRequest,
)
from app.services.cart_service import (
    get_or_create_cart,
    build_cart_response,
    merge_guest_cart_into_user_cart,
)

router = APIRouter()


@router.get("", response_model=CartOut)
def get_cart(
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    discount_code: Optional[str] = None,
    delivery_method: str = "standard",
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    cart = get_or_create_cart(db, user_id=user_id, guest_token=x_guest_token)
    return build_cart_response(db, cart, discount_code=discount_code, delivery_method=delivery_method)


@router.post("/items", response_model=CartOut)
def add_item_to_cart(
    item_in: CartItemAdd,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    product = db.query(Product).filter(Product.id == item_in.product_id, Product.is_active.is_(True)).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if product.stock_quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This product is currently out of stock.")

    user_id = current_user.id if current_user else None
    cart = get_or_create_cart(db, user_id=user_id, guest_token=x_guest_token)

    # Check if item with exact variant already exists in cart
    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item_in.product_id,
        CartItem.selected_color == item_in.selected_color,
        CartItem.selected_config == item_in.selected_config,
    ).first()

    if existing:
        new_qty = existing.quantity + item_in.quantity
        if new_qty > min(10, product.stock_quantity):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add more units. Maximum purchase limit or stock limit reached ({product.stock_quantity} available).",
            )
        existing.quantity = new_qty
    else:
        if item_in.quantity > min(10, product.stock_quantity):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Requested quantity exceeds available stock ({product.stock_quantity} units available).",
            )
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity,
            selected_color=item_in.selected_color,
            selected_config=item_in.selected_config,
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart)
    return build_cart_response(db, cart)


@router.patch("/items/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    item_in: CartItemUpdate,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    cart = get_or_create_cart(db, user_id=user_id, guest_token=x_guest_token)

    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    if item_in.quantity <= 0:
        db.delete(item)
    else:
        product = item.product
        if item_in.quantity > min(10, product.stock_quantity):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} units available.",
            )
        item.quantity = item_in.quantity

    db.commit()
    db.refresh(cart)
    return build_cart_response(db, cart)


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_cart_item(
    item_id: int,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    cart = get_or_create_cart(db, user_id=user_id, guest_token=x_guest_token)

    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if item:
        db.delete(item)
        db.commit()
        db.refresh(cart)

    return build_cart_response(db, cart)


@router.post("/merge", response_model=CartOut)
def merge_cart(
    req: CartMergeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user),
) -> Any:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required to merge cart")

    cart = merge_guest_cart_into_user_cart(db, current_user.id, req.guest_token)
    return build_cart_response(db, cart)
