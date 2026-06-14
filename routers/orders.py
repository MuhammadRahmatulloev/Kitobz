from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import Order, OrderItem, CartItem, Book, User
from schemas.schemas import OrderCreate, OrderRead, OrderStatusUpdate
from core.auth import get_current_user, require_admin, require_moderator

router = APIRouter(prefix="/orders", tags=["Orders"])

VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]


# CREATE ORDER FROM CART
@router.post("/", response_model=OrderRead, status_code=201)
async def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == current_user.id)
    )
    cart_items = result.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0.0
    order_items_data = []

    for cart_item in cart_items:
        book_result = await db.execute(select(Book).where(Book.id == cart_item.book_id))
        book = book_result.scalar_one_or_none()

        if book is None or not book.is_available or book.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Book '{book.title if book else cart_item.book_id}' is not available in required quantity"
            )

        price = book.price
        if current_user.is_premium:
            price = price * 0.90

        total += price * cart_item.quantity
        order_items_data.append({
            "book": book,
            "quantity": cart_item.quantity,
            "price_at_order": price
        })

    delivery_cost = 5.0 if data.is_dushanbe else 10.0
    total += delivery_cost

    order = Order(
        user_id=current_user.id,
        total_price=round(total, 2),
        delivery_address=data.delivery_address,
        delivery_city=data.delivery_city,
        delivery_cost=delivery_cost
    )
    db.add(order)
    await db.flush()

    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            book_id=item_data["book"].id,
            quantity=item_data["quantity"],
            price_at_order=item_data["price_at_order"]
        )
        db.add(order_item)
        item_data["book"].stock -= item_data["quantity"]

    for cart_item in cart_items:
        await db.delete(cart_item)

    await db.commit()
    await db.refresh(order)
    return order


# MY ORDERS
@router.get("/my", response_model=list[OrderRead])
async def my_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(Order.user_id == current_user.id)
    )
    return result.scalars().all()


# GET MY ORDER
@router.get("/my/{order_id}", response_model=OrderRead)
async def get_my_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.user_id == current_user.id
        )
    )
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ALL ORDERS (admin / moderator)
@router.get("/", response_model=list[OrderRead])
async def all_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    result = await db.execute(select(Order))
    return result.scalars().all()


# UPDATE STATUS (admin / moderator)
@router.patch("/{order_id}/status", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    if data.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {VALID_STATUSES}"
        )

    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = data.status
    await db.commit()
    await db.refresh(order)
    return order


# CANCEL MY ORDER
@router.patch("/my/{order_id}/cancel", response_model=OrderRead)
async def cancel_my_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.user_id == current_user.id
        )
    )
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status not in ["pending"]:
        raise HTTPException(
            status_code=400,
            detail="Can only cancel orders with status 'pending'"
        )

    order.status = "cancelled"
    await db.commit()
    await db.refresh(order)
    return order