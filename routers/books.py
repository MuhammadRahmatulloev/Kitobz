from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import Book, User
from schemas.schemas import BookCreate, BookRead, BookUpdate
from core.auth import require_admin, require_moderator

router = APIRouter(prefix="/books", tags=["Books"])


# LIST + SEARCH + FILTER
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
    query = select(Book)

    if search:
        query = query.where(
            Book.title.ilike(f"%{search}%") | Book.author.ilike(f"%{search}%")
        )
    if category_id:
        query = query.where(Book.category_id == category_id)
    if min_price is not None:
        query = query.where(Book.price >= min_price)
    if max_price is not None:
        query = query.where(Book.price <= max_price)
    if available_only:
        query = query.where(Book.is_available == True, Book.stock > 0)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# GET ONE
@router.get("/{book_id}", response_model=BookRead)
async def get_book(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# CREATE (admin / moderator)
@router.post("/", response_model=BookRead, status_code=201)
async def create_book(
    data: BookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    book = Book(**data.model_dump())
    db.add(book)
    await db.commit()
    await db.refresh(book)
    return book


# UPDATE (admin / moderator)
@router.patch("/{book_id}", response_model=BookRead)
async def update_book(
    book_id: int,
    data: BookUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(book, field, value)

    await db.commit()
    await db.refresh(book)
    return book


# DELETE (admin only)
@router.delete("/{book_id}", status_code=204)
async def delete_book(
    book_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    await db.delete(book)
    await db.commit()