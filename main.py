from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.db import engine, Base
from routers import users, books, categories, cart, orders, reviews

app = FastAPI(
    title="Kitobz API",
    description="Первый книжный онлайн-магазин в Таджикистане 📚",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")


app.include_router(users.router)
app.include_router(categories.router)
app.include_router(books.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(reviews.router)


@app.get("/", tags=["Root"])
async def home():
    return {
        "message": "Welcome to Kitobz API 📚",
        "docs": "/docs",
        "version": "1.0.0"
    }