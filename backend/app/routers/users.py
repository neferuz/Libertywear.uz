from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), include_inactive: bool = False):
    """Получить список пользователей. По умолчанию показываются только активные."""
    query = db.query(User)
    if not include_inactive:
        query = query.filter(User.is_active == True)
    users = query.order_by(User.id.desc()).all()
    return users

# DELETE должен быть перед GET с параметрами, чтобы FastAPI правильно обрабатывал запросы
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Удаление пользователя (мягкое удаление - устанавливает is_active = False)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    user.is_active = False
    db.commit()
    return None

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Получить пользователя по ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    # Загружаем заказы пользователя
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    
    # Преобразуем заказы в формат для фронтенда
    order_history = []
    for order in orders:
        # Загружаем items для заказа
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        
        # Преобразуем items
        order_items = []
        for item in items:
            product_data = item.product_data or {}
            order_items.append({
                "name": product_data.get("product_name", "Товар"),
                "size": item.size or "-",
                "color": product_data.get("variant_name", "-"),
                "quantity": item.quantity,
                "price": f"{item.price:,.0f} UZS"
            })
        
        # Определяем статус
        status_map = {
            "pending": "В обработке",
            "processing": "В обработке",
            "shipped": "Отправлен",
            "delivered": "Доставлен",
            "cancelled": "Отменен"
        }
        status_text = status_map.get(order.order_status, order.order_status)
        
        # Определяем способ оплаты
        payment_method_map = {
            "cash": "Наличные",
            "payme": "Payme"
        }
        payment_method_text = payment_method_map.get(order.payment_method, order.payment_method)
        
        # Определяем статус оплаты
        payment_status_map = {
            "pending": "Ожидает оплаты",
            "paid": "Оплачено",
            "cancelled": "Отменено",
            "refunded": "Возврат"
        }
        payment_status_text = payment_status_map.get(order.payment_status, order.payment_status)
        
        order_history.append({
            "id": f"ORD-{order.id}",
            "date": order.created_at.isoformat() if order.created_at else "",
            "status": status_text,
            "total": f"{order.total_amount:,.0f} UZS",
            "subtotal": f"{order.total_amount:,.0f} UZS",
            "shipping": "Бесплатно",
            "discount": f"{order.discount_amount:,.0f} UZS" if order.discount_amount > 0 else "0 UZS",
            "paymentMethod": payment_method_text,
            "paymentStatus": payment_status_text,
            "deliveryAddress": order.address or "",
            "items": order_items
        })
    
    # Создаем объект пользователя с заказами
    from app.schemas.user import UserResponse
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        state=user.state,
        address=user.address,
        pincode=user.pincode,
        city=user.city,
        is_email_verified=user.is_email_verified,
        created_at=user.created_at,
        orderHistory=order_history
    )
    
    return user_response
