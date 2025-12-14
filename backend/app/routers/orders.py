from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.utils.jwt import verify_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/order", tags=["orders"])

def get_user_id_from_request(request: Request) -> int:
    """Извлекает user_id из токена Authorization header"""
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Убираем "Bearer " если есть
    token = authorization.replace("Bearer ", "").strip() if authorization.startswith("Bearer ") else authorization.strip()
    if not token:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    payload = verify_token(token)
    if payload and "sub" in payload:
        try:
            return int(payload["sub"])
        except (ValueError, TypeError):
            raise HTTPException(status_code=401, detail="Invalid token")
    
    raise HTTPException(status_code=401, detail="User not authenticated")

@router.post("/add", response_model=OrderListResponse, status_code=status.HTTP_201_CREATED)
async def create_order(request: Request, db: Session = Depends(get_db)):
    """
    Создать новый заказ
    """
    try:
        user_id = get_user_id_from_request(request)
        
        # Получаем данные из тела запроса
        body = await request.json()
        
        # Поддерживаем оба формата: массив напрямую или объект
        items = body if isinstance(body, list) else body.get("items", [])
        
        if not items or len(items) == 0:
            raise HTTPException(status_code=400, detail="No items provided")
        
        # Извлекаем данные заказа из первого элемента (если есть общие поля)
        first_item = items[0] if items else {}
        total_amount = sum(
            (item.get("price", 0) or 0) * (item.get("quantity", 1) or 1) 
            for item in items
        )
        discount_amount = first_item.get("totalDiscountPrice", 0) or 0
        payment_method = first_item.get("paymentMethod", "cash")
        address = first_item.get("address", "")
        notes = first_item.get("notes", "")
        
        if not address:
            raise HTTPException(status_code=400, detail="Address is required")
        
        # Проверяем существование пользователя
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Создаем заказ
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            discount_amount=discount_amount,
            payment_method=payment_method,
            payment_status="pending" if payment_method == "cash" else "pending",
            order_status="pending",
            address=address,
            notes=notes
        )
        db.add(new_order)
        db.flush()  # Получаем ID заказа
        
        # Создаем элементы заказа
        for item_data in items:
            product_id = item_data.get("pid") or item_data.get("id") or item_data.get("_id") or item_data.get("productId")
            if not product_id:
                continue
            
            try:
                product_id = int(product_id)
            except (ValueError, TypeError):
                continue
            
            # Проверяем существование товара
            product = db.query(Product).filter(Product.id == product_id).first()
            if not product:
                continue
            
            # Получаем вариант если указан
            variant = None
            variant_id = item_data.get("variantId")
            if variant_id:
                variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
            
            quantity = item_data.get("quantity", 1)
            price = item_data.get("price", 0) or (variant.price if variant else (product.variants[0].price if product.variants and len(product.variants) > 0 else 0))
            total_price = price * quantity
            size = item_data.get("sizes") or item_data.get("selectedSize")
            
            # Сохраняем данные товара на момент заказа
            product_data = {
                "product_name": product.name,
                "variant_name": variant.color_name if variant else None,
                "image_url": item_data.get("imageURL") or (variant.color_image if variant else None),
            }
            
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product_id,
                variant_id=variant.id if variant else None,
                quantity=quantity,
                size=size,
                price=price,
                total_price=total_price,
                product_data=product_data
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(new_order)
        
        return {
            "status": 1,
            "message": "Order created successfully",
            "order_id": new_order.id,
            "user_id": user_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

@router.get("/", response_model=List[OrderResponse])
def get_orders(request: Request, db: Session = Depends(get_db)):
    """
    Получить список заказов пользователя
    """
    user_id = get_user_id_from_request(request)
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    
    # Загружаем items для каждого заказа
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    return orders

@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db)):
    """
    Получить все заказы (для админа)
    """
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    
    # Загружаем items и user для каждого заказа
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order.user = db.query(User).filter(User.id == order.user_id).first()
    
    return orders

@router.patch("/{order_id}/status")
async def update_order_status(order_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Обновить статус заказа
    """
    try:
        body = await request.json()
        status = body.get("order_status")
    except:
        raise HTTPException(status_code=400, detail="order_status is required in request body")
    
    if not status:
        raise HTTPException(status_code=400, detail="order_status is required")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.order_status = status
    db.commit()
    db.refresh(order)
    
    return {"message": "Order status updated", "order_id": order_id, "order_status": status}

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Удалить заказ
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    
    return {"message": "Order deleted", "order_id": order_id}

@router.get("/admin/{order_id}", response_model=OrderResponse)
def get_order_admin(order_id: int, db: Session = Depends(get_db)):
    """
    Получить заказ по ID для админа (без проверки user_id)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Загружаем items и user
    order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    order.user = db.query(User).filter(User.id == order.user_id).first()
    
    return order

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Получить заказ по ID (для пользователя)
    """
    user_id = get_user_id_from_request(request)
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Загружаем items и user
    order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    order.user = db.query(User).filter(User.id == order.user_id).first()
    
    return order

