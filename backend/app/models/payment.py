from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), default="mock", nullable=False)  # "mock", "razorpay"
    transaction_id = Column(String(255), unique=True, index=True, nullable=False)
    amount_paise = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(String(50), default="captured", nullable=False)  # created, authorized, captured, failed, refunded
    raw_payload = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    order = relationship("Order", back_populates="payments")
