import uuid
from datetime import datetime, timedelta, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserOut,
    Token,
    UserUpdate,
    UserPasswordUpdate,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="customer",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is deactivated. Please contact support.",
        )

    token = create_access_token(user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)) -> Any:
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.phone is not None:
        current_user.phone = user_in.phone
    if user_in.email is not None and user_in.email.lower() != current_user.email:
        existing = db.query(User).filter(User.email == user_in.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already taken by another account.",
            )
        current_user.email = user_in.email.lower()

    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/password")
def change_password(
    pwd_in: UserPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if not verify_password(pwd_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password does not match.",
        )
    current_user.hashed_password = get_password_hash(pwd_in.new_password)
    db.commit()
    return {"message": "Password updated successfully."}


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Don't leak whether email exists
        return {"message": "If an account exists with this email, a reset token has been issued."}

    reset_token = f"rst_{uuid.uuid4().hex[:16]}"
    user.reset_token = reset_token
    user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(hours=2)
    db.commit()

    # In development mode, we return the reset_token in response or log so testing is seamless!
    return {
        "message": "Password reset instructions generated.",
        "dev_reset_token": reset_token,
    }


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(
        User.email == req.email.lower(),
        User.reset_token == req.token,
    ).first()

    if not user or not user.reset_token_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if datetime.now(timezone.utc) > user.reset_token_expires_at.replace(tzinfo=timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired.",
        )

    user.hashed_password = get_password_hash(req.new_password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()

    return {"message": "Password has been successfully reset. You may now log in."}


@router.post("/logout")
def logout() -> Any:
    return {"message": "Logged out successfully."}
