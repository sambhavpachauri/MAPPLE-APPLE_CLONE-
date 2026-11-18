from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.api.deps import get_db, get_current_admin
from app.models.user import User
from app.models.order import Order
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.models.support import SupportTicket
from app.schemas.order import OrderOut, OrderStatusUpdate
from app.schemas.product import ProductDetail, ProductCreate, ProductUpdate, ProductListItem
from app.schemas.support import SupportOut, SupportStatusUpdate
from app.api.v1.products import map_product_to_list_item

router = APIRouter()


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    total_sales_paise = db.query(func.coalesce(func.sum(Order.total_paise), 0)).filter(Order.payment_status == "paid").scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    low_stock_products = db.query(func.count(Product.id)).filter(Product.stock_quantity <= 5).scalar()

    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_sales_paise": total_sales_paise,
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "low_stock_count": low_stock_products,
        "recent_orders": [OrderOut.model_validate(o) for o in recent_orders],
    }


@router.get("/products", response_model=List[ProductListItem])
def get_all_products_admin(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    products = db.query(Product).order_by(Product.id.asc()).all()
    return [map_product_to_list_item(p) for p in products]


@router.post("/products", response_model=ProductDetail, status_code=status.HTTP_201_CREATED)
def create_product_admin(
    p_in: ProductCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    existing = db.query(Product).filter(Product.slug == p_in.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product slug already exists")

    product = Product(
        category_id=p_in.category_id,
        name=p_in.name,
        slug=p_in.slug,
        short_description=p_in.short_description,
        full_description=p_in.full_description,
        price_paise=p_in.price_paise,
        original_price_paise=p_in.original_price_paise,
        stock_quantity=p_in.stock_quantity,
        is_featured=p_in.is_featured,
        is_new=p_in.is_new,
        is_active=p_in.is_active,
        badge=p_in.badge,
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    if p_in.primary_image_url:
        img = ProductImage(product_id=product.id, image_url=p_in.primary_image_url, is_primary=True, sort_order=0)
        db.add(img)
        db.commit()
        db.refresh(product)

    return ProductDetail.model_validate(product)


@router.patch("/products/{product_id}", response_model=ProductDetail)
def update_product_admin(
    product_id: int,
    p_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    for field, val in p_in.model_dump(exclude_unset=True).items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return ProductDetail.model_validate(product)


@router.patch("/products/{product_id}/stock")
def update_product_stock_admin(
    product_id: int,
    stock: int = Query(..., ge=0),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    product.stock_quantity = stock
    db.commit()
    return {"message": f"Stock updated to {stock}", "stock_quantity": product.stock_quantity}


@router.get("/orders", response_model=List[OrderOut])
def get_all_orders_admin(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    query = db.query(Order).order_by(Order.created_at.desc())
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.all()


VALID_TRANSITIONS = {
    "pending": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered", "cancelled"],
    "delivered": [],
    "cancelled": [],
}


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status_admin(
    order_id: str,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    target_status = status_in.status.lower()
    allowed = VALID_TRANSITIONS.get(order.status, [])

    if target_status not in allowed and target_status != order.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{order.status}' to '{target_status}'. Allowed transitions: {allowed}",
        )

    order.status = target_status
    db.commit()
    db.refresh(order)
    return order


@router.get("/support", response_model=List[SupportOut])
def get_all_support_admin(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    query = db.query(SupportTicket).order_by(SupportTicket.created_at.desc())
    if status_filter:
        query = query.filter(SupportTicket.status == status_filter)
    return query.all()


@router.patch("/support/{ticket_id}/status", response_model=SupportOut)
def update_support_status_admin(
    ticket_id: int,
    status_in: SupportStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
) -> Any:
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found")

    ticket.status = status_in.status
    db.commit()
    db.refresh(ticket)
    return ticket
