from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import Book
from repositories.book_repo import book_repo


class BookService:

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
        return await book_repo.get_all(
            db, search=search, category_id=category_id,
            min_price=min_price, max_price=max_price,
            available_only=available_only, skip=skip, limit=limit
        )

    async def get_by_id(self, db: AsyncSession, book_id: int) -> Book:
        book = await book_repo.get_by_id(db, book_id)
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        return book

    async def create(self, db: AsyncSession, **kwargs) -> Book:
        return await book_repo.create(db, **kwargs)

    async def update(self, db: AsyncSession, book_id: int, **kwargs) -> Book:
        book = await self.get_by_id(db, book_id)
        return await book_repo.update(db, book, **kwargs)

    async def delete(self, db: AsyncSession, book_id: int) -> None:
        book = await self.get_by_id(db, book_id)
        await book_repo.delete(db, book)


book_service = BookService()
