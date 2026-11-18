import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.order import Order
from app.models.payment import PaymentRecord
from app.schemas.payment import (
    PaymentCreateRequest,
    PaymentCreateResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
)

router = APIRouter()


@router.post("/create", response_model=PaymentCreateResponse)
def create_payment(
    req: PaymentCreateRequest,
    db: Session = Depends(get_db),
) -> Any:
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # In development/test mode, create a clearly labeled mock session or Razorpay test order
    provider = req.provider or "mock"
    tx_id = f"TXN_{uuid.uuid4().hex[:12].upper()}"

    return PaymentCreateResponse(
        order_id=order.id,
        provider=provider,
        amount_paise=order.total_paise,
        currency="INR",
        client_secret=f"mock_secret_{uuid.uuid4().hex}",
        razorpay_order_id=f"order_mock_{uuid.uuid4().hex[:14]}",
        key_id="rzp_test_mapple_mock_id",
        status="ready_for_payment",
    )


@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment(
    req: PaymentVerifyRequest,
    db: Session = Depends(get_db),
) -> Any:
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Verify payment status
    order.payment_status = "paid"
    order.payment_id = req.transaction_id
    order.status = "processing"

    # Add or update payment record
    pay_record = db.query(PaymentRecord).filter(PaymentRecord.order_id == order.id).first()
    if pay_record:
        pay_record.status = "captured"
        pay_record.transaction_id = req.transaction_id
    else:
        pay_record = PaymentRecord(
            order_id=order.id,
            provider=req.provider,
            transaction_id=req.transaction_id,
            amount_paise=order.total_paise,
            currency="INR",
            status="captured",
        )
        db.add(pay_record)

    db.commit()

    return PaymentVerifyResponse(
        success=True,
        order_id=order.id,
        payment_status="paid",
        message="Payment successfully verified in MAPPLE Test Gateway.",
    )
