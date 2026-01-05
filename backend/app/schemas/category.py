from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class CategoryBase(BaseModel):
    title: str
    slug: Optional[str] = None
    gender: Optional[str] = None
    image: Optional[str] = None
    parent_id: Optional[int] = None
    title_translations: Optional[Dict[str, str]] = None
    order: int = 0
    show_on_homepage: Optional[bool] = False

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    gender: Optional[str] = None
    image: Optional[str] = None
    parent_id: Optional[int] = None
    title_translations: Optional[Dict[str, str]] = None
    order: Optional[int] = None
    show_on_homepage: Optional[bool] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    subcategories: List['Category'] = []

    class Config:
        from_attributes = True

# Для рекурсивных моделей
Category.model_rebuild()

