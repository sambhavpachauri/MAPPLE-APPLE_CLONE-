from typing import Optional, Dict, Any
from pydantic import BaseModel


class PaymentCreateRequest(BaseModel):
    order_id: str
    provider: str = "mock"  # "mock" or "razorpay"


class PaymentCreateResponse(BaseModel):
    order_id: str
    provider: str
    amount_paise: int
    currency: str = "INR"
    client_secret: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    key_id: Optional[str] = None
    status: str


class PaymentVerifyRequest(BaseModel):
    order_id: str
    provider: str = "mock"
    transaction_id: str
    payment_signature: Optional[str] = None
    raw_response: Optional[str] = None


class PaymentVerifyResponse(BaseModel):
    success: bool
    order_id: str
    payment_status: str
    message: str
