from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.models.slider import SliderSlide
from app.schemas.slider import SliderSlideCreate, SliderSlideUpdate, SliderSlideResponse

router = APIRouter(prefix="/slider", tags=["slider"])


@router.get("/", response_model=List[SliderSlideResponse])
def get_slides(db: Session = Depends(get_db), active_only: bool = False):
    """Получить все слайды"""
    try:
        query = db.query(SliderSlide)
        if active_only:
            query = query.filter(SliderSlide.is_active == True)
        slides = query.order_by(SliderSlide.order.asc(), SliderSlide.id.asc()).all()
        return slides
    except Exception as e:
        # Если таблица не существует, возвращаем пустой список
        return []


@router.get("/{slide_id}", response_model=SliderSlideResponse)
def get_slide(slide_id: int, db: Session = Depends(get_db)):
    """Получить один слайд"""
    slide = db.query(SliderSlide).filter(SliderSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


@router.post("/", response_model=SliderSlideResponse, status_code=status.HTTP_201_CREATED)
def create_slide(slide: SliderSlideCreate, db: Session = Depends(get_db)):
    """Создать новый слайд"""
    db_slide = SliderSlide(**slide.dict())
    db.add(db_slide)
    db.commit()
    db.refresh(db_slide)
    return db_slide


@router.put("/{slide_id}", response_model=SliderSlideResponse)
def update_slide(slide_id: int, slide: SliderSlideUpdate, db: Session = Depends(get_db)):
    """Обновить слайд"""
    db_slide = db.query(SliderSlide).filter(SliderSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    update_data = slide.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_slide, field, value)
    
    db.commit()
    db.refresh(db_slide)
    return db_slide


@router.delete("/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_slide(slide_id: int, db: Session = Depends(get_db)):
    """Удалить слайд"""
    db_slide = db.query(SliderSlide).filter(SliderSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    db.delete(db_slide)
    db.commit()
    return None

