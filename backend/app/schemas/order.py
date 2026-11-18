from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class OrderItemOut(BaseModel):
    id: int
    product_id: Optional[int]
    product_name_snapshot: str
    product_slug_snapshot: str
    product_image_snapshot: Optional[str] = None
    selected_color: Optional[str] = None
    selected_config: Optional[str] = None
    unit_price_paise: int
    quantity: int
    total_price_paise: int

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: str
    user_id: Optional[int] = None
    customer_email: str
    customer_name: str
    customer_phone: str
    status: str
    payment_status: str
    payment_method: str
    payment_id: Optional[str] = None
    subtotal_paise: int
    discount_paise: int
    shipping_paise: int
    tax_paise: int
    total_paise: int
    delivery_method: str
    shipping_address_json: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut] = []

    model_config = ConfigDict(from_attributes=True)


class ShippingAddressInput(BaseModel):
    full_name: str
    street_line1: str
    street_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone: str


class OrderCreate(BaseModel):
    customer_email: EmailStr
    customer_name: str
    customer_phone: str
    shipping_address: ShippingAddressInput
    delivery_method: str = "standard"  # standard, express
    payment_method: str = "mock_gateway"  # mock_gateway, razorpay_test, cod
    discount_code: Optional[str] = None
    notes: Optional[str] = None
    guest_token: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str  # processing, shipped, delivered, cancelled


class CheckoutQuoteRequest(BaseModel):
    guest_token: Optional[str] = None
    discount_code: Optional[str] = None
    delivery_method: str = "standard"


class CheckoutQuoteResponse(BaseModel):
    subtotal_paise: int
    discount_paise: int
    shipping_paise: int
    tax_paise: int
    total_paise: int
    discount_code: Optional[str] = None
    discount_description: Optional[str] = None
    items_count: int
    qualifies_free_shipping: bool
