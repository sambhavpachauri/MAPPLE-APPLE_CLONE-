from typing import Any, Optional
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.order import CheckoutQuoteRequest, CheckoutQuoteResponse
from app.services.cart_service import get_or_create_cart, build_cart_response

router = APIRouter()


@router.post("/quote", response_model=CheckoutQuoteResponse)
def get_checkout_quote(
    req: CheckoutQuoteRequest,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    token = req.guest_token or x_guest_token
    cart = get_or_create_cart(db, user_id=user_id, guest_token=token)

    summary = build_cart_response(
        db=db,
        cart=cart,
        discount_code=req.discount_code,
        delivery_method=req.delivery_method,
    )

    discount_desc = None
    if summary.discount_code:
        discount_desc = "Promotional discount applied"

    return CheckoutQuoteResponse(
        subtotal_paise=summary.subtotal_paise,
        discount_paise=summary.discount_paise,
        shipping_paise=summary.shipping_paise,
        tax_paise=summary.tax_paise,
        total_paise=summary.total_paise,
        discount_code=summary.discount_code,
        discount_description=discount_desc,
        items_count=summary.total_items,
        qualifies_free_shipping=True,
    )
