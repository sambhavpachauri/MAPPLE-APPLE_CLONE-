from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)  # e.g., "MPL-2026-94812"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Guest or customer contact
    customer_email = Column(String(255), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    
    # Order & payment status
    status = Column(String(50), default="processing", nullable=False)  # pending, processing, shipped, delivered, cancelled
    payment_status = Column(String(50), default="paid", nullable=False)  # pending, paid, failed, refunded
    payment_method = Column(String(50), default="mock_card", nullable=False)
    payment_id = Column(String(255), nullable=True)
    
    # Financials in integer paise
    subtotal_paise = Column(Integer, nullable=False)
    discount_paise = Column(Integer, default=0, nullable=False)
    shipping_paise = Column(Integer, default=0, nullable=False)
    tax_paise = Column(Integer, default=0, nullable=False)
    total_paise = Column(Integer, nullable=False)
    
    # Delivery & Address snapshot
    delivery_method = Column(String(50), default="standard", nullable=False)  # standard, express
    shipping_address_json = Column(Text, nullable=False)  # Full JSON address snapshot
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("PaymentRecord", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    
    # Immutable historical snapshots
    product_name_snapshot = Column(String(255), nullable=False)
    product_slug_snapshot = Column(String(255), nullable=False)
    product_image_snapshot = Column(String(500), nullable=True)
    selected_color = Column(String(100), nullable=True)
    selected_config = Column(String(100), nullable=True)
    
    unit_price_paise = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price_paise = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
