"""
Скрипт для добавления колонки show_on_homepage в таблицу categories
"""
from app.database import engine
from sqlalchemy import text

def add_show_on_homepage_column():
    """Добавляет колонку show_on_homepage в таблицу categories если её нет"""
    
    with engine.connect() as conn:
        try:
            # Проверяем, существует ли колонка
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='categories' AND column_name='show_on_homepage'
            """)
            result = conn.execute(check_query)
            
            if result.fetchone() is None:
                # Добавляем колонку если её нет
                # Используем BOOLEAN для PostgreSQL или INTEGER для других БД
                alter_query = text("""
                    ALTER TABLE categories 
                    ADD COLUMN show_on_homepage BOOLEAN DEFAULT FALSE
                """)
                conn.execute(alter_query)
                conn.commit()
                print("✅ Колонка show_on_homepage добавлена в таблицу categories")
            else:
                print("ℹ️ Колонка show_on_homepage уже существует")
        except Exception as e:
            # Если BOOLEAN не поддерживается, пробуем INTEGER
            try:
                alter_query = text("""
                    ALTER TABLE categories 
                    ADD COLUMN show_on_homepage INTEGER DEFAULT 0
                """)
                conn.execute(alter_query)
                conn.commit()
                print("✅ Колонка show_on_homepage добавлена (как INTEGER)")
            except Exception as e2:
                print(f"❌ Ошибка при добавлении колонки: {e2}")
                raise
        
        print("\n✅ Миграция завершена успешно!")

if __name__ == "__main__":
    add_show_on_homepage_column()

