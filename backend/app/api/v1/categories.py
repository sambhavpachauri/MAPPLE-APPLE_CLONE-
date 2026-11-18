from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryOut

router = APIRouter()


@router.get("", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)) -> Any:
    categories = db.query(Category).order_by(Category.sort_order).all()
    results = []
    for cat in categories:
        count = db.query(func.count(Product.id)).filter(
            Product.category_id == cat.id,
            Product.is_active.is_(True),
        ).scalar()
        cat_out = CategoryOut.model_validate(cat)
        cat_out.product_count = count
        results.append(cat_out)
    return results


@router.get("/{slug}", response_model=CategoryOut)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)) -> Any:
    cat = db.query(Category).filter(Category.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    count = db.query(func.count(Product.id)).filter(
        Product.category_id == cat.id,
        Product.is_active.is_(True),
    ).scalar()
    cat_out = CategoryOut.model_validate(cat)
    cat_out.product_count = count
    return cat_out
