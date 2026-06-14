from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import BookCreate, BookRead, BookUpdate
from core.auth import require_admin, require_moderator
from services.book_service import book_service

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/", response_model=list[BookRead])
async def list_books(
    db: AsyncSession = Depends(get_db),
    search: Optional[str] = Query(None, description="Поиск по названию или автору"),
    category_id: Optional[int] = Query(None, description="Фильтр по категории"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    available_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100)
):
    return await book_service.get_all(
        db, search=search, category_id=category_id,
        min_price=min_price, max_price=max_price,
        available_only=available_only, skip=skip, limit=limit
    )


@router.get("/{book_id}", response_model=BookRead)
async def get_book(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await book_service.get_by_id(db, book_id)


@router.post("/", response_model=BookRead, status_code=201)
async def create_book(
    data: BookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    return await book_service.create(db, **data.model_dump())


@router.patch("/{book_id}", response_model=BookRead)
async def update_book(
    book_id: int,
    data: BookUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    return await book_service.update(
        db, book_id, **data.model_dump(exclude_none=True)
    )


@router.delete("/{book_id}", status_code=204)
async def delete_book(
    book_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    await book_service.delete(db, book_id)
