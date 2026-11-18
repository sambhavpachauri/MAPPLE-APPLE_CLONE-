from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    slug: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    hero_image: Optional[str] = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    product_count: Optional[int] = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
