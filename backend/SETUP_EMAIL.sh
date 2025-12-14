#!/bin/bash

echo "=========================================="
echo "Настройка SMTP для отправки email"
echo "=========================================="
echo ""
echo "Введите ваш Gmail адрес:"
read -r GMAIL_EMAIL

echo ""
echo "Введите 16-значный пароль приложения (полученный с https://myaccount.google.com/apppasswords):"
read -r APP_PASSWORD

echo ""
echo "Обновляю файл .env..."

cd "$(dirname "$0")"

# Обновляем SMTP настройки
sed -i.bak "s|SMTP_USER=.*|SMTP_USER=$GMAIL_EMAIL|" .env
sed -i.bak "s|SMTP_PASSWORD=.*|SMTP_PASSWORD=$APP_PASSWORD|" .env
sed -i.bak "s|SMTP_FROM_EMAIL=.*|SMTP_FROM_EMAIL=$GMAIL_EMAIL|" .env

echo ""
echo "✅ Настройки обновлены!"
echo ""
echo "Теперь перезапустите сервер:"
echo "1. Остановите текущий сервер (Ctrl+C)"
echo "2. Запустите снова:"
echo "   cd /Users/notferuz/Desktop/LIBERTY/backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
echo ""

