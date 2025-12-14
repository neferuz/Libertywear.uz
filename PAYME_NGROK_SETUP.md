# Настройка ngrok для Payme

## Быстрый старт

### Шаг 1: Запустите ngrok

Откройте **новый терминал** и выполните:

```bash
cd /Users/notferuz/Desktop/LIBERTY
ngrok http 8000
```

Или используйте готовый скрипт:
```bash
cd /Users/notferuz/Desktop/LIBERTY
./start_ngrok.sh
```

### Шаг 2: Скопируйте публичный URL

После запуска ngrok покажет что-то вроде:

```
Forwarding: https://abc123-def456.ngrok-free.app -> http://localhost:8000
```

**Скопируйте HTTPS URL** (например: `https://abc123-def456.ngrok-free.app`)

### Шаг 3: Настройте в личном кабинете Payme

1. Зайдите в https://payme.uz
2. Войдите в личный кабинет
3. Перейдите в **Настройки** → **Касса** или **Настройки кассы**
4. Найдите поле **URL эндпоинта** или **Merchant API URL** или **Callback URL**
5. Вставьте ваш ngrok URL + `/payme/merchant`:
   ```
   https://abc123-def456.ngrok-free.app/payme/merchant
   ```
6. Сохраните настройки

### Шаг 4: Проверьте работу

1. Убедитесь, что бэкенд запущен на порту 8000
2. Убедитесь, что ngrok запущен
3. Попробуйте снова выбрать Payme при оформлении заказа

## Проверка работы эндпоинта

После настройки проверьте, что эндпоинт доступен:

```bash
curl -X POST https://ваш-ngrok-url.ngrok-free.app/payme/merchant \
  -H "Content-Type: application/json" \
  -d '{
    "method": "CheckPerformTransaction",
    "params": {
      "amount": 100000,
      "account": {
        "order_id": "1"
      }
    }
  }'
```

Должен вернуться ответ с `"allow": true`.

## Важно

- **Не закрывайте терминал с ngrok** - он должен работать постоянно
- При каждом перезапуске ngrok URL может измениться
- Для продакшена используйте реальный домен с постоянным URL

## Альтернатива: ngrok с фиксированным доменом

Если у вас есть платный аккаунт ngrok, можете использовать фиксированный домен:

```bash
ngrok http 8000 --domain=your-fixed-domain.ngrok-free.app
```

