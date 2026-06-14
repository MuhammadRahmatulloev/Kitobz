from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import Order, User
from repositories.order_repo import order_repo
from repositories.cart_repo import cart_repo
from repositories.book_repo import book_repo


VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]


class OrderService:

    async def create_from_cart(
        self, db: AsyncSession, user: User,
        delivery_address: str, delivery_city: str, is_dushanbe: bool
    ) -> Order:
        cart_items = await cart_repo.get_by_user(db, user.id)
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total = 0.0
        items_data = []

        for cart_item in cart_items:
            book = await book_repo.get_by_id(db, cart_item.book_id)
            if book is None or not book.is_available or book.stock < cart_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Book '{book.title if book else cart_item.book_id}' is not available in required quantity"
                )

            price = book.price
            if user.is_premium:
                price = price * 0.90

            total += price * cart_item.quantity
            items_data.append({
                "book": book,
                "book_id": book.id,
                "quantity": cart_item.quantity,
                "price": price,
            })

        delivery_cost = 5.0 if is_dushanbe else 10.0
        total += delivery_cost

        order = await order_repo.create(
            db,
            user_id=user.id,
            total_price=round(total, 2),
            delivery_cost=delivery_cost,
            delivery_address=delivery_address,
            delivery_city=delivery_city,
            items_data=items_data,
        )

        await cart_repo.clear(db, user.id)
        return order

    async def get_user_orders(self, db: AsyncSession, user_id: int) -> list[Order]:
        return await order_repo.get_by_user(db, user_id)

    async def get_user_order(self, db: AsyncSession, order_id: int, user_id: int) -> Order:
        order = await order_repo.get_by_id_and_user(db, order_id, user_id)
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    async def get_all(self, db: AsyncSession) -> list[Order]:
        return await order_repo.get_all(db)

    async def get_by_id(self, db: AsyncSession, order_id: int) -> Order:
        order = await order_repo.get_by_id(db, order_id)
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    async def update_status(self, db: AsyncSession, order_id: int, status: str) -> Order:
        if status not in VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {VALID_STATUSES}"
            )
        order = await self.get_by_id(db, order_id)
        return await order_repo.update_status(db, order, status)

    async def cancel(self, db: AsyncSession, order_id: int, user_id: int) -> Order:
        order = await self.get_user_order(db, order_id, user_id)
        if order.status not in ["pending"]:
            raise HTTPException(
                status_code=400,
                detail="Can only cancel orders with status 'pending'"
            )
        order.status = "cancelled"
        return await order_repo.update_status(db, order, "cancelled")


order_service = OrderService()
