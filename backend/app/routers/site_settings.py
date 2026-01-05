from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
import logging
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

