"""
Скрипт для добавления новых колонок в таблицу products
"""
from app.database import engine
from sqlalchemy import text

def add_product_columns():
    """Добавляет новые колонки в таблицу products если их нет"""
    columns_to_add = [
        ("description_title", "TEXT"),
        ("material", "TEXT"),
        ("branding", "TEXT"),
        ("packaging", "TEXT"),
        ("size_guide", "TEXT"),
        ("delivery_info", "TEXT"),
        ("return_info", "TEXT"),
        ("exchange_info", "TEXT"),
    ]
    
    with engine.connect() as conn:
        for column_name, column_type in columns_to_add:
            try:
                # Проверяем, существует ли колонка
                check_query = text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='products' AND column_name='{column_name}'
                """)
                result = conn.execute(check_query)
                if result.fetchone() is None:
                    # Добавляем колонку если её нет
                    alter_query = text(f"ALTER TABLE products ADD COLUMN {column_name} {column_type}")
                    conn.execute(alter_query)
                    print(f"✓ Добавлена колонка {column_name}")
                else:
                    print(f"- Колонка {column_name} уже существует")
            except Exception as e:
                print(f"✗ Ошибка при добавлении колонки {column_name}: {e}")
        
        conn.commit()
        print("\nГотово! Все колонки добавлены.")

if __name__ == "__main__":
    add_product_columns()

