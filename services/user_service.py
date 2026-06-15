from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import User
from repositories.user_repo import user_repo
from core.auth import hash_password, verify_password, create_access_token
from core.mail import send_registration_email


ALLOWED_ROLES = ["user", "moderator", "admin"]


class UserService:

    async def register(self, db: AsyncSession, **kwargs) -> User:
        phone = kwargs.get("phone")
        if phone:
            existing = await user_repo.get_by_phone(db, phone)
            if existing:
                raise HTTPException(status_code=400, detail="Phone already exists")

        email = kwargs.get("email")
        if email:
            existing = await user_repo.get_by_email(db, email)
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")

        password = kwargs.pop("password", None)
        if password:
            kwargs["password_hash"] = hash_password(password)

        user = await user_repo.create(db, **kwargs)

        if email and password:
            try:
                await send_registration_email(
                    to_email=email,
                    username=user.username or email,
                    password=password
                )
            except Exception:
                pass

        return user

    async def login(self, db: AsyncSession, email: str, password: str) -> dict:
        user = await user_repo.get_by_email(db, email)
        if user is None or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")
        token = create_access_token({"user_id": user.id})
        return {"access_token": token, "token_type": "bearer"}

    async def get_by_id(self, db: AsyncSession, user_id: int) -> User:
        user = await user_repo.get_by_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    async def update(self, db: AsyncSession, user: User, **kwargs) -> User:
        return await user_repo.update(db, user, **kwargs)

    async def get_all(self, db: AsyncSession) -> list[User]:
        return await user_repo.get_all(db)

    async def toggle_premium(self, db: AsyncSession, user_id: int) -> User:
        user = await self.get_by_id(db, user_id)
        user.is_premium = not user.is_premium
        return await user_repo.update(db, user)

    async def change_role(self, db: AsyncSession, user_id: int, role: str) -> User:
        if role not in ALLOWED_ROLES:
            raise HTTPException(
                status_code=400,
                detail=f"Role must be one of: {ALLOWED_ROLES}"
            )
        user = await self.get_by_id(db, user_id)
        user.role = role
        return await user_repo.update(db, user)

    async def deactivate(self, db: AsyncSession, user_id: int) -> User:
        user = await self.get_by_id(db, user_id)
        user.is_active = False
        return await user_repo.update(db, user)


user_service = UserService()