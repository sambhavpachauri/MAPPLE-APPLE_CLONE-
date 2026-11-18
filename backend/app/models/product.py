from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    short_description = Column(String(500), nullable=False)
    full_description = Column(Text, nullable=False)
    
    # Prices stored in paise (1 INR = 100 paise)
    price_paise = Column(Integer, nullable=False)
    original_price_paise = Column(Integer, nullable=True)
    
    stock_quantity = Column(Integer, default=50, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_new = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    badge = Column(String(50), nullable=True)
    rating = Column(Float, default=4.8, nullable=False)
    review_count = Column(Integer, default=50, nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    colors = relationship("ProductColor", back_populates="product", cascade="all, delete-orphan")
    configs = relationship("ProductConfig", back_populates="product", cascade="all, delete-orphan")
    specs = relationship("ProductSpec", back_populates="product", cascade="all, delete-orphan", order_by="ProductSpec.sort_order")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

    product = relationship("Product", back_populates="images")


class ProductColor(Base):
    __tablename__ = "product_colors"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    hex_code = Column(String(50), nullable=False)
    image_url = Column(String(500), nullable=True)

    product = relationship("Product", back_populates="colors")


class ProductConfig(Base):
    __tablename__ = "product_configs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    config_type = Column(String(50), nullable=False)  # "storage", "memory", "size"
    label = Column(String(100), nullable=False)       # e.g. "256GB", "512GB", "1TB", "41mm", "45mm"
    value = Column(String(100), nullable=False)
    price_delta_paise = Column(Integer, default=0, nullable=False)  # delta added to base price

    product = relationship("Product", back_populates="configs")


class ProductSpec(Base):
    __tablename__ = "product_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    group_name = Column(String(100), nullable=False)  # "Display", "Chip", "Camera", "Battery", "Connectivity", "Dimensions"
    spec_name = Column(String(100), nullable=False)
    spec_value = Column(String(255), nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

    product = relationship("Product", back_populates="specs")
