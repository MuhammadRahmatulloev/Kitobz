from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from models.models import User
from schemas.schemas import ReviewCreate, ReviewRead
from core.auth import get_current_user
from services.review_service import review_service

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/book/{book_id}", response_model=list[ReviewRead])
async def list_reviews(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await review_service.get_by_book(db, book_id)


@router.post("/book/{book_id}", response_model=ReviewRead, status_code=201)
async def add_review(
    book_id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await review_service.create(
        db, current_user.id, book_id, data.rating, data.comment
    )


@router.delete("/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await review_service.delete(db, review_id, current_user)
