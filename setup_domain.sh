#!/bin/bash

# Скрипт для настройки домена libertywear.uz

echo "🚀 Настройка домена libertywear.uz..."

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Пожалуйста, запустите скрипт с правами root (sudo)"
    exit 1
fi

# Установка nginx
echo "📦 Установка Nginx..."
apt update
apt install nginx -y

# Установка certbot
echo "📦 Установка Certbot для SSL..."
apt install certbot python3-certbot-nginx -y

# Копирование конфигурации
echo "📝 Копирование конфигурации Nginx..."
cp nginx-libertywear.conf /etc/nginx/sites-available/libertywear.uz

# Создание символической ссылки
ln -sf /etc/nginx/sites-available/libertywear.uz /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации
echo "🔍 Проверка конфигурации Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация Nginx корректна"
    # Перезапуск nginx
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx перезапущен"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

echo ""
echo "✅ Базовая настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте DNS записи в панели управления доменом:"
echo "   - A запись для @ (libertywear.uz) → 147.45.155.163"
echo "   - A запись для www → 147.45.155.163"
echo "   - A запись для admin → 147.45.155.163"
echo "   - A запись для api → 147.45.155.163"
echo ""
echo "2. Подождите распространения DNS (5-30 минут)"
echo ""
echo "3. После распространения DNS выполните:"
echo "   sudo certbot --nginx -d libertywear.uz -d www.libertywear.uz -d admin.libertywear.uz -d api.libertywear.uz"
echo ""
echo "4. Обновите CORS настройки в backend/main.py"
echo "5. Обновите конфигурацию frontend"

