from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AddressBase(BaseModel):
    full_name: str
    street_line1: str
    street_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone: str
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    full_name: Optional[str] = None
    street_line1: Optional[str] = None
    street_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    is_default: Optional[bool] = None


class AddressOut(AddressBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
