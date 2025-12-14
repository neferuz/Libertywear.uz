from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CartItemBase(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1
    size: Optional[str] = None
    price: float

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    size: Optional[str] = None

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CartItemWithProduct(CartItemResponse):
    product: Optional[dict] = None
    variant: Optional[dict] = None

class CartResponse(BaseModel):
    status: int
    message: str
    count: int = 0
    items: list = []

class CartAddRequest(BaseModel):
    items: list  # Массив товаров для добавления

