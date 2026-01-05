# Настройка домена libertywear.uz

## Шаг 1: Настройка DNS записей

В панели управления доменом (webspace.uz) нужно добавить следующие DNS записи:

### A записи (основной домен и поддомены):

```
Тип: A
Имя: @ (или libertywear.uz)
Значение: 147.45.155.163
TTL: 3600

Тип: A
Имя: www
Значение: 147.45.155.163
TTL: 3600

Тип: A
Имя: api
Значение: 147.45.155.163
TTL: 3600

Тип: A
Имя: admin
Значение: 147.45.155.163
TTL: 3600
```

### NS записи (уже настроены):
- dns1.webspace.uz
- dns2.webspace.uz
- dns3.webspace.uz

## Шаг 2: Установка и настройка Nginx

После настройки DNS записей, выполните на сервере:

```bash
# Установка nginx
sudo apt update
sudo apt install nginx -y

# Установка certbot для SSL
sudo apt install certbot python3-certbot-nginx -y
```

## Шаг 3: Конфигурация Nginx

Создайте конфигурационный файл для домена (будет создан автоматически скриптом).

## Шаг 4: Получение SSL сертификата

```bash
sudo certbot --nginx -d libertywear.uz -d www.libertywear.uz
```

## Структура доменов:

- **libertywear.uz** или **www.libertywear.uz** → Frontend (порт 3000)
- **admin.libertywear.uz** → Admin панель (порт 3001)
- **api.libertywear.uz** → Backend API (порт 8000)

## После настройки:

1. Обновите CORS настройки в backend
2. Обновите конфигурацию frontend для работы с доменом
3. Перезапустите все сервисы

