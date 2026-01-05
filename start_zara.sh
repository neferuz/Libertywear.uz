#!/bin/bash
cd /root/liberty/zara

# Проверяем, запущен ли уже процесс
if pgrep -f "next start" > /dev/null; then
    echo "Next.js уже запущен"
    exit 0
fi

# Запускаем Next.js в фоновом режиме
nohup npm start > /root/liberty/zara/frontend.log 2>&1 &
echo "Next.js запущен на порту 3000"
echo "Логи: /root/liberty/zara/frontend.log"
