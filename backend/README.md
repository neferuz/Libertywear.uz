# Liberty Backend API

Backend API для интернет-магазина Liberty на FastAPI.

## Установка

1. Установите PostgreSQL на вашем компьютере:
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql` или https://www.postgresql.org/download/macosx/
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

5. Настройте PostgreSQL в `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/liberty_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

6. (Опционально) Настройка SMTP для отправки email:
   - Если SMTP не настроен, коды подтверждения будут выводиться в консоль сервера
   - Для реальной отправки email настройте в `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@liberty.uz
SMTP_FROM_NAME=Liberty
```

7. Создайте базу данных (опционально, скрипт создаст автоматически):
```bash
python init_db.py
```

Или создайте вручную:
```sql
CREATE DATABASE liberty_db;
```

## Запуск

```bash
python main.py
```

Или через uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: `http://localhost:8000`

Документация API: `http://localhost:8000/docs`

## Структура проекта

```
backend/
├── main.py              # Главный файл приложения
├── requirements.txt     # Зависимости
├── env.example         # Пример переменных окружения
├── .gitignore          # Git ignore файл
├── app/
│   ├── __init__.py
│   ├── config.py       # Конфигурация приложения
│   ├── models/         # Модели базы данных (SQLAlchemy)
│   ├── schemas/        # Pydantic схемы (валидация данных)
│   ├── routers/        # API роутеры
│   │   └── products.py # Пример роутера для товаров
│   ├── services/       # Бизнес-логика
│   └── utils/          # Утилиты (JWT, хеширование и т.д.)
└── README.md
```

## Следующие шаги

1. Настроить подключение к базе данных (PostgreSQL)
2. Создать модели данных (User, Product, Order, Cart и т.д.)
3. Реализовать аутентификацию и авторизацию (JWT)
4. Создать CRUD операции для товаров
5. Реализовать корзину и заказы
6. Добавить поиск и фильтрацию

