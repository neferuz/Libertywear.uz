"""
Скрипт для миграции таблицы social_links
Удаляет старую структуру и создает новую с JSON полем links
"""
from sqlalchemy import create_engine, text
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_social_links():
    """Миграция таблицы social_links"""
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Проверяем, существует ли таблица
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'social_links'
                );
            """))
            table_exists = result.scalar()
            
            if table_exists:
                logger.info("Таблица social_links существует. Удаляем старую структуру...")
                # Удаляем таблицу
                conn.execute(text("DROP TABLE IF EXISTS social_links CASCADE;"))
                conn.commit()
                logger.info("Старая таблица удалена.")
            else:
                logger.info("Таблица social_links не существует.")
            
            # Создаем новую таблицу с правильной структурой
            logger.info("Создаем новую таблицу social_links...")
            conn.execute(text("""
                CREATE TABLE social_links (
                    id SERIAL PRIMARY KEY,
                    links JSON,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE
                );
            """))
            conn.commit()
            logger.info("Новая таблица social_links создана успешно!")
            
            # Вставляем пустую запись по умолчанию
            logger.info("Создаем запись по умолчанию...")
            conn.execute(text("""
                INSERT INTO social_links (links) VALUES ('[]'::json);
            """))
            conn.commit()
            logger.info("Запись по умолчанию создана!")
            
            logger.info("Миграция завершена успешно!")
            
    except Exception as e:
        logger.error(f"Ошибка при миграции: {e}")
        raise

if __name__ == "__main__":
    migrate_social_links()

