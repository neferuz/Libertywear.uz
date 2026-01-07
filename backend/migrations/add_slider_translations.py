"""
Миграция для добавления полей переводов в таблицу slider_slides
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def upgrade():
    """Добавить новые поля для переводов в таблицу slider_slides"""
    with engine.connect() as conn:
        try:
            # Добавить новые поля для переводов
            conn.execute(text("""
                ALTER TABLE slider_slides 
                ADD COLUMN IF NOT EXISTS tag_translations JSON,
                ADD COLUMN IF NOT EXISTS headline_translations JSON,
                ADD COLUMN IF NOT EXISTS description_translations JSON,
                ADD COLUMN IF NOT EXISTS cta_text_translations JSON,
                ADD COLUMN IF NOT EXISTS cta_link VARCHAR(255);
            """))
            conn.commit()
            print("✅ Миграция успешно выполнена: добавлены поля для переводов в slider_slides")
        except Exception as e:
            print(f"❌ Ошибка при выполнении миграции: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    upgrade()

