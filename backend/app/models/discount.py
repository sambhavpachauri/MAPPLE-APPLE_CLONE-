from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db.session import Base


class DiscountCode(Base):
    __tablename__ = "discount_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    discount_type = Column(String(20), default="percentage", nullable=False)  # "percentage", "fixed_paise"
    discount_value = Column(Integer, nullable=False)  # e.g., 10 for 10%, or 500000 for ₹5,000 off
    min_order_paise = Column(Integer, default=0, nullable=False)
    max_discount_paise = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    valid_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
