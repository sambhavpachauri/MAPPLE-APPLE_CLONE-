from typing import List, Optional, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_optional_current_user
from app.models.user import User
from app.models.support import SupportTicket
from app.schemas.support import SupportCreate, SupportOut

router = APIRouter()


@router.post("/contact", response_model=SupportOut, status_code=status.HTTP_201_CREATED)
def submit_support_ticket(
    ticket_in: SupportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    user_id = current_user.id if current_user else None
    ticket = SupportTicket(
        user_id=user_id,
        order_id=ticket_in.order_id,
        name=ticket_in.name,
        email=ticket_in.email,
        category=ticket_in.category,
        subject=ticket_in.subject,
        message=ticket_in.message,
        status="open",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/my", response_model=List[SupportOut])
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user),
) -> Any:
    if not current_user:
        return []
    return db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).order_by(SupportTicket.created_at.desc()).all()
