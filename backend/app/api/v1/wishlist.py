from typing import Optional, Any
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_optional_current_user
from app.models.user import User
from app.models.wishlist import Wishlist, WishlistItem
from app.models.product import Product
from app.schemas.wishlist import WishlistOut, WishlistItemOut, WishlistItemAdd
from app.api.v1.products import map_product_to_list_item

router = APIRouter()


def get_or_create_wishlist(db: Session, user_id: Optional[int] = None, guest_token: Optional[str] = None) -> Wishlist:
    wishlist = None
    if user_id:
        wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).first()
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            db.add(wishlist)
            db.commit()
            db.refresh(wishlist)
        return wishlist

    if guest_token:
        wishlist = db.query(Wishlist).filter(Wishlist.guest_token == guest_token).first()
        if not wishlist:
            wishlist = Wishlist(guest_token=guest_token)
            db.add(wishlist)
            db.commit()
            db.refresh(wishlist)
        return wishlist

    wishlist = Wishlist()
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist


def build_wishlist_response(wishlist: Wishlist) -> WishlistOut:
    items_out = []
    for item in wishlist.items:
        if item.product and item.product.is_active:
            p_list_item = map_product_to_list_item(item.product)
            items_out.append(
                WishlistItemOut(
                    id=item.id,
                    product_id=item.product_id,
                    product=p_list_item,
                    created_at=item.created_at,
                )
            )
    return WishlistOut(
        id=wishlist.id,
        items=items_out,
        total_items=len(items_out),
    )


@router.get("", response_model=WishlistOut)
def get_wishlist(
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    wishlist = get_or_create_wishlist(db, user_id=user_id, guest_token=x_guest_token)
    return build_wishlist_response(wishlist)


@router.post("/items", response_model=WishlistOut)
def add_to_wishlist(
    item_in: WishlistItemAdd,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    product = db.query(Product).filter(Product.id == item_in.product_id, Product.is_active.is_(True)).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    user_id = current_user.id if current_user else None
    wishlist = get_or_create_wishlist(db, user_id=user_id, guest_token=x_guest_token)

    existing = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == item_in.product_id,
    ).first()

    if not existing:
        w_item = WishlistItem(wishlist_id=wishlist.id, product_id=item_in.product_id)
        db.add(w_item)
        db.commit()
        db.refresh(wishlist)

    return build_wishlist_response(wishlist)


@router.delete("/items/{product_id}", response_model=WishlistOut)
def remove_from_wishlist(
    product_id: int,
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    wishlist = get_or_create_wishlist(db, user_id=user_id, guest_token=x_guest_token)

    item = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == product_id,
    ).first()

    if item:
        db.delete(item)
        db.commit()
        db.refresh(wishlist)

    return build_wishlist_response(wishlist)
