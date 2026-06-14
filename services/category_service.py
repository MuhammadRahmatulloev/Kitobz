from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import Category
from repositories.category_repo import category_repo


class CategoryService:

    async def get_all(self, db: AsyncSession) -> list[Category]:
        return await category_repo.get_all(db)

    async def get_by_id(self, db: AsyncSession, category_id: int) -> Category:
        category = await category_repo.get_by_id(db, category_id)
        if category is None:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Category | None:
        return await category_repo.get_by_slug(db, slug)

    async def create(self, db: AsyncSession, **kwargs) -> Category:
        slug = kwargs.get("slug")
        if slug:
            existing = await category_repo.get_by_slug(db, slug)
            if existing:
                raise HTTPException(status_code=400, detail="Slug already exists")
        return await category_repo.create(db, **kwargs)

    async def update(self, db: AsyncSession, category_id: int, **kwargs) -> Category:
        category = await self.get_by_id(db, category_id)
        return await category_repo.update(db, category, **kwargs)

    async def delete(self, db: AsyncSession, category_id: int) -> None:
        category = await self.get_by_id(db, category_id)
        await category_repo.delete(db, category)


category_service = CategoryService()
