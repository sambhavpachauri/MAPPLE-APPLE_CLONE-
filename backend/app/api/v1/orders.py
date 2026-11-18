from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_optional_current_user
from app.models.user import User
from app.models.order import Order
from app.schemas.order import OrderOut, OrderCreate
from app.services.order_service import create_order_from_cart

router = APIRouter()


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    order = create_order_from_cart(db, order_in, user_id=user_id)
    return order


@router.get("", response_model=List[OrderOut])
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(
    order_id: str,
    guest_email: Optional[str] = Query(None, description="Email verification for guest orders"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Security check:
    # 1. If user is logged in:
    if current_user:
        if current_user.role == "admin":
            return order
        if order.user_id == current_user.id:
            return order
        # If user email matches guest email
        if order.customer_email.lower() == current_user.email.lower():
            return order
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this order.",
        )

    # 2. If guest access:
    if guest_email and guest_email.lower() == order.customer_email.lower():
        return order

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Please sign in or provide the email address used for this order.",
    )
