from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.category import Category
from app.schemas.category import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.utils.slug import generate_slug

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[CategorySchema])
def list_categories(parent_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Получить все категории. Если указан parent_id, возвращает только подкатегории"""
    query = db.query(Category)
    
    if parent_id is not None:
        query = query.filter(Category.parent_id == parent_id)
    else:
        # По умолчанию возвращаем только главные категории (без родителя)
        query = query.filter(Category.parent_id == None)
    
    categories = query.order_by(Category.order).all()
    
    # Загружаем подкатегории для каждой категории
    for category in categories:
        category.subcategories = db.query(Category).filter(
            Category.parent_id == category.id
        ).order_by(Category.order).all()
    
    return categories

@router.get("/all", response_model=List[CategorySchema])
def list_all_categories(db: Session = Depends(get_db)):
    """Получить все категории включая подкатегории"""
    categories = db.query(Category).order_by(Category.order).all()
    
    # Загружаем подкатегории для каждой категории
    for category in categories:
        if category.parent_id is None:
            category.subcategories = db.query(Category).filter(
                Category.parent_id == category.id
            ).order_by(Category.order).all()
    
    return categories

@router.get("/{category_id}", response_model=CategorySchema)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Получить категорию по ID"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Загружаем подкатегории
    category.subcategories = db.query(Category).filter(
        Category.parent_id == category.id
    ).order_by(Category.order).all()
    
    return category

@router.post("/", response_model=CategorySchema, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Создать новую категорию"""
    category_data = category.dict()
    
    # Автоматическая генерация slug из title, если не указан
    if not category_data.get('slug') and category_data.get('title'):
        category_data['slug'] = generate_slug(category_data['title'])
    
    new_category = Category(**category_data)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.put("/{category_id}", response_model=CategorySchema)
def update_category(category_id: int, category_update: CategoryUpdate, db: Session = Depends(get_db)):
    """Обновить категорию"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    update_data = category_update.dict(exclude_unset=True)
    
    # Если обновляется title, автоматически обновляем slug
    if 'title' in update_data and update_data['title']:
        # Генерируем slug только если он не был явно указан
        if 'slug' not in update_data or not update_data.get('slug'):
            update_data['slug'] = generate_slug(update_data['title'])
    
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    
    # Загружаем подкатегории
    category.subcategories = db.query(Category).filter(
        Category.parent_id == category.id
    ).order_by(Category.order).all()
    
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Удалить категорию"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Проверяем, есть ли подкатегории
    subcategories = db.query(Category).filter(Category.parent_id == category_id).count()
    if subcategories > 0:
        raise HTTPException(
            status_code=400, 
            detail="Нельзя удалить категорию, у которой есть подкатегории. Сначала удалите подкатегории."
        )
    
    db.delete(category)
    db.commit()
    return None
