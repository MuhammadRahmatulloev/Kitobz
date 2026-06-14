from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import CartItem, Book, User
from schemas.schemas import CartItemCreate, CartItemRead, CartItemUpdate
from core.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


# MY CART
@router.get("/", response_model=list[CartItemRead])
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == current_user.id)
    )
    return result.scalars().all()


# ADD TO CART
@router.post("/", response_model=CartItemRead, status_code=201)
async def add_to_cart(
    data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    book_result = await db.execute(select(Book).where(Book.id == data.book_id))
    book = book_result.scalar_one_or_none()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    if not book.is_available or book.stock < 1:
        raise HTTPException(status_code=400, detail="Book is not available")

    result = await db.execute(
        select(CartItem).where(
            CartItem.user_id == current_user.id,
            CartItem.book_id == data.book_id
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.quantity += data.quantity
        await db.commit()
        await db.refresh(existing)
        return existing

    item = CartItem(
        user_id=current_user.id,
        book_id=data.book_id,
        quantity=data.quantity
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


# UPDATE QUANTITY
@router.patch("/{item_id}", response_model=CartItemRead)
async def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == item_id,
            CartItem.user_id == current_user.id
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if data.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    item.quantity = data.quantity
    await db.commit()
    await db.refresh(item)
    return item


# REMOVE ITEM
@router.delete("/{item_id}", status_code=204)
async def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == item_id,
            CartItem.user_id == current_user.id
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.delete(item)
    await db.commit()


# CLEAR CART
@router.delete("/", status_code=204)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == current_user.id)
    )
    items = result.scalars().all()
    for item in items:
        await db.delete(item)
    await db.commit()