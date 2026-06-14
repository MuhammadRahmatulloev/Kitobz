from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import Review


class ReviewRepository:

    async def get_by_id(self, db: AsyncSession, review_id: int) -> Review | None:
        result = await db.execute(select(Review).where(Review.id == review_id))
        return result.scalar_one_or_none()

    async def get_by_book(self, db: AsyncSession, book_id: int) -> list[Review]:
        result = await db.execute(
            select(Review).where(Review.book_id == book_id)
        )
        return result.scalars().all()

    async def get_by_user(self, db: AsyncSession, user_id: int) -> list[Review]:
        result = await db.execute(
            select(Review).where(Review.user_id == user_id)
        )
        return result.scalars().all()

    async def get_all(self, db: AsyncSession) -> list[Review]:
        result = await db.execute(select(Review))
        return result.scalars().all()

    async def create(self, db: AsyncSession, **kwargs) -> Review:
        review = Review(**kwargs)
        db.add(review)
        await db.commit()
        await db.refresh(review)
        return review

    async def update(self, db: AsyncSession, review: Review, **kwargs) -> Review:
        for field, value in kwargs.items():
            setattr(review, field, value)
        await db.commit()
        await db.refresh(review)
        return review

    async def delete(self, db: AsyncSession, review: Review) -> None:
        await db.delete(review)
        await db.commit()


review_repo = ReviewRepository()
