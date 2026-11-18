from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ProductImageOut(BaseModel):
    id: int
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class ProductColorOut(BaseModel):
    id: int
    name: str
    hex_code: str
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProductConfigOut(BaseModel):
    id: int
    config_type: str
    label: str
    value: str
    price_delta_paise: int

    model_config = ConfigDict(from_attributes=True)


class ProductSpecOut(BaseModel):
    id: int
    group_name: str
    spec_name: str
    spec_value: str
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class ProductListItem(BaseModel):
    id: int
    category_id: Optional[int]
    category_slug: Optional[str] = None
    category_name: Optional[str] = None
    name: str
    slug: str
    short_description: str
    price_paise: int
    original_price_paise: Optional[int] = None
    stock_quantity: int
    is_featured: bool
    is_new: bool
    is_active: bool
    badge: Optional[str] = None
    rating: float
    review_count: int
    primary_image: Optional[str] = None
    colors: List[ProductColorOut] = []

    model_config = ConfigDict(from_attributes=True)


class ProductDetail(BaseModel):
    id: int
    category_id: Optional[int]
    category_slug: Optional[str] = None
    category_name: Optional[str] = None
    name: str
    slug: str
    short_description: str
    full_description: str
    price_paise: int
    original_price_paise: Optional[int] = None
    stock_quantity: int
    is_featured: bool
    is_new: bool
    is_active: bool
    badge: Optional[str] = None
    rating: float
    review_count: int
    created_at: datetime
    images: List[ProductImageOut] = []
    colors: List[ProductColorOut] = []
    configs: List[ProductConfigOut] = []
    specs: List[ProductSpecOut] = []

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    category_id: int
    name: str
    slug: str
    short_description: str
    full_description: str
    price_paise: int
    original_price_paise: Optional[int] = None
    stock_quantity: int = 50
    is_featured: bool = False
    is_new: bool = False
    is_active: bool = True
    badge: Optional[str] = None
    primary_image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    price_paise: Optional[int] = None
    original_price_paise: Optional[int] = None
    stock_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    is_new: Optional[bool] = None
    is_active: Optional[bool] = None
    badge: Optional[str] = None
