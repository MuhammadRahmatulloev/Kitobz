from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import Book


class BookRepository:

    async def get_all(
        self, db: AsyncSession,
        search: Optional[str] = None,
        category_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        available_only: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> list[Book]:
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

    async def get_by_id(self, db: AsyncSession, book_id: int) -> Book | None:
        result = await db.execute(select(Book).where(Book.id == book_id))
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, **kwargs) -> Book:
        book = Book(**kwargs)
        db.add(book)
        await db.commit()
        await db.refresh(book)
        return book

    async def update(self, db: AsyncSession, book: Book, **kwargs) -> Book:
        for field, value in kwargs.items():
            setattr(book, field, value)
        await db.commit()
        await db.refresh(book)
        return book

    async def delete(self, db: AsyncSession, book: Book) -> None:
        await db.delete(book)
        await db.commit()


book_repo = BookRepository()