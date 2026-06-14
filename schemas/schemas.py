from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


# USER
class UserCreate(BaseModel):
    username: Optional[str] = None
    phone: str
    email: Optional[str] = None
    password: str

class UserRead(BaseModel):
    id: int
    username: Optional[str]
    phone: str
    email: Optional[str]
    role: str
    is_active: bool
    is_premium: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class LoginSchema(BaseModel):
    email: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str


# CATEGORY
class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryRead(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    parent_id: Optional[int]
    created_at: datetime
    subcategories: list["CategoryRead"] = []
    model_config = ConfigDict(from_attributes=True)

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None


# BOOK
class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    cover_image: Optional[str] = None
    isbn: Optional[str] = None
    pages: Optional[int] = None
    language: Optional[str] = None
    published_year: Optional[int] = None
    category_id: Optional[int] = None

class BookRead(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str]
    price: float
    stock: int
    cover_image: Optional[str]
    isbn: Optional[str]
    pages: Optional[int]
    language: Optional[str]
    published_year: Optional[int]
    is_available: bool
    category_id: Optional[int]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    cover_image: Optional[str] = None
    isbn: Optional[str] = None
    pages: Optional[int] = None
    language: Optional[str] = None
    published_year: Optional[int] = None
    is_available: Optional[bool] = None
    category_id: Optional[int] = None


# CART
class CartItemCreate(BaseModel):
    book_id: int
    quantity: int = 1

class CartItemRead(BaseModel):
    id: int
    book_id: int
    quantity: int
    book: BookRead
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CartItemUpdate(BaseModel):
    quantity: int


# ORDER
class OrderItemRead(BaseModel):
    id: int
    book_id: int
    quantity: int
    price_at_order: float
    book: BookRead
    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    delivery_address: Optional[str] = None
    delivery_city: Optional[str] = None
    is_dushanbe: bool = True

class OrderRead(BaseModel):
    id: int
    status: str
    total_price: float
    delivery_address: Optional[str]
    delivery_city: Optional[str]
    delivery_cost: float
    created_at: datetime
    items: list[OrderItemRead]
    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    status: str


# REVIEW 
class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewRead(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    user_id: int
    book_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)