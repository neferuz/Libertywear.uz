#!/bin/bash
# Скрипт для применения миграции с активацией виртуального окружения

cd "$(dirname "$0")/.."

# Проверяем наличие виртуального окружения
if [ -d "venv" ]; then
    echo "🔄 Активация виртуального окружения..."
    source venv/bin/activate
    python migrations/create_site_settings.py
else
    echo "⚠️  Виртуальное окружение не найдено"
    echo "💡 Попробуйте запустить напрямую:"
    echo "   python migrations/create_site_settings.py"
    echo ""
    echo "Или используйте SQL скрипт:"
    echo "   psql -U your_user -d your_db -f migrations/create_site_settings_table.sql"
fi

