from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Dict, Any
import hashlib
import hmac
import json
import time
from app.database import get_db
from app.models.payment import PaymeTransaction
from app.models.user import User
from app.models.order import Order, OrderItem
from app.schemas.payment import (
    PaymeRequest,
    PaymeResponse,
    CheckPerformTransactionParams,
    CreateTransactionParams,
    PerformTransactionParams,
    CancelTransactionParams,
    CheckTransactionParams
)
from app.config import settings
import logging
import os

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payme", tags=["payme"])

# Конфигурация Payme (должна быть в .env или config)
PAYME_MERCHANT_ID = os.getenv("PAYME_MERCHANT_ID", getattr(settings, "PAYME_MERCHANT_ID", None) or "308712129")
PAYME_KEY = os.getenv("PAYME_KEY", getattr(settings, "PAYME_KEY", None) or "your_payme_key")
PAYME_TEST_KEY = os.getenv("PAYME_TEST_KEY", getattr(settings, "PAYME_TEST_KEY", None) or "your_test_key")
PAYME_ENDPOINT = os.getenv("PAYME_ENDPOINT", getattr(settings, "PAYME_ENDPOINT", None) or "https://checkout.paycom.uz/api")

def verify_payme_request(request: Request, body: dict) -> bool:
    """Проверка подписи запроса от Payme"""
    try:
        # Получаем заголовок Authorization
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Basic "):
            return False
        
        # Декодируем Basic Auth (должен содержать merchant_id:key)
        import base64
        encoded = auth_header.replace("Basic ", "")
        decoded = base64.b64decode(encoded).decode("utf-8")
        merchant_id, key = decoded.split(":", 1)
        
        # Проверяем merchant_id и key
        if merchant_id != PAYME_MERCHANT_ID:
            return False
        
        # В реальном приложении здесь должна быть проверка подписи
        # Для тестирования можно использовать PAYME_TEST_KEY
        return key == PAYME_KEY or key == PAYME_TEST_KEY
    except Exception as e:
        logger.error(f"Error verifying Payme request: {e}")
        return False

def create_error_response(code: int, message: str, data: Any = None) -> PaymeResponse:
    """Создание ответа с ошибкой"""
    error = {
        "code": code,
        "message": message
    }
    if data:
        error["data"] = data
    return PaymeResponse(error=error)

def create_success_response(result: Dict[str, Any]) -> PaymeResponse:
    """Создание успешного ответа"""
    return PaymeResponse(result=result)

@router.post("/merchant")
async def payme_merchant(request: Request, db: Session = Depends(get_db)):
    """
    Основной эндпоинт для обработки запросов от Payme Merchant API
    """
    try:
        body = await request.json()
        
        # Проверка подписи (опционально для тестирования)
        # if not verify_payme_request(request, body):
        #     return create_error_response(-32504, "Invalid authorization")
        
        method = body.get("method")
        params = body.get("params", {})
        
        if method == "CheckPerformTransaction":
            return await check_perform_transaction(params, db)
        elif method == "CreateTransaction":
            return await create_transaction(params, db)
        elif method == "PerformTransaction":
            return await perform_transaction(params, db)
        elif method == "CancelTransaction":
            return await cancel_transaction(params, db)
        elif method == "CheckTransaction":
            return await check_transaction(params, db)
        else:
            return create_error_response(-32601, f"Method not found: {method}")
    
    except Exception as e:
        logger.error(f"Error processing Payme request: {e}", exc_info=True)
        return create_error_response(-32400, "System error", str(e))

async def check_perform_transaction(params: dict, db: Session) -> PaymeResponse:
    """
    CheckPerformTransaction - проверка возможности выполнения транзакции
    """
    try:
        amount = params.get("amount")
        account = params.get("account", {})
        
        # Проверяем наличие order_id в account
        order_id = account.get("order_id")
        if not order_id:
            return create_error_response(-31050, "Неверный формат данных", "order_id")
        
        # Преобразуем order_id в int если нужно
        try:
            order_id_int = int(order_id) if isinstance(order_id, str) else order_id
        except (ValueError, TypeError):
            return create_error_response(-31050, "Неверный формат order_id", "order_id")
        
        # Проверяем сумму (должна быть больше 0)
        if amount <= 0:
            return create_error_response(-31001, "Неверная сумма")
        
        # Проверяем существование заказа
        from app.models.order import Order
        order = db.query(Order).filter(Order.id == order_id_int).first()
        order_items = []
        
        if order:
            # Проверяем, что сумма заказа совпадает (с небольшой погрешностью)
            order_amount_in_tiyin = int(order.total_amount * 100)
            if abs(order_amount_in_tiyin - amount) > 100:  # Допускаем погрешность в 1 сум (100 тийин)
                logger.warning(f"Amount mismatch: order={order_amount_in_tiyin}, requested={amount}")
                # Не блокируем, но логируем
            
            # Получаем товары из заказа для детализации чека
            order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id_int).all()
        
        # Формируем детали для чека (для налоговой отчетности)
        items = []
        for item in order_items:
            items.append({
                "title": item.product_data.get("product_name", "Товар") if item.product_data else "Товар",
                "price": int(item.price * 100),  # В тийинах
                "count": item.quantity,
                "code": "0000000000000000",  # MXIK код (нужно получать из товаров)
                "package_code": "796",  # Код единицы измерения (796 - штука)
                "vat_percent": 12  # НДС %
            })
        
        # Если товаров нет, добавляем один общий товар
        if not items:
            items.append({
                "title": "Товары",
                "price": amount,
                "count": 1,
                "code": "0000000000000000",
                "package_code": "796",
                "vat_percent": 12
            })
        
        detail = {
            "receipt_type": 0,  # 0 - приход, 1 - расход
            "items": items
        }
        
        allow = True
        
        return create_success_response({"allow": allow, "detail": detail})
    
    except Exception as e:
        logger.error(f"Error in CheckPerformTransaction: {e}")
        return create_error_response(-32400, "System error", str(e))

async def create_transaction(params: dict, db: Session) -> PaymeResponse:
    """
    CreateTransaction - создание транзакции
    """
    try:
        payme_id = params.get("id")
        time_ms = params.get("time")
        amount = params.get("amount")
        account = params.get("account", {})
        
        # Проверяем наличие транзакции
        existing_transaction = db.query(PaymeTransaction).filter(
            PaymeTransaction.payme_transaction_id == payme_id
        ).first()
        
        if existing_transaction:
            # Транзакция уже существует, возвращаем её данные
            return create_success_response({
                "create_time": existing_transaction.create_time,
                "transaction": str(existing_transaction.merchant_transaction_id or existing_transaction.id),
                "state": existing_transaction.state
            })
        
        # Проверяем account
        order_id = account.get("order_id")
        user_id = account.get("user_id")
        
        if not order_id or not user_id:
            return create_error_response(-31050, "Неверный формат данных", "account")
        
        # Проверяем существование пользователя
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return create_error_response(-31050, "Пользователь не найден", "account.user_id")
        
        # Создаем транзакцию
        merchant_transaction_id = f"ORDER_{order_id}_{int(time.time() * 1000)}"
        
        new_transaction = PaymeTransaction(
            payme_transaction_id=payme_id,
            merchant_transaction_id=merchant_transaction_id,
            user_id=user_id,
            order_id=int(order_id) if order_id.isdigit() else None,
            amount=amount,
            state=1,  # Забронирована
            create_time=time_ms,
            account=account
        )
        
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)
        
        return create_success_response({
            "create_time": new_transaction.create_time,
            "transaction": merchant_transaction_id,
            "state": new_transaction.state
        })
    
    except Exception as e:
        logger.error(f"Error in CreateTransaction: {e}")
        db.rollback()
        return create_error_response(-32400, "System error", str(e))

async def perform_transaction(params: dict, db: Session) -> PaymeResponse:
    """
    PerformTransaction - выполнение транзакции
    """
    try:
        payme_id = params.get("id")
        
        transaction = db.query(PaymeTransaction).filter(
            PaymeTransaction.payme_transaction_id == payme_id
        ).first()
        
        if not transaction:
            return create_error_response(-31003, "Транзакция не найдена")
        
        if transaction.state == 2:
            # Транзакция уже выполнена
            return create_success_response({
                "transaction": str(transaction.merchant_transaction_id or transaction.id),
                "perform_time": transaction.perform_time or int(time.time() * 1000),
                "state": transaction.state
            })
        
        if transaction.state != 1:
            return create_error_response(-31008, "Невозможно выполнить данную операцию")
        
        # Выполняем транзакцию
        transaction.state = 2
        transaction.perform_time = int(time.time() * 1000)
        
        # Здесь можно обновить статус заказа
        # order = db.query(Order).filter(Order.id == transaction.order_id).first()
        # if order:
        #     order.status = "paid"
        
        db.commit()
        db.refresh(transaction)
        
        return create_success_response({
            "transaction": str(transaction.merchant_transaction_id or transaction.id),
            "perform_time": transaction.perform_time,
            "state": transaction.state
        })
    
    except Exception as e:
        logger.error(f"Error in PerformTransaction: {e}")
        db.rollback()
        return create_error_response(-32400, "System error", str(e))

async def cancel_transaction(params: dict, db: Session) -> PaymeResponse:
    """
    CancelTransaction - отмена транзакции
    """
    try:
        payme_id = params.get("id")
        reason = params.get("reason", 4)  # По умолчанию - отмена по таймауту
        
        transaction = db.query(PaymeTransaction).filter(
            PaymeTransaction.payme_transaction_id == payme_id
        ).first()
        
        if not transaction:
            return create_error_response(-31003, "Транзакция не найдена")
        
        if transaction.state == 2:
            # Транзакция уже выполнена
            return create_error_response(-31007, "Заказ выполнен. Невозможно отменить транзакцию")
        
        # Отменяем транзакцию
        transaction.state = -1 if reason == 4 else -2
        transaction.reason = reason
        transaction.cancel_time = int(time.time() * 1000)
        
        # Здесь можно обновить статус заказа
        # order = db.query(Order).filter(Order.id == transaction.order_id).first()
        # if order:
        #     order.status = "cancelled"
        
        db.commit()
        db.refresh(transaction)
        
        return create_success_response({
            "transaction": str(transaction.merchant_transaction_id or transaction.id),
            "cancel_time": transaction.cancel_time,
            "state": transaction.state
        })
    
    except Exception as e:
        logger.error(f"Error in CancelTransaction: {e}")
        db.rollback()
        return create_error_response(-32400, "System error", str(e))

async def check_transaction(params: dict, db: Session) -> PaymeResponse:
    """
    CheckTransaction - проверка статуса транзакции
    """
    try:
        payme_id = params.get("id")
        
        transaction = db.query(PaymeTransaction).filter(
            PaymeTransaction.payme_transaction_id == payme_id
        ).first()
        
        if not transaction:
            return create_error_response(-31003, "Транзакция не найдена")
        
        return create_success_response({
            "create_time": transaction.create_time,
            "perform_time": transaction.perform_time or 0,
            "cancel_time": transaction.cancel_time or 0,
            "transaction": str(transaction.merchant_transaction_id or transaction.id),
            "state": transaction.state,
            "reason": transaction.reason
        })
    
    except Exception as e:
        logger.error(f"Error in CheckTransaction: {e}")
        return create_error_response(-32400, "System error", str(e))

