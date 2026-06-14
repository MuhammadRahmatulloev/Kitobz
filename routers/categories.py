from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import Category, User
from schemas.schemas import CategoryCreate, CategoryRead, CategoryUpdate
from core.auth import require_admin, require_moderator

router = APIRouter(prefix="/categories", tags=["Categories"])


def load_categories():
    return selectinload(Category.subcategories).selectinload(Category.subcategories)


@router.get("/", response_model=list[CategoryRead])
async def list_categories(db: AsyncSession = Depends(get_db)):
    query = (
        select(Category)
        .where(Category.parent_id == None)
        .options(load_categories())
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Category)
        .where(Category.id == category_id)
        .options(load_categories())
    )
    result = await db.execute(query)
    category = result.scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/", response_model=CategoryRead, status_code=201)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    result = await db.execute(select(Category).where(Category.slug == data.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")

    category = Category(**data.model_dump())
    db.add(category)
    await db.commit()

    query = (
        select(Category)
        .where(Category.id == category.id)
        .options(load_categories())
    )
    result = await db.execute(query)
    return result.scalar_one()


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_moderator)
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(category, field, value)

    await db.commit()

    query = (
        select(Category)
        .where(Category.id == category_id)
        .options(load_categories())
    )
    result = await db.execute(query)
    return result.scalar_one()


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(category)
    await db.commit()
