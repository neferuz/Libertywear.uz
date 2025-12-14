from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class SliderSlide(Base):
    __tablename__ = "slider_slides"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    link = Column(String, nullable=True)  # URL для перехода
    image_url_desktop = Column(String, nullable=False)  # URL изображения для десктопа
    image_url_mobile = Column(String, nullable=True)  # URL изображения для мобильной версии
    alt_text = Column(String, nullable=True)
    order = Column(Integer, default=0)  # Порядок отображения
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

