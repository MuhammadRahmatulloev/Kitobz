from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import OrderCreate, OrderRead, OrderStatusUpdate
from core.auth import get_current_user, require_moderator
from services.order_service import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderRead, status_code=201)
async def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await order_service.create_from_cart(
        db, current_user,
        delivery_address=data.delivery_address,
        delivery_city=data.delivery_city,
        is_dushanbe=data.is_dushanbe
    )


@router.get("/my", response_model=list[OrderRead])
async def my_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await order_service.get_user_orders(db, current_user.id)


@router.get("/my/{order_id}", response_model=OrderRead)
async def get_my_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await order_service.get_user_order(db, order_id, current_user.id)


@router.get("/", response_model=list[OrderRead])
async def all_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    return await order_service.get_all(db)


@router.patch("/{order_id}/status", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    return await order_service.update_status(db, order_id, data.status)


@router.patch("/my/{order_id}/cancel", response_model=OrderRead)
async def cancel_my_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await order_service.cancel(db, order_id, current_user.id)
