from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import Order, OrderItem


class OrderRepository:

    async def get_by_user(self, db: AsyncSession, user_id: int) -> list[Order]:
        result = await db.execute(
            select(Order).where(Order.user_id == user_id)
        )
        return result.scalars().all()

    async def get_by_id(self, db: AsyncSession, order_id: int) -> Order | None:
        result = await db.execute(select(Order).where(Order.id == order_id))
        return result.scalar_one_or_none()

    async def get_by_id_and_user(self, db: AsyncSession, order_id: int, user_id: int) -> Order | None:
        result = await db.execute(
            select(Order).where(Order.id == order_id, Order.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession) -> list[Order]:
        result = await db.execute(select(Order))
        return result.scalars().all()

    async def create(
        self, db: AsyncSession,
        user_id: int,
        total_price: float,
        delivery_cost: float,
        delivery_address: str,
        delivery_city: str,
        items_data: list[dict]
    ) -> Order:
        order = Order(
            user_id=user_id,
            total_price=round(total_price, 2),
            delivery_cost=delivery_cost,
            delivery_address=delivery_address,
            delivery_city=delivery_city
        )
        db.add(order)
        await db.flush()

        for item in items_data:
            order_item = OrderItem(
                order_id=order.id,
                book_id=item["book_id"],
                quantity=item["quantity"],
                price_at_order=item["price"]
            )
            db.add(order_item)
            item["book"].stock -= item["quantity"]

        await db.commit()
        await db.refresh(order)
        return order

    async def update_status(self, db: AsyncSession, order: Order, status: str) -> Order:
        order.status = status
        await db.commit()
        await db.refresh(order)
        return order


order_repo = OrderRepository()