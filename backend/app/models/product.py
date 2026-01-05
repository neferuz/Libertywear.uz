from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Старое поле для обратной совместимости
    description = Column(Text, nullable=True)  # Старое поле для обратной совместимости
    # Переводы для названия и описания
    name_translations = Column(JSON, nullable=True)  # {"ru": "Название", "uz": "Nomi", "en": "Name", "es": "Nombre"}
    description_translations = Column(JSON, nullable=True)  # {"ru": "Описание", "uz": "Tavsif", ...}
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Детальное описание товара
    description_title = Column(Text, nullable=True)  # Заголовок описания (старое поле)
    description_title_translations = Column(JSON, nullable=True)  # Переводы заголовка описания
    material = Column(Text, nullable=True)  # Материал (старое поле)
    material_translations = Column(JSON, nullable=True)  # Переводы материала
    branding = Column(Text, nullable=True)  # Брендинг (старое поле)
    branding_translations = Column(JSON, nullable=True)  # Переводы брендинга
    packaging = Column(Text, nullable=True)  # Упаковка (старое поле)
    packaging_translations = Column(JSON, nullable=True)  # Переводы упаковки
    size_guide = Column(Text, nullable=True)  # Гид по размерам (старое поле)
    size_guide_translations = Column(JSON, nullable=True)  # Переводы гида по размерам
    delivery_info = Column(Text, nullable=True)  # Информация о доставке (старое поле)
    delivery_info_translations = Column(JSON, nullable=True)  # Переводы информации о доставке
    return_info = Column(Text, nullable=True)  # Информация о возврате (старое поле)
    return_info_translations = Column(JSON, nullable=True)  # Переводы информации о возврате
    exchange_info = Column(Text, nullable=True)  # Информация об обмене (старое поле)
    exchange_info_translations = Column(JSON, nullable=True)  # Переводы информации об обмене

    # Relationships
    category = relationship("Category", backref="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    color_name = Column(String, nullable=False)
    color_image = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    size_stock = Column(JSON, nullable=True)  # {"S": 10, "M": 20, "L": 15}
    sizes = Column(JSON, nullable=True)  # ["S", "M", "L"]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    product = relationship("Product", back_populates="variants")
    images = relationship("ProductImage", back_populates="variant", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    image_url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    variant = relationship("ProductVariant", back_populates="images")

