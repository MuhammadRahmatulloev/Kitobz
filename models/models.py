from sqlalchemy import String, Integer, Boolean, DateTime, Float, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional
from core.db import Base


# USER
class User(Base):
    __tablename__="users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )
    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=True
    )
    phone: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=True
    )
    password_hash: Mapped[str] = mapped_column(
        String(300),
        nullable=False
    )
    role: Mapped[str] = mapped_column(
        String(60),
        default="user"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )
    is_premium: Mapped[bool] = mapped_column(
        Boolean, 
        default=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()     
    )

    orders: Mapped[list["Order"]] = relationship(
        back_populates="user"
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        back_populates="user"
    )
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="user"
    )


# CATEGORY
class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        nullable=False
    )
    slug: Mapped[str] = mapped_column(
        String(120), 
        unique=True, 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        Text, 
        nullable=True
    )
    parent_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now()
    )

    books: Mapped[list["Book"]] = relationship(
        back_populates="category"
    )
    parent: Mapped[Optional["Category"]] = relationship(
        "Category",
        remote_side=[id],
        back_populates="subcategories"
    )
    subcategories: Mapped[list["Category"]] = relationship(
        "Category",
        back_populates="parent"
    )


# BOOK
class Book(Base):
    __tablename__ = "books"
 
    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    title: Mapped[str] = mapped_column(
        String(300), 
        nullable=False, 
        index=True
    )
    author: Mapped[str] = mapped_column(
        String(200), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        Text, 
        nullable=True
    )
    price: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    stock: Mapped[int] = mapped_column(
        Integer, 
        default=0
    )
    cover_image: Mapped[str] = mapped_column(
        String(500), 
        nullable=True
    )
    isbn: Mapped[str] = mapped_column(
        String(20), 
        unique=True, 
        nullable=True
    )
    pages: Mapped[int] = mapped_column(
        Integer, 
        nullable=True
    )
    language: Mapped[str] = mapped_column(
        String(50), 
        nullable=True
    )
    published_year: Mapped[int] = mapped_column(
        Integer, 
        nullable=True
    )
    is_available: Mapped[bool] = mapped_column(
        Boolean, 
        default=True
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now(), 
        onupdate=func.now()
    )
 
    category: Mapped["Category"] = relationship(
        back_populates="books"
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        back_populates="book"
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        back_populates="book"
    )
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="book"
    )



# CART ITEM
class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    quantity: Mapped[int] = mapped_column(
        Integer, 
        default=1
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False
    )
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id"), 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="cart_items"
    )
    book: Mapped["Book"] = relationship(
        back_populates="cart_items"
    )


# ORDER
class Order(Base):
    __tablename__ = "orders"
 
    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="pending"
    )
    total_price: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    delivery_address: Mapped[str] = mapped_column(
        String(500), 
        nullable=True
    )
    delivery_city: Mapped[str] = mapped_column(
        String(100), 
        nullable=True
    )
    delivery_cost: Mapped[float] = mapped_column(
        Float, 
        default=5.0
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
 
    user: Mapped["User"] = relationship(
        back_populates="orders"
    )
    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order"
    )


# ORDER ITEM
class OrderItem(Base):
    __tablename__ = "order_items"
 
    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    quantity: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    price_at_order: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"), 
        nullable=False
    )
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id"), 
        nullable=False
    )
 
    order: Mapped["Order"] = relationship(
        back_populates="items"
    )
    book: Mapped["Book"] = relationship(
        back_populates="order_items"
    )


# REVIEW
class Review(Base):
    __tablename__ = "reviews"
 
    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
    )
    rating: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    comment: Mapped[str] = mapped_column(
        Text, 
        nullable=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False
    )
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id"), 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=func.now()
    )
 
    user: Mapped["User"] = relationship(back_populates="reviews")
    book: Mapped["Book"] = relationship(back_populates="reviews")
