from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
import logging
from app.database import get_db
from app.models.partner import Partner
from app.schemas.partner import PartnerCreate, PartnerUpdate, PartnerResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/partners", tags=["partners"])


@router.get("/", response_model=List[PartnerResponse])
def get_partners(active_only: bool = False, db: Session = Depends(get_db)):
    """Получить список партнеров"""
    try:
        query = db.query(Partner)
        if active_only:
            query = query.filter(Partner.is_active == True)
        partners = query.order_by(Partner.order.asc(), Partner.id.asc()).all()
        return partners
    except Exception as e:
        logger.error(f"Error fetching partners: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching partners: {str(e)}")


@router.get("/{partner_id}", response_model=PartnerResponse)
def get_partner(partner_id: int, db: Session = Depends(get_db)):
    """Получить партнера по ID"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return partner


@router.post("/", response_model=PartnerResponse, status_code=status.HTTP_201_CREATED)
def create_partner(partner: PartnerCreate, db: Session = Depends(get_db)):
    """Создать нового партнера"""
    try:
        new_partner = Partner(**partner.dict())
        db.add(new_partner)
        db.commit()
        db.refresh(new_partner)
        return new_partner
    except SQLAlchemyError as e:
        logger.error(f"Error creating partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error creating partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating partner: {str(e)}")


@router.put("/{partner_id}", response_model=PartnerResponse)
def update_partner(partner_id: int, partner: PartnerUpdate, db: Session = Depends(get_db)):
    """Обновить партнера"""
    try:
        db_partner = db.query(Partner).filter(Partner.id == partner_id).first()
        if not db_partner:
            raise HTTPException(status_code=404, detail="Partner not found")
        
        # Обновляем только переданные поля
        update_data = partner.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_partner, field, value)
        
        db.commit()
        db.refresh(db_partner)
        return db_partner
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Error updating partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error updating partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating partner: {str(e)}")


@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    """Удалить партнера"""
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        if not partner:
            raise HTTPException(status_code=404, detail="Partner not found")
        
        db.delete(partner)
        db.commit()
        return None
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Error deleting partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error deleting partner: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting partner: {str(e)}")

