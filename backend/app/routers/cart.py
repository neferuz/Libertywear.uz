from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse,
    CartResponse,
    CartAddRequest
)
from app.utils.jwt import verify_token

router = APIRouter(prefix="/cart", tags=["cart"])

def get_user_id_from_request(request: Request) -> Optional[int]:
    """Извлекает user_id из токена Authorization header"""
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None
    
    # Убираем "Bearer " если есть
    token = authorization.replace("Bearer ", "").strip() if authorization.startswith("Bearer ") else authorization.strip()
    if not token:
        return None
    
    payload = verify_token(token)
    if payload and "sub" in payload:
        try:
            return int(payload["sub"])
        except (ValueError, TypeError):
            return None
    return None

@router.get("", response_model=CartResponse)
def get_cart(request: Request, db: Session = Depends(get_db)):
    """
    Получить корзину пользователя
    """
    user_id = get_user_id_from_request(request)
    
    # Если нет токена, возвращаем пустую корзину
    if not user_id:
        return {
            "status": 0,
            "message": "User not authenticated",
            "count": 0,
            "items": []
        }
    
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    items = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        variant = None
        variant_images = []
        if item.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
            if variant:
                # Получаем изображения варианта
                from app.models.product import ProductImage
                variant_images = db.query(ProductImage).filter(
                    ProductImage.variant_id == variant.id
                ).all()
        
        # Получаем изображение товара (первое изображение варианта или дефолтное)
        image_url = None
        if variant_images and len(variant_images) > 0:
            image_url = variant_images[0].image_url
        elif variant and variant.color_image:
            image_url = variant.color_image
        elif product:
            # Пытаемся получить первое изображение товара
            from app.models.product import ProductImage
            product_images = db.query(ProductImage).join(
                ProductVariant
            ).filter(
                ProductVariant.product_id == product.id
            ).limit(1).all()
            if product_images:
                image_url = product_images[0].image_url
        
        item_data = {
            "id": item.id,
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "size": item.size,
            "price": item.price,
            "product": {
                "id": product.id if product else None,
                "name": product.name if product else None,
            } if product else None,
            "variant": {
                "id": variant.id if variant else None,
                "color_name": variant.color_name if variant else None,
                "color_image": variant.color_image if variant else None,
                "images": [{"image_url": img.image_url} for img in variant_images] if variant_images else [],
            } if variant else None,
            "image_url": image_url,
        }
        items.append(item_data)
    
    return {
        "status": 1,
        "message": "Cart retrieved successfully",
        "count": len(cart_items),
        "items": items
    }

@router.get("/{product_id}")
def check_cart_item(product_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Проверить, есть ли товар в корзине
    """
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        return {"status": 0, "message": "User not authenticated"}
    
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()
    
    if cart_item:
        return {"status": 1, "message": "Item in cart"}
    else:
        return {"status": 0, "message": "Item not in cart"}

@router.post("/add", response_model=CartResponse)
async def add_to_cart(request: Request, db: Session = Depends(get_db)):
    """
    Добавить товар(ы) в корзину
    """
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Получаем данные из тела запроса
    body = await request.json()
    
    # Поддерживаем оба формата: массив напрямую или объект с полем items
    items = body if isinstance(body, list) else (body.get("items", []) if isinstance(body, dict) else [])
    
    if not items:
        raise HTTPException(status_code=400, detail="No items provided")
    
    added_items = []
    
    for item_data in items:
        # Проверяем существование товара - пробуем разные варианты ID
        product_id = item_data.get("pid") or item_data.get("id") or item_data.get("_id")
        if not product_id:
            continue
            
        # Преобразуем в int если нужно
        try:
            product_id = int(product_id)
        except (ValueError, TypeError):
            continue
            
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            continue
        
        # Получаем вариант если указан
        variant = None
        if item_data.get("variantId"):
            variant = db.query(ProductVariant).filter(ProductVariant.id == item_data.get("variantId")).first()
        
        # Получаем размер
        size = item_data.get("sizes") or item_data.get("selectedSize")
        
        # Проверяем, есть ли уже такой товар в корзине
        existing_item_query = db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product.id,
            CartItem.variant_id == (variant.id if variant else None)
        )
        
        # Добавляем фильтр по размеру только если размер указан
        if size:
            existing_item_query = existing_item_query.filter(CartItem.size == size)
        else:
            existing_item_query = existing_item_query.filter(CartItem.size.is_(None))
        
        existing_item = existing_item_query.first()
        
        if existing_item:
            # Увеличиваем количество
            existing_item.quantity += item_data.get("quantity", 1)
            existing_item.price = item_data.get("price") or (variant.price if variant else product.variants[0].price if product.variants else 0)
            db.commit()
            db.refresh(existing_item)
            added_items.append(existing_item)
        else:
            # Создаем новый элемент корзины
            price = item_data.get("price") or (variant.price if variant else (product.variants[0].price if product.variants and len(product.variants) > 0 else 0))
            
            new_cart_item = CartItem(
                user_id=user_id,
                product_id=product.id,
                variant_id=variant.id if variant else None,
                quantity=item_data.get("quantity", 1),
                size=item_data.get("sizes") or item_data.get("selectedSize"),
                price=price
            )
            db.add(new_cart_item)
            db.commit()
            db.refresh(new_cart_item)
            added_items.append(new_cart_item)
    
    # Получаем обновленную корзину
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    return {
        "status": 1,
        "message": "Items added to cart successfully",
        "count": len(cart_items),
        "items": []
    }

@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(item_id: int, item_update: CartItemUpdate, request: Request, db: Session = Depends(get_db)):
    """
    Обновить элемент корзины
    """
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if item_update.quantity is not None:
        cart_item.quantity = item_update.quantity
    if item_update.size is not None:
        cart_item.size = item_update.size
    
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(item_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Удалить элемент из корзины
    """
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    return None

