from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging
from app.database import get_db
from app.models.social_links import SocialLinks
from app.schemas.social_links import SocialLinksCreate, SocialLinksUpdate, SocialLinksResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/social-links", tags=["social-links"])


@router.get("/", response_model=SocialLinksResponse)
def get_social_links(db: Session = Depends(get_db)):
    """Получить ссылки на социальные сети"""
    try:
        social_links = db.query(SocialLinks).first()
        if not social_links:
            # Создаем запись по умолчанию, если её нет
            try:
                social_links = SocialLinks(links=[])
                db.add(social_links)
                db.commit()
                db.refresh(social_links)
            except SQLAlchemyError as e:
                logger.error(f"Error creating social_links record: {e}")
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        # Убеждаемся, что links всегда список
        if social_links.links is None:
            social_links.links = []
        
        return social_links
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_social_links: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/", response_model=SocialLinksResponse)
def update_social_links(links: SocialLinksUpdate, db: Session = Depends(get_db)):
    """Обновить ссылки на социальные сети"""
    try:
        social_links = db.query(SocialLinks).first()
        
        # Преобразуем Pydantic модели в словари для JSON
        links_data = [link.dict() for link in links.links] if links.links else []
        
        if not social_links:
            # Создаем новую запись, если её нет
            social_links = SocialLinks(links=links_data)
            db.add(social_links)
        else:
            # Обновляем существующую запись
            social_links.links = links_data
        
        db.commit()
        db.refresh(social_links)
        return social_links
    except SQLAlchemyError as e:
        logger.error(f"Database error in update_social_links: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in update_social_links: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

