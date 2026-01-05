# Миграции базы данных

## Применение миграции для таблицы site_settings

### Способ 1: Через Python скрипт (рекомендуется)

```bash
cd /root/liberty/backend
python migrations/run_migration.py
```

### Способ 2: Через psql (PostgreSQL CLI)

```bash
psql -U your_username -d your_database -f migrations/create_site_settings_table.sql
```

### Способ 3: Через Python напрямую

```python
from sqlalchemy import create_engine, text
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
with open('migrations/create_site_settings_table.sql', 'r') as f:
    sql = f.read()
    
with engine.connect() as conn:
    for command in sql.split(';'):
        if command.strip():
            conn.execute(text(command))
    conn.commit()
```

## Что делает миграция

1. Создает таблицу `site_settings` для хранения настроек сайта
2. Создает индекс для быстрого поиска по ключу
3. Добавляет начальную настройку `show_partners_block = true` (блок партнеров включен по умолчанию)

## Структура таблицы

- `id` - первичный ключ (SERIAL)
- `key` - уникальный ключ настройки (VARCHAR)
- `value` - значение настройки (TEXT)
- `description` - описание настройки (VARCHAR)
- `created_at` - дата создания (TIMESTAMP)
- `updated_at` - дата обновления (TIMESTAMP)

## Управление настройками через API

После применения миграции можно управлять настройками через API:

- `GET /api/site-settings/value/show_partners_block` - получить значение
- `PUT /api/site-settings/show_partners_block` - обновить значение
  ```json
  {
    "value": "true"  // или "false" для выключения
  }
  ```

