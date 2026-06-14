from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import UserCreate, UserRead, UserUpdate, LoginSchema, TokenSchema
from core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
)

router = APIRouter(prefix="/users", tags=["Users"])


# REGISTER
@router.post("/register", response_model=UserRead, status_code=201)
async def register(
    data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.phone == data.phone))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Phone already exists")

    if data.email:
        result = await db.execute(select(User).where(User.email == data.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        username=data.username,
        phone=data.phone,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# LOGIN
@router.post("/login", response_model=TokenSchema)
async def login(
    data: LoginSchema,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}


# ME
@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


# UPDATE ME
@router.patch("/me", response_model=UserRead)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if data.username is not None:
        current_user.username = data.username
    if data.email is not None:
        current_user.email = data.email
    if data.phone is not None:
        current_user.phone = data.phone

    await db.commit()
    await db.refresh(current_user)
    return current_user


# ALL USERS (admin)
@router.get("/", response_model=list[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = await db.execute(select(User))
    return result.scalars().all()


# MAKE PREMIUM (admin)
@router.patch("/{user_id}/premium", response_model=UserRead)
async def toggle_premium(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_premium = not user.is_premium
    await db.commit()
    await db.refresh(user)
    return user


# CHANGE ROLE (admin)
@router.patch("/{user_id}/role", response_model=UserRead)
async def change_role(
    user_id: int,
    role: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    allowed = ["user", "moderator", "admin"]
    if role not in allowed:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed}")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    await db.commit()
    await db.refresh(user)
    return user


# DEACTIVATE USER (admin)
@router.patch("/{user_id}/deactivate", response_model=UserRead)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    await db.commit()
    await db.refresh(user)
    return user