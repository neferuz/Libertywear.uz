from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FavoriteBase(BaseModel):
    product_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FavoriteWithProduct(FavoriteResponse):
    """Избранное с данными товара"""
    product_name: Optional[str] = None
    product_price: Optional[float] = None
    product_image: Optional[str] = None
    product_slug: Optional[str] = None

