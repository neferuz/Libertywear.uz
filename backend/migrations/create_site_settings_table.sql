-- Миграция: Создание таблицы site_settings
-- Дата создания: 2024-12-26

CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Создание индекса для быстрого поиска по ключу
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Вставка начальной настройки для блока партнеров (по умолчанию включен)
INSERT INTO site_settings (key, value, description)
VALUES ('show_partners_block', 'true', 'Показывать блок партнеров на главной странице')
ON CONFLICT (key) DO NOTHING;

-- Комментарии к таблице и колонкам
COMMENT ON TABLE site_settings IS 'Настройки сайта для управления различными функциями';
COMMENT ON COLUMN site_settings.key IS 'Уникальный ключ настройки (например, show_partners_block)';
COMMENT ON COLUMN site_settings.value IS 'Значение настройки (строка, может содержать JSON)';
COMMENT ON COLUMN site_settings.description IS 'Описание назначения настройки';

