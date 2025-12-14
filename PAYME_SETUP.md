# Интеграция Payme

## Настройка

1. **ВАЖНО: Получите реальный `merchant_id` в личном кабинете Payme Business:**
   - Зайдите в личный кабинет: https://payme.uz
   - Перейдите в настройки кассы
   - Скопируйте `merchant_id` и ключи

2. Добавьте в `.env` файл в папке `backend/` следующие переменные:

```env
PAYME_MERCHANT_ID=ваш_merchant_id
PAYME_KEY=ваш_ключ
PAYME_TEST_KEY=ваш_тестовый_ключ (для тестирования)
PAYME_ENDPOINT=https://checkout.paycom.uz/apiв
```

3. **Добавьте в `.env` файл в папке `zara/` (для фронтенда):**

```env
REACT_APP_PAYME_MERCHANT_ID=ваш_merchant_id
```

**ВАЖНО:** 
- `merchant_id` должен быть реальным, полученным из личного кабинета Payme
- Не используйте `YOUR_MERCHANT_ID` или другие тестовые значения
- После добавления переменных в `.env` перезапустите приложение

## Эндпоинты

### Merchant API Endpoint
`POST /payme/merchant` - основной эндпоинт для обработки запросов от Payme

**ВАЖНО:** Этот эндпоинт должен быть доступен из интернета! Payme будет отправлять запросы на этот URL.

**Для локальной разработки:**
- Используйте ngrok или подобный сервис для создания публичного URL
- Или настройте Payme на использование тестового сервера

**Пример с ngrok:**
```bash
ngrok http 8000
# Используйте полученный URL: https://your-id.ngrok.io/payme/merchant
```

Payme будет отправлять запросы на этот эндпоинт для следующих методов:
- `CheckPerformTransaction` - проверка возможности выполнения транзакции
- `CreateTransaction` - создание транзакции
- `PerformTransaction` - выполнение транзакции
- `CancelTransaction` - отмена транзакции
- `CheckTransaction` - проверка статуса транзакции

## Инициализация платежа

### GET метод (Redirect) - Рекомендуемый способ
```
https://checkout.paycom.uz/?merchant_id=ВАШ_MERCHANT_ID&amount=500000&account[order_id]=123&callback_url=https://yoursite.com/payment/callback
```

**Важно:** Замените `ВАШ_MERCHANT_ID` на реальный merchant_id из личного кабинета Payme!

### POST метод
Отправьте POST запрос на `https://checkout.paycom.uz/api` с параметрами:
```json
{
  "merchant_id": "YOUR_MERCHANT_ID",
  "amount": 500000,
  "account": {
    "order_id": "123"
  },
  "callback_url": "https://yoursite.com/payment/callback"
}
```

## Параметры

- `merchant_id` - ID мерчанта
- `amount` - сумма в тийинах (1 сум = 100 тийин)
- `account.order_id` - ID заказа в вашей системе
- `account.user_id` - ID пользователя (опционально)
- `callback_url` - URL для возврата после оплаты

## Состояния транзакции

- `0` - Транзакция создана
- `1` - Транзакция забронирована
- `2` - Транзакция выполнена
- `-1` - Транзакция отменена (по таймауту)
- `-2` - Транзакция отменена (другая причина)

## Причины отмены

- `1` - Проблема с платежом
- `2` - Отмена пользователем
- `3` - Отмена мерчантом
- `4` - Отмена по таймауту (12 часов)

## Тестирование

Для тестирования используйте тестовые ключи из личного кабинета Payme.

## Документация

Полная документация: https://developer.help.paycom.uz/

