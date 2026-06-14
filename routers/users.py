from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import UserCreate, UserRead, UserUpdate, LoginSchema, TokenSchema
from core.auth import get_current_user, require_admin
from services.user_service import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserRead, status_code=201)
async def register(
    data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    return await user_service.register(db, **data.model_dump())


@router.post("/login", response_model=TokenSchema)
async def login(
    data: LoginSchema,
    db: AsyncSession = Depends(get_db)
):
    return await user_service.login(db, data.email, data.password)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await user_service.update(
        db, current_user,
        **data.model_dump(exclude_none=True)
    )


@router.get("/", response_model=list[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return await user_service.get_all(db)


@router.patch("/{user_id}/premium", response_model=UserRead)
async def toggle_premium(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return await user_service.toggle_premium(db, user_id)


@router.patch("/{user_id}/role", response_model=UserRead)
async def change_role(
    user_id: int,
    role: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return await user_service.change_role(db, user_id, role)


@router.patch("/{user_id}/deactivate", response_model=UserRead)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return await user_service.deactivate(db, user_id)
