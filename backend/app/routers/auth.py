from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import (
    UserRegister,
    UserLogin,
    EmailVerification,
    RegisterResponse,
    Token
)
from app.services.user_service import UserService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/user", tags=["authentication"])

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Регистрация нового пользователя
    
    - **email**: Email пользователя
    - **password**: Пароль (минимум 5 символов)
    - **name**: Имя пользователя
    - **phone**: Телефон (формат: +998XXXXXXXXX)
    - **state**: Регион (опционально)
    - **address**: Адрес (опционально)
    - **pincode**: Почтовый индекс (опционально)
    - **city**: Город (опционально)
    """
    try:
        result = await UserService.register_user(db, user_data)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при регистрации: {e}", exc_info=True)
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка сервера: {str(e)}"
        )

@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verification_data: EmailVerification,
    db: Session = Depends(get_db)
):
    """
    Подтверждение email по коду
    
    - **email**: Email пользователя
    - **code**: Код подтверждения из email
    """
    return await UserService.verify_email(db, verification_data.email, verification_data.code)

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Авторизация пользователя
    
    - **email**: Email пользователя
    - **password**: Пароль
    
    Возвращает JWT токен и данные пользователя
    """
    return await UserService.login_user(db, login_data)

