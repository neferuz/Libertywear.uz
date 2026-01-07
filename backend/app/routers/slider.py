from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import json
from app.database import get_db
from app.models.slider import SliderSlide
from app.schemas.slider import SliderSlideCreate, SliderSlideUpdate, SliderSlideResponse

router = APIRouter(prefix="/slider", tags=["slider"])


@router.get("/", response_model=List[SliderSlideResponse])
def get_slides(db: Session = Depends(get_db), active_only: bool = True, lang: str = "ru"):
    """Получить все слайды с переводами"""
    try:
        query = db.query(SliderSlide)
        if active_only:
            query = query.filter(SliderSlide.is_active == True)
        slides = query.order_by(SliderSlide.order.asc(), SliderSlide.id.asc()).all()
        
        # Apply translations if needed (for future use)
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
    slide_data = slide.dict()
    print(f"➕ Создание слайда с данными: {slide_data}")
    db_slide = SliderSlide(**slide_data)
    db.add(db_slide)
    db.commit()
    db.refresh(db_slide)
    print(f"✅ Слайд создан: {db_slide.id}, title_translations={db_slide.title_translations}")
    return db_slide


@router.put("/{slide_id}", response_model=SliderSlideResponse)
def update_slide(slide_id: int, slide: SliderSlideUpdate, db: Session = Depends(get_db)):
    """Обновить слайд"""
    db_slide = db.query(SliderSlide).filter(SliderSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    update_data = slide.dict(exclude_unset=True)
    print(f"🔄 Обновление слайда {slide_id} с данными: {update_data}")
    
    for field, value in update_data.items():
        # Убеждаемся, что JSON поля правильно обрабатываются
        if field.endswith('_translations'):
            if isinstance(value, dict):
                setattr(db_slide, field, value)
            elif isinstance(value, str):
                # Если пришла строка, пытаемся распарсить JSON
                try:
                    setattr(db_slide, field, json.loads(value))
                except:
                    setattr(db_slide, field, value)
            else:
                setattr(db_slide, field, value)
        else:
            setattr(db_slide, field, value)
    
    db.commit()
    db.refresh(db_slide)
    print(f"✅ Слайд {slide_id} обновлен:")
    print(f"   - title_translations: {db_slide.title_translations}")
    print(f"   - tag_translations: {db_slide.tag_translations}")
    print(f"   - headline_translations: {db_slide.headline_translations}")
    print(f"   - description_translations: {db_slide.description_translations}")
    print(f"   - cta_text_translations: {db_slide.cta_text_translations}")
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

