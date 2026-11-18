from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.address import Address
from app.schemas.address import AddressOut, AddressCreate, AddressUpdate

router = APIRouter()


@router.get("", response_model=List[AddressOut])
def get_user_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.is_default.desc()).all()


@router.post("", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def create_address(
    addr_in: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    # If this is the user's first address or is_default is true, handle default flag
    has_addresses = db.query(Address).filter(Address.user_id == current_user.id).first()
    is_default = addr_in.is_default or not has_addresses

    if is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    address = Address(
        user_id=current_user.id,
        full_name=addr_in.full_name,
        street_line1=addr_in.street_line1,
        street_line2=addr_in.street_line2,
        city=addr_in.city,
        state=addr_in.state,
        postal_code=addr_in.postal_code,
        country=addr_in.country,
        phone=addr_in.phone,
        is_default=is_default,
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.patch("/{address_id}", response_model=AddressOut)
def update_address(
    address_id: int,
    addr_in: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    if addr_in.is_default is True:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    for field, val in addr_in.model_dump(exclude_unset=True).items():
        setattr(address, field, val)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    was_default = address.is_default
    db.delete(address)
    db.commit()

    if was_default:
        next_addr = db.query(Address).filter(Address.user_id == current_user.id).first()
        if next_addr:
            next_addr.is_default = True
            db.commit()

    return {"message": "Address deleted"}


@router.post("/{address_id}/default", response_model=AddressOut)
def set_default_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    address.is_default = True
    db.commit()
    db.refresh(address)
    return address
