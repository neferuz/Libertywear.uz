from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.utils.email import generate_verification_code, get_code_expiration, send_verification_email
from datetime import timedelta, datetime
from app.config import settings
import json

# Временное хранилище для незавершенных регистраций
# В продакшене лучше использовать Redis
_pending_registrations = {}

class UserService:
    @staticmethod
    def _cleanup_expired_registrations():
        """Очистка истекших регистраций"""
        current_time = datetime.utcnow()
        expired_keys = [
            key for key, data in _pending_registrations.items()
            if data.get('expires_at') and data['expires_at'] < current_time
        ]
        for key in expired_keys:
            del _pending_registrations[key]
    
    @staticmethod
    async def register_user(db: Session, user_data: UserRegister) -> dict:
        """Регистрация нового пользователя - НЕ сохраняет в БД до подтверждения email"""
        # Очистка истекших регистраций
        UserService._cleanup_expired_registrations()
        
        # Проверка существования активного пользователя в БД
        existing_user = db.query(User).filter(
            User.email == user_data.email
        ).filter(
            User.is_active == True
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует"
            )
        
        # Генерация кода подтверждения
        verification_code = generate_verification_code()
        hashed_password = hash_password(user_data.password)
        expires_at = get_code_expiration()
        
        # Сохранение данных во временное хранилище (НЕ в БД)
        registration_data = {
            'email': user_data.email,
            'password_hash': hashed_password,
            'name': user_data.name,
            'phone': user_data.phone,
            'state': user_data.state,
            'address': user_data.address,
            'pincode': user_data.pincode,
            'city': user_data.city,
            'verification_code': verification_code,
            'expires_at': expires_at,
            'created_at': datetime.utcnow()
        }
        
        # Используем email как ключ
        _pending_registrations[user_data.email] = registration_data
        
        # Отправка кода подтверждения
        email_sent = await send_verification_email(user_data.email, verification_code)
        
        # Проверяем, настроен ли SMTP
        smtp_configured = (
            settings.SMTP_USER and 
            settings.SMTP_USER.strip() and 
            settings.SMTP_PASSWORD and 
            settings.SMTP_PASSWORD.strip()
        )
        
        # Определяем, нужно ли вернуть dev_code
        dev_code = None
        if not smtp_configured:
            # Если SMTP не настроен, всегда возвращаем код для разработки
            dev_code = verification_code
        elif not email_sent:
            # Если SMTP настроен, но отправка не удалась, возвращаем код как fallback
            print(f"[LIBERTY] ⚠️ Email не был отправлен, но код доступен: {verification_code}")
            dev_code = verification_code
        
        response = {
            "message": "Код подтверждения отправлен на email. Подтвердите email для завершения регистрации." if email_sent else "Не удалось отправить email, но код доступен ниже. Подтвердите email для завершения регистрации.",
            "email": user_data.email,
            "verification_code_sent": email_sent,
        }
        
        # Добавляем dev_code если SMTP не настроен или отправка не удалась
        if dev_code:
            response["dev_code"] = dev_code
        
        return response
    
    @staticmethod
    async def verify_email(db: Session, email: str, code: str) -> dict:
        """Подтверждение email по коду - ТОЛЬКО ТЕПЕРЬ создает пользователя в БД"""
        # Очистка истекших регистраций
        UserService._cleanup_expired_registrations()
        
        # Проверяем временное хранилище
        registration_data = _pending_registrations.get(email)
        if not registration_data:
            # Проверяем, может быть пользователь уже существует (старая логика)
            user = db.query(User).filter(User.email == email).first()
            if user:
                if user.is_email_verified:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email уже подтвержден"
                    )
                
                if user.verification_code != code:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Неверный код подтверждения"
                    )
                
                if user.verification_code_expires and user.verification_code_expires < datetime.utcnow():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Код подтверждения истек"
                    )
                
                # Подтверждение email для существующего пользователя
                user.is_email_verified = True
                user.verification_code = None
                user.verification_code_expires = None
                db.commit()
                
                return {"message": "Email успешно подтвержден"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Регистрация не найдена или истекла. Пожалуйста, зарегистрируйтесь заново."
                )
        
        # Проверка кода
        if registration_data['verification_code'] != code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный код подтверждения"
            )
        
        # Проверка срока действия
        if registration_data['expires_at'] < datetime.utcnow():
            # Удаляем истекшую регистрацию
            del _pending_registrations[email]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Код подтверждения истек. Пожалуйста, зарегистрируйтесь заново."
            )
        
        # Проверяем, не существует ли уже пользователь с таким email
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            # Если пользователь существует, обновляем его
            existing_user.password_hash = registration_data['password_hash']
            existing_user.name = registration_data['name']
            existing_user.phone = registration_data['phone']
            existing_user.state = registration_data['state']
            existing_user.address = registration_data['address']
            existing_user.pincode = registration_data['pincode']
            existing_user.city = registration_data['city']
            existing_user.is_email_verified = True
            existing_user.is_active = True
        else:
            # Создаем нового пользователя в БД (ТОЛЬКО ПОСЛЕ ПОДТВЕРЖДЕНИЯ EMAIL)
            new_user = User(
                email=registration_data['email'],
                password_hash=registration_data['password_hash'],
                name=registration_data['name'],
                phone=registration_data['phone'],
                state=registration_data['state'],
                address=registration_data['address'],
                pincode=registration_data['pincode'],
                city=registration_data['city'],
                is_email_verified=True,
                is_active=True
            )
            db.add(new_user)
        
        try:
            db.commit()
            # Удаляем данные из временного хранилища
            del _pending_registrations[email]
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка при создании пользователя: {str(e)}"
            )
        
        return {"message": "Email успешно подтвержден. Регистрация завершена."}
    
    @staticmethod
    async def login_user(db: Session, login_data: UserLogin) -> dict:
        """Авторизация пользователя"""
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )
        
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )
        
        if not user.is_email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email не подтвержден. Пожалуйста, подтвердите email."
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Аккаунт деактивирован"
            )
        
        # Создание токена
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
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
            created_at=user.created_at
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }

