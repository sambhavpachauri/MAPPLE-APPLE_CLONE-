from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.product import ProductListItem


class WishlistItemAdd(BaseModel):
    product_id: int


class WishlistItemOut(BaseModel):
    id: int
    product_id: int
    product: ProductListItem
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WishlistOut(BaseModel):
    id: int
    items: List[WishlistItemOut] = []
    total_items: int = 0
