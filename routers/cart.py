from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import CartItemCreate, CartItemRead, CartItemUpdate
from core.auth import get_current_user
from services.cart_service import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/", response_model=list[CartItemRead])
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await cart_service.get_cart(db, current_user.id)


@router.post("/", response_model=CartItemRead, status_code=201)
async def add_to_cart(
    data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await cart_service.add_item(
        db, current_user.id, data.book_id, data.quantity
    )


@router.patch("/{item_id}", response_model=CartItemRead)
async def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await cart_service.update_quantity(
        db, current_user.id, item_id, data.quantity
    )


@router.delete("/{item_id}", status_code=204)
async def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await cart_service.remove_item(db, current_user.id, item_id)


@router.delete("/", status_code=204)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await cart_service.clear_cart(db, current_user.id)
