"""
Миграция для добавления поля title_translations в таблицу slider_slides
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def upgrade():
    """Добавить поле title_translations в таблицу slider_slides"""
    with engine.connect() as conn:
        try:
            # Добавить поле title_translations
            conn.execute(text("""
                ALTER TABLE slider_slides 
                ADD COLUMN IF NOT EXISTS title_translations JSON;
            """))
            conn.commit()
            print("✅ Миграция успешно выполнена: добавлено поле title_translations в slider_slides")
        except Exception as e:
            print(f"❌ Ошибка при выполнении миграции: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    upgrade()

