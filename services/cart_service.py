from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import CartItem, Book, User
from repositories.cart_repo import cart_repo
from repositories.book_repo import book_repo


class CartService:

    async def get_cart(self, db: AsyncSession, user_id: int) -> list[CartItem]:
        return await cart_repo.get_by_user(db, user_id)

    async def add_item(
        self, db: AsyncSession, user_id: int, book_id: int, quantity: int
    ) -> CartItem:
        book = await book_repo.get_by_id(db, book_id)
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        if not book.is_available or book.stock < 1:
            raise HTTPException(status_code=400, detail="Book is not available")

        existing = await cart_repo.get_by_book(db, user_id, book_id)
        if existing:
            existing.quantity += quantity
            return await cart_repo.update_quantity(db, existing, existing.quantity)

        return await cart_repo.create(db, user_id=user_id, book_id=book_id, quantity=quantity)

    async def update_quantity(
        self, db: AsyncSession, user_id: int, item_id: int, quantity: int
    ) -> CartItem:
        if quantity < 1:
            raise HTTPException(status_code=400, detail="Quantity must be at least 1")
        item = await cart_repo.get_item(db, item_id, user_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Cart item not found")
        return await cart_repo.update_quantity(db, item, quantity)

    async def remove_item(self, db: AsyncSession, user_id: int, item_id: int) -> None:
        item = await cart_repo.get_item(db, item_id, user_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Cart item not found")
        await cart_repo.delete(db, item)

    async def clear_cart(self, db: AsyncSession, user_id: int) -> None:
        await cart_repo.clear(db, user_id)


cart_service = CartService()
