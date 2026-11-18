from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=10)
    selected_color: Optional[str] = None
    selected_config: Optional[str] = None  # e.g., "512GB"


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1, le=10)


class CartItemOut(BaseModel):
    id: int
    cart_id: int
    product_id: int
    product_name: str
    product_slug: str
    product_image: Optional[str] = None
    quantity: int
    selected_color: Optional[str] = None
    selected_config: Optional[str] = None
    unit_price_paise: int
    total_price_paise: int
    in_stock: bool
    stock_quantity: int

    model_config = ConfigDict(from_attributes=True)


class CartOut(BaseModel):
    id: int
    guest_token: Optional[str] = None
    items: List[CartItemOut] = []
    total_items: int = 0
    subtotal_paise: int = 0
    discount_paise: int = 0
    shipping_paise: int = 0
    tax_paise: int = 0
    total_paise: int = 0
    discount_code: Optional[str] = None


class CartMergeRequest(BaseModel):
    guest_token: str
