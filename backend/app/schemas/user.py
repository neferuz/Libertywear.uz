from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Схема для регистрации
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=5, description="Пароль должен содержать минимум 5 символов")
    name: str
    phone: str
    state: Optional[str] = None  # Регион
    address: Optional[str] = None
    pincode: Optional[str] = None
    city: Optional[str] = None

# Схема для логина
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Схема для подтверждения email
class EmailVerification(BaseModel):
    email: EmailStr
    code: str

# Схема ответа пользователя
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    phone: str
    state: Optional[str]
    address: Optional[str]
    pincode: Optional[str]
    city: Optional[str]
    is_email_verified: bool
    created_at: datetime
    orderHistory: Optional[List[Dict[str, Any]]] = []

    class Config:
        from_attributes = True

# Схема токена
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Схема ответа регистрации
class RegisterResponse(BaseModel):
    message: str
    email: str
    verification_code_sent: bool
    dev_code: Optional[str] = None  # Код для режима разработки (только если SMTP не настроен)

