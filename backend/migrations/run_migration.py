#!/usr/bin/env python3
"""
Скрипт для применения миграции создания таблицы site_settings
"""
import sys
import os
from pathlib import Path

# Добавляем корневую директорию проекта в путь
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from app.config import settings

def run_migration():
    """Применяет миграцию для создания таблицы site_settings"""
    try:
        # Создаем подключение к базе данных
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True
        )
        
        # Читаем SQL файл миграции
        migration_file = Path(__file__).parent / "create_site_settings_table.sql"
        
        if not migration_file.exists():
            print(f"❌ Файл миграции не найден: {migration_file}")
            return False
        
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        print("🔄 Применение миграции для создания таблицы site_settings...")
        
        # Выполняем SQL скрипт
        with engine.connect() as connection:
            # Разделяем скрипт на отдельные команды
            commands = [cmd.strip() for cmd in sql_script.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
            
            for command in commands:
                if command:
                    try:
                        connection.execute(text(command))
                        connection.commit()
                    except Exception as e:
                        # Игнорируем ошибки типа "таблица уже существует" или "индекс уже существует"
                        error_msg = str(e).lower()
                        if 'already exists' in error_msg or 'duplicate' in error_msg:
                            print(f"⚠️  Пропущено (уже существует): {command[:50]}...")
                        else:
                            print(f"❌ Ошибка при выполнении команды: {e}")
                            print(f"   Команда: {command[:100]}...")
                            return False
            
            print("✅ Миграция успешно применена!")
            print("✅ Таблица site_settings создана")
            print("✅ Начальная настройка show_partners_block добавлена")
            return True
            
    except Exception as e:
        print(f"❌ Ошибка при применении миграции: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)

