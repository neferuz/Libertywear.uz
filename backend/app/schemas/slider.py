from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime


class SliderSlideBase(BaseModel):
    # Images
    image_url_desktop: str  # Рекомендуемый размер: 1920x600px для десктопа
    image_url_mobile: Optional[str] = None  # Рекомендуемый размер: 768x500px для мобильного
    alt_text: Optional[str] = None
    
    # Text fields with translations (JSON format: {"ru": "текст", "uz": "matn", "en": "text", "es": "texto"})
    title_translations: Optional[Dict[str, str]] = None  # Название слайда (переводы на 4 языка)
    tag_translations: Optional[Dict[str, str]] = None  # Тег/метка (например, "NEW COLLECTION")
    headline_translations: Optional[Dict[str, str]] = None  # Заголовок
    description_translations: Optional[Dict[str, str]] = None  # Описание
    cta_text_translations: Optional[Dict[str, str]] = None  # Текст кнопки (например, "SHOP NOW")
    
    # Legacy fields for backward compatibility
    title: Optional[str] = None
    link: Optional[str] = None
    cta_link: Optional[str] = None  # URL для кнопки CTA
    
    order: int = 0
    is_active: bool = True


class SliderSlideCreate(SliderSlideBase):
    pass


class SliderSlideUpdate(BaseModel):
    image_url_desktop: Optional[str] = None
    image_url_mobile: Optional[str] = None
    alt_text: Optional[str] = None
    title_translations: Optional[Dict[str, str]] = None
    tag_translations: Optional[Dict[str, str]] = None
    headline_translations: Optional[Dict[str, str]] = None
    description_translations: Optional[Dict[str, str]] = None
    cta_text_translations: Optional[Dict[str, str]] = None
    title: Optional[str] = None
    link: Optional[str] = None
    cta_link: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class SliderSlideResponse(SliderSlideBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
