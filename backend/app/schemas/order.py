from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    size: Optional[str] = None
    price: float
    total_price: float
    product_data: Optional[Dict[str, Any]] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_amount: float
    discount_amount: float = 0
    payment_method: str
    address: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[Dict[str, Any]]  # Список товаров из корзины

class UserInfo(BaseModel):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True

class OrderResponse(OrderBase):
    id: int
    user_id: int
    payment_status: str
    order_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    user: Optional[UserInfo] = None

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    status: int
    message: str
    order_id: Optional[int] = None
    user_id: Optional[int] = None

