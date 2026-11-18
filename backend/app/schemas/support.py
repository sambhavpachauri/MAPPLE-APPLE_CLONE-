from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class SupportCreate(BaseModel):
    name: str
    email: EmailStr
    order_id: Optional[str] = None
    category: str = "General"  # Orders, Technical, Returns, General
    subject: str
    message: str


class SupportStatusUpdate(BaseModel):
    status: str  # open, in_progress, resolved


class SupportOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    order_id: Optional[str] = None
    name: str
    email: str
    category: str
    subject: str
    message: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
