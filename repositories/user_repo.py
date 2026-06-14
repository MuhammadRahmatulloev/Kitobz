from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import User


class UserRepository:

    async def get_by_id(self, db: AsyncSession, user_id: int) -> User | None:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_phone(self, db: AsyncSession, phone: str) -> User | None:
        result = await db.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession) -> list[User]:
        result = await db.execute(select(User))
        return result.scalars().all()

    async def create(self, db: AsyncSession, **kwargs) -> User:
        user = User(**kwargs)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    async def update(self, db: AsyncSession, user: User, **kwargs) -> User:
        for field, value in kwargs.items():
            setattr(user, field, value)
        await db.commit()
        await db.refresh(user)
        return user


user_repo = UserRepository()