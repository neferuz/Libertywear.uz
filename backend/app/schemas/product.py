from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class ProductImageBase(BaseModel):
    image_url: str
    order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: int
    variant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    color_name: str
    color_image: Optional[str] = None
    price: float
    stock: int = 0
    sizes: Optional[List[str]] = []
    size_stock: Optional[Dict[str, int]] = {}

class ProductVariantCreate(ProductVariantBase):
    images: Optional[List[str]] = []  # URLs изображений

class ProductVariantUpdate(ProductVariantBase):
    color_name: Optional[str] = None
    color_image: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    sizes: Optional[List[str]] = None
    size_stock: Optional[Dict[str, int]] = None
    images: Optional[List[str]] = None

class ProductVariant(ProductVariantBase):
    id: int
    product_id: int
    images: List[ProductImage] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    stock: int = 0
    description_title: Optional[str] = None
    material: Optional[str] = None
    branding: Optional[str] = None
    packaging: Optional[str] = None
    size_guide: Optional[str] = None
    delivery_info: Optional[str] = None
    return_info: Optional[str] = None
    exchange_info: Optional[str] = None

class ProductCreate(ProductBase):
    variants: List[ProductVariantCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    description_title: Optional[str] = None
    material: Optional[str] = None
    branding: Optional[str] = None
    packaging: Optional[str] = None
    size_guide: Optional[str] = None
    delivery_info: Optional[str] = None
    return_info: Optional[str] = None
    exchange_info: Optional[str] = None
    variants: Optional[List[ProductVariantUpdate]] = None

class Product(ProductBase):
    id: int
    is_active: bool
    variants: List[ProductVariant] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    data: List[Product]
    count: int
    page: int
    limit: int

