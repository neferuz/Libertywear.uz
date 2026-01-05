#!/bin/bash
# Скрипт проверки здоровья сервисов Liberty

LOG_FILE="/root/liberty/health_check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    # Проверка порта
    if ! nc -z localhost $port 2>/dev/null; then
        echo "[$TIMESTAMP] ERROR: Service $service_name (port $port) is not responding" >> "$LOG_FILE"
        systemctl restart $service_name
        echo "[$TIMESTAMP] INFO: Attempted to restart $service_name" >> "$LOG_FILE"
        return 1
    fi
    
    # Проверка HTTP ответа (если URL указан)
    if [ -n "$url" ]; then
        if ! curl -f -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" | grep -q "200\|301\|302"; then
            echo "[$TIMESTAMP] WARNING: Service $service_name (port $port) returned non-200 status" >> "$LOG_FILE"
            return 1
        fi
    fi
    
    echo "[$TIMESTAMP] OK: Service $service_name (port $port) is healthy" >> "$LOG_FILE"
    return 0
}

# Проверка всех сервисов
check_service "liberty-backend.service" 8000 "http://localhost:8000/health"
check_service "liberty-frontend.service" 3000 "http://localhost:3000"
check_service "liberty-admin.service" 3001 "http://localhost:3001"

# Проверка nginx
if ! systemctl is-active --quiet nginx; then
    echo "[$TIMESTAMP] ERROR: Nginx is not running" >> "$LOG_FILE"
    systemctl restart nginx
    echo "[$TIMESTAMP] INFO: Attempted to restart nginx" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] OK: Nginx is running" >> "$LOG_FILE"
fi

# Ограничение размера лог-файла (последние 1000 строк)
tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

