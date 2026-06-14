from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import Review, Book, User
from schemas.schemas import ReviewCreate, ReviewRead
from core.auth import get_current_user, require_moderator

router = APIRouter(prefix="/reviews", tags=["Reviews"])


# LIST REVIEWS FOR BOOK
@router.get("/book/{book_id}", response_model=list[ReviewRead])
async def list_reviews(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Review).where(Review.book_id == book_id)
    )
    return result.scalars().all()


# ADD REVIEW
@router.post("/book/{book_id}", response_model=ReviewRead, status_code=201)
async def add_review(
    book_id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    book_result = await db.execute(select(Book).where(Book.id == book_id))
    if book_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Book not found")

    existing = await db.execute(
        select(Review).where(
            Review.user_id == current_user.id,
            Review.book_id == book_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You already reviewed this book")

    if not (1 <= data.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    review = Review(
        user_id=current_user.id,
        book_id=book_id,
        rating=data.rating,
        comment=data.comment
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


# DELETE REVIEW (owner / moderator / admin)
@router.delete("/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.user_id != current_user.id and current_user.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Permission denied")

    await db.delete(review)
    await db.commit()