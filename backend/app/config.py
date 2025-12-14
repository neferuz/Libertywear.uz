from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database - PostgreSQL
    DATABASE_URL: Optional[str] = "postgresql://postgres:postgres@localhost:5432/liberty_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production-please-use-strong-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 дней (7 * 24 * 60 = 10080 минут)
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # SMTP Settings (опционально)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_FROM_NAME: Optional[str] = "Liberty"
    
    # Payme Settings
    PAYME_MERCHANT_ID: Optional[str] = None
    PAYME_KEY: Optional[str] = None
    PAYME_TEST_KEY: Optional[str] = None
    PAYME_ENDPOINT: str = "https://checkout.paycom.uz/api"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

