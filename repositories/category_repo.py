from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import Category


def _with_subcategories():
    return selectinload(Category.subcategories).selectinload(Category.subcategories)


class CategoryRepository:

    async def get_all(self, db: AsyncSession) -> list[Category]:
        result = await db.execute(
            select(Category)
            .where(Category.parent_id == None)
            .options(_with_subcategories())
        )
        return result.scalars().all()

    async def get_by_id(self, db: AsyncSession, category_id: int) -> Category | None:
        result = await db.execute(
            select(Category)
            .where(Category.id == category_id)
            .options(_with_subcategories())
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Category | None:
        result = await db.execute(select(Category).where(Category.slug == slug))
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, **kwargs) -> Category:
        category = Category(**kwargs)
        db.add(category)
        await db.commit()
        result = await db.execute(
            select(Category)
            .where(Category.id == category.id)
            .options(_with_subcategories())
        )
        return result.scalar_one()

    async def update(self, db: AsyncSession, category: Category, **kwargs) -> Category:
        for field, value in kwargs.items():
            setattr(category, field, value)
        await db.commit()
        result = await db.execute(
            select(Category)
            .where(Category.id == category.id)
            .options(_with_subcategories())
        )
        return result.scalar_one()

    async def delete(self, db: AsyncSession, category: Category) -> None:
        await db.delete(category)
        await db.commit()


category_repo = CategoryRepository()