from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Импорт роутеров
from app.routers import auth, products, users, categories, pages, upload, contact_messages
from app.routers import cart as cart_router, payme, orders, slider, favorites, social_links
from app.database import Base, engine

# Импорт всех моделей для создания таблиц
from app.models import user, page_content, contact_message, category, product, cart, payment, order, slider as slider_model, favorite, social_links as social_links_model

# Создание таблиц в БД (только если их нет)
# В продакшене используйте Alembic для миграций
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Таблицы базы данных проверены/созданы")
except Exception as e:
    logger.error(f"Ошибка при создании таблиц: {e}")
    logger.error("Убедитесь, что PostgreSQL запущен и DATABASE_URL правильный")

app = FastAPI(
    title="Liberty API",
    description="API для интернет-магазина Liberty",
    version="1.0.0"
)

# CORS middleware для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://192.168.0.51:3000",
        "http://192.168.0.51:3001",
        "http://192.168.0.51:3002",
        "http://192.168.0.108:3000",
        "http://192.168.0.108:3001",
        "http://192.168.0.108:3002",
        "http://192.168.0.108:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(pages.router)
app.include_router(upload.router)
app.include_router(contact_messages.router)
app.include_router(cart_router.router)
app.include_router(payme.router)
app.include_router(orders.router)
app.include_router(slider.router)
app.include_router(favorites.router)
app.include_router(social_links.router)

# Подключение статических файлов для загруженных изображений
uploads_dir = Path("uploads")
if uploads_dir.exists():
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Liberty API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Обработчик исключений для отправки CORS заголовков даже при ошибках
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
    # Добавляем CORS заголовки
    origin = request.headers.get("origin")
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://192.168.0.108:3000",
        "http://192.168.0.108:3001",
        "http://192.168.0.108:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://192.168.0.51:3000",
        "http://192.168.0.51:3001",
        "http://192.168.0.51:3002",
    ]
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

