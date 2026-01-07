from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
import logging
import json
from app.database import get_db
from app.models.site_settings import SiteSettings
from app.schemas.site_settings import SiteSettingsCreate, SiteSettingsUpdate, SiteSettingsResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/site-settings", tags=["site-settings"])


@router.get("/", response_model=List[SiteSettingsResponse])
def get_all_settings(db: Session = Depends(get_db)):
    """Получить все настройки сайта"""
    try:
        settings = db.query(SiteSettings).all()
        return settings
    except Exception as e:
        logger.error(f"Error fetching site settings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching site settings: {str(e)}")


@router.get("/{key}", response_model=SiteSettingsResponse)
def get_setting(key: str, db: Session = Depends(get_db)):
    """Получить настройку по ключу"""
    try:
        setting = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not setting:
            raise HTTPException(status_code=404, detail=f"Setting with key '{key}' not found")
        return setting
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching site setting: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching site setting: {str(e)}")


@router.get("/value/{key}")
def get_setting_value(key: str, db: Session = Depends(get_db)):
    """Получить только значение настройки по ключу"""
    try:
        setting = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not setting:
            # Возвращаем дефолтное значение для show_partners_block
            if key == "show_partners_block":
                return {"key": key, "value": "true"}
            # Возвращаем дефолтное значение для announcement_bar_text
            if key == "announcement_bar_text":
                return {
                    "key": key,
                    "value": json.dumps({
                        "ru": "ПОЛУЧИТЕ 50% СКИДКУ ТОЛЬКО СЕГОДНЯ!",
                        "uz": "BUGUN 50% CHEGIRMA OLING!",
                        "en": "GET 50% OFF TODAY ONLY!",
                        "es": "¡OBTÉN 50% DE DESCUENTO SOLO HOY!"
                    })
                }
            # Возвращаем дефолтное значение для announcement_bar_active
            if key == "announcement_bar_active":
                return {"key": key, "value": "true"}
            # Возвращаем дефолтное значение для promo_banner_data
            if key == "promo_banner_data":
                return {
                    "key": key,
                    "value": json.dumps({
                        "tag_translations": {
                            "ru": "ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ",
                            "uz": "CHEKLANGAN TAKLIF",
                            "en": "LIMITED OFFER",
                            "es": "OFERTA LIMITADA"
                        },
                        "title_translations": {
                            "ru": "ЗИМНЯЯ РАСПРОДАЖА",
                            "uz": "QISH SOTILISHI",
                            "en": "WINTER SALE",
                            "es": "VENTA DE INVIERNO"
                        },
                        "subtitle_translations": {
                            "ru": "ДО 70% СКИДКА",
                            "uz": "70% GACHA CHEGIRMA",
                            "en": "UP TO 70% OFF",
                            "es": "HASTA 70% DE DESCUENTO"
                        },
                        "description_translations": {
                            "ru": "Не упустите нашу самую большую распродажу сезона. Премиальное качество одежды и аксессуаров по непревзойденным ценам.",
                            "uz": "Mavsumning eng katta sotilishini o'tkazib yubormang. Noo'rin narxlarda premium sifatli kiyim va aksessuarlar.",
                            "en": "Don't miss our biggest sale of the season. Premium quality clothing and accessories at unbeatable prices.",
                            "es": "No te pierdas nuestra mayor venta de la temporada. Ropa y accesorios de calidad premium a precios insuperables."
                        },
                        "button_text_translations": {
                            "ru": "КУПИТЬ СЕЙЧАС",
                            "uz": "HOZIR SOTIB OLING",
                            "en": "SHOP NOW",
                            "es": "COMPRAR AHORA"
                        },
                        "button_link": "/category/women",
                        "image_url": "https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmclMjBjYW1wYWlnbiUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzY3MTMxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                        "is_active": True
                    })
                }
            # Возвращаем дефолтное значение для store_location_data
            if key == "store_location_data":
                return {
                    "key": key,
                    "value": json.dumps({
                        "address_translations": {
                            "ru": "123 Fashion Avenue\nNew York, NY 10001\nUnited States",
                            "uz": "123 Fashion Avenue\nNew York, NY 10001\nUnited States",
                            "en": "123 Fashion Avenue\nNew York, NY 10001\nUnited States",
                            "es": "123 Fashion Avenue\nNew York, NY 10001\nUnited States"
                        },
                        "hours_translations": {
                            "ru": "Понедельник - Пятница: 9:00 - 20:00\nСуббота: 10:00 - 18:00\nВоскресенье: 12:00 - 17:00",
                            "uz": "Dushanba - Juma: 9:00 - 20:00\nShanba: 10:00 - 18:00\nYakshanba: 12:00 - 17:00",
                            "en": "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 12:00 PM - 5:00 PM",
                            "es": "Lunes - Viernes: 9:00 AM - 8:00 PM\nSábado: 10:00 AM - 6:00 PM\nDomingo: 12:00 PM - 5:00 PM"
                        },
                        "map_latitude": "40.75889597932681",
                        "map_longitude": "-73.98811768459398",
                        "map_zoom": "15"
                    })
                }
            return {"key": key, "value": None}
        return {"key": key, "value": setting.value}
    except Exception as e:
        logger.error(f"Error fetching site setting value: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching site setting value: {str(e)}")


@router.post("/", response_model=SiteSettingsResponse, status_code=status.HTTP_201_CREATED)
def create_setting(setting: SiteSettingsCreate, db: Session = Depends(get_db)):
    """Создать новую настройку"""
    try:
        # Проверяем, существует ли уже настройка с таким ключом
        existing = db.query(SiteSettings).filter(SiteSettings.key == setting.key).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Setting with key '{setting.key}' already exists")
        
        new_setting = SiteSettings(**setting.dict())
        db.add(new_setting)
        db.commit()
        db.refresh(new_setting)
        return new_setting
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Error creating site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error creating site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating site setting: {str(e)}")


@router.put("/{key}", response_model=SiteSettingsResponse)
def update_setting(key: str, setting: SiteSettingsUpdate, db: Session = Depends(get_db)):
    """Обновить настройку по ключу"""
    try:
        db_setting = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not db_setting:
            # Если настройка не существует, создаем её
            new_setting = SiteSettings(key=key, value=setting.value, description=setting.description)
            db.add(new_setting)
            db.commit()
            db.refresh(new_setting)
            return new_setting
        
        # Обновляем только переданные поля
        update_data = setting.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_setting, field, value)
        
        db.commit()
        db.refresh(db_setting)
        return db_setting
    except SQLAlchemyError as e:
        logger.error(f"Error updating site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error updating site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating site setting: {str(e)}")


@router.delete("/{key}", status_code=status.HTTP_204_NO_CONTENT)
def delete_setting(key: str, db: Session = Depends(get_db)):
    """Удалить настройку по ключу"""
    try:
        setting = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not setting:
            raise HTTPException(status_code=404, detail=f"Setting with key '{key}' not found")
        
        db.delete(setting)
        db.commit()
        return None
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Error deleting site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error deleting site setting: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting site setting: {str(e)}")

