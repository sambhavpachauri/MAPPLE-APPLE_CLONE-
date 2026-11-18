from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.api.deps import get_db
from app.models.product import Product, ProductImage, ProductColor, ProductConfig, ProductSpec
from app.models.category import Category
from app.schemas.product import (
    ProductListItem,
    ProductDetail,
    ProductColorOut,
)

router = APIRouter()


def map_product_to_list_item(p: Product) -> ProductListItem:
    primary_img = None
    if p.images:
        primary = next((i for i in p.images if i.is_primary), p.images[0])
        primary_img = primary.image_url

    colors_out = [ProductColorOut.model_validate(c) for c in p.colors]

    return ProductListItem(
        id=p.id,
        category_id=p.category_id,
        category_slug=p.category.slug if p.category else None,
        category_name=p.category.name if p.category else None,
        name=p.name,
        slug=p.slug,
        short_description=p.short_description,
        price_paise=p.price_paise,
        original_price_paise=p.original_price_paise,
        stock_quantity=p.stock_quantity,
        is_featured=p.is_featured,
        is_new=p.is_new,
        is_active=p.is_active,
        badge=p.badge,
        rating=p.rating,
        review_count=p.review_count,
        primary_image=primary_img,
        colors=colors_out,
    )


@router.get("", response_model=Dict[str, Any])
def get_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="Category slug"),
    search: Optional[str] = Query(None, description="Search query"),
    min_price: Optional[int] = Query(None, description="Min price in paise"),
    max_price: Optional[int] = Query(None, description="Max price in paise"),
    in_stock: Optional[bool] = Query(None, description="Filter only in stock"),
    color: Optional[str] = Query(None, description="Filter by color name"),
    is_featured: Optional[bool] = Query(None),
    is_new: Optional[bool] = Query(None),
    sort_by: str = Query("featured", description="featured, price_asc, price_desc, newest, rating"),
    skip: int = Query(0, ge=0),
    limit: int = Query(24, ge=1, le=100),
) -> Any:
    query = db.query(Product).filter(Product.is_active.is_(True))

    if category:
        query = query.join(Product.category).filter(Category.slug == category)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.short_description.ilike(search_term),
                Product.full_description.ilike(search_term),
            )
        )

    if min_price is not None:
        query = query.filter(Product.price_paise >= min_price)

    if max_price is not None:
        query = query.filter(Product.price_paise <= max_price)

    if in_stock is True:
        query = query.filter(Product.stock_quantity > 0)

    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    if is_new is not None:
        query = query.filter(Product.is_new == is_new)

    if color:
        query = query.join(Product.colors).filter(ProductColor.name.ilike(f"%{color}%"))

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(asc(Product.price_paise))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.price_paise))
    elif sort_by == "newest":
        query = query.order_by(desc(Product.created_at))
    elif sort_by == "rating":
        query = query.order_by(desc(Product.rating))
    else:  # featured
        query = query.order_by(desc(Product.is_featured), desc(Product.rating))

    total = query.count()
    products = query.offset(skip).limit(limit).all()

    items = [map_product_to_list_item(p) for p in products]

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/featured", response_model=List[ProductListItem])
def get_featured_products(db: Session = Depends(get_db), limit: int = 8) -> Any:
    products = (
        db.query(Product)
        .filter(Product.is_active.is_(True), Product.is_featured.is_(True))
        .order_by(desc(Product.rating))
        .limit(limit)
        .all()
    )
    return [map_product_to_list_item(p) for p in products]


@router.get("/compare")
def compare_products(
    slugs: Optional[str] = Query(None, description="Comma-separated product slugs"),
    ids: Optional[str] = Query(None, description="Comma-separated product IDs"),
    db: Session = Depends(get_db),
) -> Any:
    query = db.query(Product).filter(Product.is_active.is_(True))
    if slugs:
        slug_list = [s.strip() for s in slugs.split(",") if s.strip()]
        query = query.filter(Product.slug.in_(slug_list))
    elif ids:
        id_list = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
        query = query.filter(Product.id.in_(id_list))
    else:
        # Default compare first 3 products
        query = query.limit(3)

    products = query.all()
    results = []
    all_spec_groups = set()

    for p in products:
        p_detail = ProductDetail.model_validate(p)
        p_detail.category_slug = p.category.slug if p.category else None
        p_detail.category_name = p.category.name if p.category else None
        results.append(p_detail)
        for s in p.specs:
            all_spec_groups.add(s.group_name)

    return {
        "products": results,
        "spec_groups": sorted(list(all_spec_groups)),
    }


@router.get("/{slug}")
def get_product_by_slug(slug: str, db: Session = Depends(get_db)) -> Any:
    product = db.query(Product).filter(Product.slug == slug, Product.is_active.is_(True)).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    p_detail = ProductDetail.model_validate(product)
    p_detail.category_slug = product.category.slug if product.category else None
    p_detail.category_name = product.category.name if product.category else None

    # Recommendations from same category or featured
    recommendations = (
        db.query(Product)
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.is_active.is_(True),
        )
        .limit(4)
        .all()
    )

    if len(recommendations) < 4:
        extra = (
            db.query(Product)
            .filter(
                Product.id != product.id,
                Product.id.notin_([r.id for r in recommendations]),
                Product.is_active.is_(True),
            )
            .limit(4 - len(recommendations))
            .all()
        )
        recommendations.extend(extra)

    return {
        "product": p_detail,
        "recommendations": [map_product_to_list_item(r) for r in recommendations],
    }
