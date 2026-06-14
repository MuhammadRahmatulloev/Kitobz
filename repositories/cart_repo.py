from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import CartItem


class CartRepository:

    async def get_by_user(self, db: AsyncSession, user_id: int) -> list[CartItem]:
        result = await db.execute(
            select(CartItem).where(CartItem.user_id == user_id)
        )
        return result.scalars().all()

    async def get_item(self, db: AsyncSession, item_id: int, user_id: int) -> CartItem | None:
        result = await db.execute(
            select(CartItem).where(
                CartItem.id == item_id,
                CartItem.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_by_book(self, db: AsyncSession, user_id: int, book_id: int) -> CartItem | None:
        result = await db.execute(
            select(CartItem).where(
                CartItem.user_id == user_id,
                CartItem.book_id == book_id
            )
        )
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, user_id: int, book_id: int, quantity: int) -> CartItem:
        item = CartItem(user_id=user_id, book_id=book_id, quantity=quantity)
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item

    async def update_quantity(self, db: AsyncSession, item: CartItem, quantity: int) -> CartItem:
        item.quantity = quantity
        await db.commit()
        await db.refresh(item)
        return item

    async def delete(self, db: AsyncSession, item: CartItem) -> None:
        await db.delete(item)
        await db.commit()

    async def clear(self, db: AsyncSession, user_id: int) -> None:
        result = await db.execute(
            select(CartItem).where(CartItem.user_id == user_id)
        )
        for item in result.scalars().all():
            await db.delete(item)
        await db.commit()


cart_repo = CartRepository()