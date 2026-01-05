#!/usr/bin/env python3
"""
Простой скрипт для создания таблицы site_settings через SQLAlchemy
"""
import sys
import os
from pathlib import Path

# Добавляем корневую директорию проекта в путь
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Пытаемся использовать виртуальное окружение, если оно есть
venv_python = backend_dir / "venv" / "bin" / "python"
if venv_python.exists():
    print(f"ℹ️  Найдено виртуальное окружение: {venv_python}")
    print(f"⚠️  Запустите скрипт через: {venv_python} {__file__}")
    print(f"   Или активируйте venv: source venv/bin/activate")

try:
    from sqlalchemy import create_engine, text
    from app.config import settings
except ImportError as e:
    print(f"❌ Ошибка импорта: {e}")
    print(f"💡 Убедитесь, что виртуальное окружение активировано:")
    print(f"   cd {backend_dir}")
    print(f"   source venv/bin/activate")
    print(f"   python migrations/create_site_settings.py")
    sys.exit(1)

def create_site_settings_table():
    """Создает таблицу site_settings и добавляет начальную настройку"""
    
    SQL = """
    -- Создание таблицы site_settings
    CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        description VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
    );

    -- Создание индекса
    CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

    -- Добавление начальной настройки (если её еще нет)
    INSERT INTO site_settings (key, value, description)
    VALUES ('show_partners_block', 'true', 'Показывать блок партнеров на главной странице')
    ON CONFLICT (key) DO NOTHING;
    """
    
    try:
        print("🔄 Подключение к базе данных...")
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True
        )
        
        print("🔄 Создание таблицы site_settings...")
        with engine.connect() as connection:
            # Выполняем SQL команды по отдельности
            commands = [
                """CREATE TABLE IF NOT EXISTS site_settings (
                    id SERIAL PRIMARY KEY,
                    key VARCHAR(255) UNIQUE NOT NULL,
                    value TEXT,
                    description VARCHAR(500),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE
                )""",
                """CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key)""",
                """INSERT INTO site_settings (key, value, description)
                   VALUES ('show_partners_block', 'true', 'Показывать блок партнеров на главной странице')
                   ON CONFLICT (key) DO NOTHING"""
            ]
            
            for i, command in enumerate(commands, 1):
                try:
                    connection.execute(text(command))
                    connection.commit()
                    print(f"✅ Команда {i}/{len(commands)} выполнена успешно")
                except Exception as e:
                    error_msg = str(e).lower()
                    if 'already exists' in error_msg or 'duplicate' in error_msg:
                        print(f"⚠️  Команда {i}/{len(commands)} пропущена (уже существует)")
                    else:
                        print(f"❌ Ошибка при выполнении команды {i}: {e}")
                        raise
        
        print("\n✅ Миграция успешно применена!")
        print("✅ Таблица site_settings создана")
        print("✅ Начальная настройка show_partners_block = 'true' добавлена")
        print("\n📝 Теперь можно управлять блоком партнеров через API:")
        print("   GET  /api/site-settings/value/show_partners_block")
        print("   PUT  /api/site-settings/show_partners_block")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Ошибка при применении миграции: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    success = create_site_settings_table()
    sys.exit(0 if success else 1)

