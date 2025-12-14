"""
Скрипт для инициализации базы данных PostgreSQL
Создает базу данных если её нет
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.config import settings
import sys

def create_database():
    """Создание базы данных если её нет"""
    # Парсим DATABASE_URL
    db_url = settings.DATABASE_URL
    if not db_url.startswith("postgresql://"):
        print("Ошибка: DATABASE_URL должен начинаться с postgresql://")
        sys.exit(1)
    
    # Извлекаем параметры подключения
    url_parts = db_url.replace("postgresql://", "").split("/")
    if len(url_parts) != 2:
        print("Ошибка: Неверный формат DATABASE_URL")
        sys.exit(1)
    
    auth_part = url_parts[0]
    db_name = url_parts[1]
    
    if "@" in auth_part:
        user_pass, host_port = auth_part.split("@")
        if ":" in user_pass:
            user, password = user_pass.split(":")
        else:
            user = user_pass
            password = ""
        
        if ":" in host_port:
            host, port = host_port.split(":")
        else:
            host = host_port
            port = "5432"
    else:
        user = "postgres"
        password = ""
        host = "localhost"
        port = "5432"
    
    # Подключаемся к postgres для создания БД
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database="postgres"  # Подключаемся к системной БД
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Проверяем существование БД
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (db_name,)
        )
        exists = cursor.fetchone()
        
        if not exists:
            # Создаем БД
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"База данных '{db_name}' успешно создана")
        else:
            print(f"База данных '{db_name}' уже существует")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"Ошибка при создании базы данных: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Инициализация базы данных PostgreSQL...")
    create_database()
    print("Готово!")

