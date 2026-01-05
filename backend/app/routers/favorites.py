from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.favorite import Favorite
from app.models.product import Product, ProductImage, ProductVariant
from app.schemas.favorite import FavoriteCreate, FavoriteResponse, FavoriteWithProduct
from app.utils.jwt import verify_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/favorites", tags=["favorites"])

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
            user_id = int(payload["sub"])
            logger.info(f"Extracted user_id from token: {user_id}, email: {payload.get('email', 'N/A')}")
            return user_id
        except (ValueError, TypeError):
            logger.error(f"Invalid user_id in token payload: {payload.get('sub')}")
            raise HTTPException(status_code=401, detail="Invalid token")
    
    logger.error("No 'sub' in token payload")
    raise HTTPException(status_code=401, detail="User not authenticated")

@router.post("/", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_to_favorites(favorite: FavoriteCreate, request: Request, db: Session = Depends(get_db)):
    """
    Добавить товар в избранное
    """
    user_id = get_user_id_from_request(request)
    logger.info(f"Adding favorite: user_id={user_id}, product_id={favorite.product_id}")
    
    # Проверяем, существует ли товар
    product = db.query(Product).filter(Product.id == favorite.product_id).first()
    if not product:
        logger.warning(f"Product {favorite.product_id} not found")
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Проверяем, не добавлен ли уже товар в избранное
    existing_favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.product_id == favorite.product_id
    ).first()
    
    if existing_favorite:
        logger.info(f"Product {favorite.product_id} already in favorites for user {user_id}")
        raise HTTPException(status_code=400, detail="Product already in favorites")
    
    # Создаем новую запись
    new_favorite = Favorite(
        user_id=user_id,
        product_id=favorite.product_id
    )
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    logger.info(f"Favorite added successfully: id={new_favorite.id}, user_id={user_id}, product_id={favorite.product_id}")
    return new_favorite

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def remove_from_favorites(product_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Удалить товар из избранного
    """
    user_id = get_user_id_from_request(request)
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.product_id == product_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"status": 1, "message": "Product removed from favorites"}

@router.get("/", response_model=List[FavoriteWithProduct])
def get_favorites(request: Request, db: Session = Depends(get_db)):
    """
    Получить список избранных товаров пользователя
    """
    try:
        user_id = get_user_id_from_request(request)
        logger.info(f"Getting favorites for user_id: {user_id}")
        
        favorites = db.query(Favorite).filter(
            Favorite.user_id == user_id
        ).order_by(Favorite.created_at.desc()).all()
        
        logger.info(f"Found {len(favorites)} favorites in database for user {user_id}")
        
        result = []
        for favorite in favorites:
            try:
                logger.info(f"Processing favorite id={favorite.id}, product_id={favorite.product_id}, user_id={favorite.user_id}")
                product = db.query(Product).filter(Product.id == favorite.product_id).first()
                if not product:
                    logger.warning(f"Product {favorite.product_id} not found for favorite {favorite.id}, but still including it")
                    # Даже если товар не найден, возвращаем избранное с базовой информацией
                    favorite_data = FavoriteWithProduct(
                        id=favorite.id,
                        user_id=favorite.user_id,
                        product_id=favorite.product_id,
                        created_at=favorite.created_at,
                        product_name="Товар",
                        product_price=None,
                        product_image=None,
                        product_slug=None
                    )
                    result.append(favorite_data)
                    continue
                    
                # Получаем первый вариант товара
                first_variant = db.query(ProductVariant).filter(
                    ProductVariant.product_id == product.id
                ).first()
                
                # Получаем первое изображение из варианта
                image_url = None
                price = None
                
                price = first_variant.price
                # Пробуем получить изображение из варианта
                if first_variant.color_image:
                    image_url = first_variant.color_image
                else:
                    # Если нет color_image, получаем первое изображение из ProductImage
                    first_image = db.query(ProductImage).filter(
                        ProductImage.variant_id == first_variant.id
                    ).order_by(ProductImage.order).first()
                    if first_image:
                        image_url = first_image.image_url
                
                favorite_data = FavoriteWithProduct(
                    id=favorite.id,
                    user_id=favorite.user_id,
                    product_id=favorite.product_id,
                    created_at=favorite.created_at,
                    product_name=product.name or "Товар",
                    product_price=price,
                    product_image=image_url,
                    product_slug=None  # Пока нет поля slug в Product
                )
                result.append(favorite_data)
                logger.info(f"Added favorite to result: id={favorite.id}, product_id={favorite.product_id}")
            except Exception as e:
                logger.error(f"Error processing favorite {favorite.id}: {e}", exc_info=True)
                import traceback
                logger.error(traceback.format_exc())
                continue
        
        logger.info(f"Returning {len(result)} favorites for user {user_id}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_favorites: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/check/{product_id}", response_model=dict)
def check_favorite(product_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Проверить, находится ли товар в избранном
    """
    user_id = get_user_id_from_request(request)
    logger.info(f"Checking favorite: user_id={user_id}, product_id={product_id}")
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.product_id == product_id
    ).first()
    
    is_fav = favorite is not None
    logger.info(f"Favorite check result: is_favorite={is_fav}, favorite_id={favorite.id if favorite else None}")
    
    return {
        "is_favorite": is_fav,
        "favorite_id": favorite.id if favorite else None
    }

