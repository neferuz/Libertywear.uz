#!/bin/bash

# Скрипт для запуска ngrok для Payme интеграции

echo "=========================================="
echo "  Запуск ngrok для Payme интеграции"
echo "=========================================="
echo ""
echo "Останавливаем предыдущие процессы ngrok..."
pkill -f "ngrok http 8000" 2>/dev/null
sleep 1

echo "Запуск ngrok на порту 8000..."
echo ""
echo "После запуска ngrok покажет URL вида:"
echo "  Forwarding: https://abc123.ngrok-free.app -> http://localhost:8000"
echo ""
echo "Используйте этот URL в настройках Payme:"
echo "  https://abc123.ngrok-free.app/payme/merchant"
echo ""
echo "=========================================="
echo ""

# Запускаем ngrok
ngrok http 8000
