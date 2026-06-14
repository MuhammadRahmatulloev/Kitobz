# FastAPI JWT Authentication

## 1. Установка библиотек

```bash
pip install fastapi uvicorn sqlalchemy "python-jose[cryptography]" passlib bcrypt==4.0.1
```

Проверка JWT:

```bash
python -c "from jose import jwt; print('JWT OK')"
```

---

## 2. Структура проекта
x1
```text
FastAPPI/
│
├── main.py 
├── database.py
├── models.py
├── schemas.py
└── auth.py
```

---

## 3. database.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


DATABASE_URL = "sqlite:///./database.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

### Назначение файла

```text
engine       -> подключение к базе данных
SessionLocal -> создание сессии для работы с базой
Base         -> базовый класс для моделей SQLAlchemy
get_db       -> dependency для получения database session
```

---

## 4. models.py

```python
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )
```

### Важный момент

Пароль нельзя хранить в базе в открытом виде:

```python
password = "12345"
```

Правильный вариант — хранить только хеш пароля:

```python
password_hash = "$2b$12$..."
```

---

## 5. schemas.py

```python
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class LoginSchema(BaseModel):
    username: str
    password: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str
```

### Назначение схем

```text
UserCreate  -> данные для регистрации
UserRead    -> данные пользователя, которые возвращаются клиенту
LoginSchema -> данные для входа
TokenSchema -> ответ после успешного login
```

---

## 6. auth.py

```python
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User


SECRET_KEY = "CHANGE_THIS_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


auth_header = APIKeyHeader(
    name="Authorization",
    auto_error=False
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def get_current_user(
    authorization: str = Depends(auth_header),
    db: Session = Depends(get_db)
):
    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format. Use: Bearer <token>"
        )

    token = authorization.replace("Bearer ", "", 1).strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token is empty"
        )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user
```

### Назначение файла

```text
hash_password       -> хеширует пароль
verify_password     -> проверяет пароль
create_access_token -> создаёт JWT token
get_current_user    -> проверяет Authorization header и возвращает текущего пользователя
```

---

## 7. main.py

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User
from schemas import UserCreate, UserRead, LoginSchema, TokenSchema
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="FastAPI JWT Auth",
    description="JWT Authentication with manual Bearer token",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "FastAPI JWT Auth is running"
    }


@app.post("/register", response_model=UserRead)
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login", response_model=TokenSchema)
def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/me", response_model=UserRead)
def me(
    current_user: User = Depends(get_current_user)
):
    return current_user
```

---

## 8. Запуск проекта

```bash
uvicorn main:app --reload
```

Открыть Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 9. Проверка через Swagger

### 1. Register

Endpoint:

```text
POST /register
```

Body:

```json
{
  "username": "hakim",
  "email": "hakim@gmail.com",
  "password": "12345"
}
```

Ответ:

```json
{
  "id": 1,
  "username": "hakim",
  "email": "hakim@gmail.com",
  "is_active": true
}
```

---

### 2. Login

Endpoint:

```text
POST /login
```

Body:

```json
{
  "username": "hakim",
  "password": "12345"
}
```

Ответ:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

### 3. Authorize

В Swagger нажимается кнопка:

```text
Authorize
```

В поле `Authorization` вставляется значение в таком формате:

```text
Bearer eyJhbGciOiJIUzI1NiIs...
```

Формат должен быть именно такой:

```text
Bearer <token>
```

---

### 4. Проверка protected endpoint

Endpoint:

```text
GET /me
```

Если token правильный, вернётся текущий пользователь:

```json
{
  "id": 1,
  "username": "hakim",
  "email": "hakim@gmail.com",
  "is_active": true
}
```

---

## 10. Основная логика JWT

```text
1. Пользователь проходит регистрацию
2. Пароль хешируется
3. В базе сохраняется password_hash
4. Пользователь отправляет username и password на /login
5. Backend проверяет username и password
6. Backend создаёт JWT token
7. Клиент получает access_token
8. Клиент отправляет token в Authorization header
9. Формат header: Bearer <token>
10. Backend проверяет token
11. Если token правильный, доступ разрешается
```

---

## 11. Частые ошибки

### 422 Unprocessable Entity

Причина: данные на `/login` отправлены не в формате JSON.

Правильно:

```json
{
  "username": "hakim",
  "password": "12345"
}
```

---

### Authorization header missing

Причина: не был передан header `Authorization`.

---

### Invalid authorization format

Причина: token передан без слова `Bearer`.

Неправильно:

```text
eyJhbGciOiJIUzI1NiIs...
```

Правильно:

```text
Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### Invalid token

Возможные причины:

```text
token истёк
token повреждён
token создан с другим SECRET_KEY
token не является JWT
```

---

### trapped error reading bcrypt version

Исправление:

```bash
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

После этого сервер перезапускается:

```bash
uvicorn main:app --reload
```

---

## Итоговая схема

```text
/register -> создаёт пользователя
/login    -> проверяет username/password и возвращает JWT
Authorize -> вставляется Bearer <token>
/me       -> проверяет token и возвращает текущего пользователя
```

Правильная связка для ручного Bearer token:

```text
Login request -> JSON
Authorization -> Bearer <token>
Security      -> APIKeyHeader(name="Authorization")
```
