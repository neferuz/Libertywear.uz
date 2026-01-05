from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Название партнера
    logo_url = Column(String, nullable=False)  # URL логотипа
    website_url = Column(String, nullable=True)  # Ссылка на сайт партнера (опционально)
    order = Column(Integer, default=0)  # Порядок отображения
    is_active = Column(Boolean, default=True)  # Активен ли партнер
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

