#!/usr/bin/env python3
"""
Упрощенный скрипт миграции - использует только psycopg2 для прямого подключения к БД
Не требует SQLAlchemy
"""
import sys
import os
from pathlib import Path

def get_db_config():
    """Получает настройки БД из переменных окружения или config"""
    # Пытаемся импортировать из config
    try:
        backend_dir = Path(__file__).parent.parent
        sys.path.insert(0, str(backend_dir))
        from app.config import settings
        db_url = settings.DATABASE_URL
    except:
        # Если не получилось, используем переменные окружения
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            print("❌ Не удалось найти DATABASE_URL")
            print("💡 Установите переменную окружения DATABASE_URL")
            sys.exit(1)
    
    # Парсим DATABASE_URL (формат: postgresql://user:password@host:port/dbname)
    from urllib.parse import urlparse
    parsed = urlparse(db_url)
    
    return {
        'host': parsed.hostname,
        'port': parsed.port or 5432,
        'database': parsed.path.lstrip('/'),
        'user': parsed.username,
        'password': parsed.password
    }

def create_site_settings_table():
    """Создает таблицу site_settings используя psycopg2"""
    
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    except ImportError:
        print("❌ Модуль psycopg2 не установлен")
        print("💡 Установите: pip install psycopg2-binary")
        sys.exit(1)
    
    db_config = get_db_config()
    
    SQL_COMMANDS = [
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
    
    try:
        print("🔄 Подключение к базе данных...")
        conn = psycopg2.connect(**db_config)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        print("🔄 Создание таблицы site_settings...")
        for i, command in enumerate(SQL_COMMANDS, 1):
            try:
                cur.execute(command)
                print(f"✅ Команда {i}/{len(SQL_COMMANDS)} выполнена успешно")
            except Exception as e:
                error_msg = str(e).lower()
                if 'already exists' in error_msg or 'duplicate' in error_msg:
                    print(f"⚠️  Команда {i}/{len(SQL_COMMANDS)} пропущена (уже существует)")
                else:
                    print(f"❌ Ошибка при выполнении команды {i}: {e}")
                    raise
        
        cur.close()
        conn.close()
        
        print("\n✅ Миграция успешно применена!")
        print("✅ Таблица site_settings создана")
        print("✅ Начальная настройка show_partners_block = 'true' добавлена")
        print("\n📝 Теперь можно управлять блоком партнеров через API:")
        print("   GET  /api/site-settings/value/show_partners_block")
        print("   PUT  /api/site-settings/show_partners_block")
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"\n❌ Ошибка подключения к базе данных: {e}")
        print(f"💡 Проверьте настройки подключения в DATABASE_URL")
        return False
    except Exception as e:
        print(f"\n❌ Ошибка при применении миграции: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_site_settings_table()
    sys.exit(0 if success else 1)

