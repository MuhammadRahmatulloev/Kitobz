from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import Review, Book, User
from repositories.review_repo import review_repo
from repositories.book_repo import book_repo


class ReviewService:

    async def get_by_book(self, db: AsyncSession, book_id: int) -> list[Review]:
        return await review_repo.get_by_book(db, book_id)

    async def create(
        self, db: AsyncSession, user_id: int, book_id: int, rating: int, comment: str | None = None
    ) -> Review:
        book = await book_repo.get_by_id(db, book_id)
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")

        existing_reviews = await review_repo.get_by_book(db, book_id)
        for r in existing_reviews:
            if r.user_id == user_id:
                raise HTTPException(status_code=400, detail="You already reviewed this book")

        if not (1 <= rating <= 5):
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

        return await review_repo.create(
            db, user_id=user_id, book_id=book_id, rating=rating, comment=comment
        )

    async def delete(self, db: AsyncSession, review_id: int, current_user: User) -> None:
        review = await review_repo.get_by_id(db, review_id)
        if review is None:
            raise HTTPException(status_code=404, detail="Review not found")
        if review.user_id != current_user.id and current_user.role not in ["admin", "moderator"]:
            raise HTTPException(status_code=403, detail="Permission denied")
        await review_repo.delete(db, review)


review_service = ReviewService()
