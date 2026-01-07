from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class SliderSlide(Base):
    __tablename__ = "slider_slides"

    id = Column(Integer, primary_key=True, index=True)
    # Images
    image_url_desktop = Column(String, nullable=False)  # URL изображения для десктопа (рекомендуемый размер: 1920x600px)
    image_url_mobile = Column(String, nullable=True)  # URL изображения для мобильной версии (рекомендуемый размер: 768x500px)
    alt_text = Column(String, nullable=True)
    
    # Text fields with translations (JSON format: {"ru": "текст", "uz": "matn", "en": "text", "es": "texto"})
    title_translations = Column(JSON, nullable=True)  # Название слайда (переводы на 4 языка)
    tag_translations = Column(JSON, nullable=True)  # Тег/метка (например, "NEW COLLECTION")
    headline_translations = Column(JSON, nullable=True)  # Заголовок
    description_translations = Column(JSON, nullable=True)  # Описание
    cta_text_translations = Column(JSON, nullable=True)  # Текст кнопки (например, "SHOP NOW")
    
    # Legacy fields for backward compatibility
    title = Column(String, nullable=True)  # Старое поле, можно использовать как fallback
    link = Column(String, nullable=True)  # URL для перехода (cta_link)
    cta_link = Column(String, nullable=True)  # URL для кнопки CTA
    
    order = Column(Integer, default=0)  # Порядок отображения
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

