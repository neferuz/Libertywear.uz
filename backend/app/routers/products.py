from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.product import Product, ProductVariant, ProductImage
from app.models.category import Category
from app.schemas.product import (
    Product as ProductSchema,
    ProductCreate,
    ProductUpdate,
    ProductListResponse,
    ProductVariantCreate,
    ProductVariantUpdate
)

router = APIRouter(prefix="/cloths", tags=["products"])

# POST должен быть перед GET с параметрами
@router.post("", response_model=ProductSchema, status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    """
    Создать новый товар
    """
    # Проверка существования категории
    category = db.query(Category).filter(Category.id == product_data.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Создание товара
    new_product = Product(
        name=product_data.name,
        description=product_data.description,
        category_id=product_data.category_id,
        stock=product_data.stock,
        description_title=product_data.description_title,
        material=product_data.material,
        branding=product_data.branding,
        packaging=product_data.packaging,
        size_guide=product_data.size_guide,
        delivery_info=product_data.delivery_info,
        return_info=product_data.return_info,
        exchange_info=product_data.exchange_info
    )
    db.add(new_product)
    db.flush()  # Получаем ID товара
    
    # Создание вариантов
    for variant_data in product_data.variants:
        new_variant = ProductVariant(
            product_id=new_product.id,
            color_name=variant_data.color_name,
            color_image=variant_data.color_image,
            price=variant_data.price,
            stock=variant_data.stock,
            sizes=variant_data.sizes or [],
            size_stock=variant_data.size_stock or {}
        )
        db.add(new_variant)
        db.flush()  # Получаем ID варианта
        
        # Создание изображений для варианта
        for idx, image_url in enumerate(variant_data.images or []):
            new_image = ProductImage(
                variant_id=new_variant.id,
                image_url=image_url,
                order=idx
            )
            db.add(new_image)
    
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    itemGender: Optional[str] = None,
    itemCategory: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Получить список товаров с пагинацией и фильтрацией
    """
    query = db.query(Product).filter(Product.is_active == True)
    
    # Фильтрация по gender через категорию
    if itemGender:
        query = query.join(Category).filter(Category.gender == itemGender)
    
    # Фильтрация по категории (slug)
    if itemCategory:
        query = query.join(Category).filter(Category.slug == itemCategory)
    
    # Подсчет общего количества
    total_count = query.count()
    
    # Пагинация
    products = query.offset(page * limit).limit(limit).all()
    
    return {
        "data": products,
        "count": total_count,
        "page": page,
        "limit": limit
    }

@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Получить товар по ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить товар
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Обновление основных полей
    if product_update.name is not None:
        product.name = product_update.name
    if product_update.description is not None:
        product.description = product_update.description
    if product_update.category_id is not None:
        category = db.query(Category).filter(Category.id == product_update.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        product.category_id = product_update.category_id
    if product_update.stock is not None:
        product.stock = product_update.stock
    if product_update.is_active is not None:
        product.is_active = product_update.is_active
    if product_update.description_title is not None:
        product.description_title = product_update.description_title
    if product_update.material is not None:
        product.material = product_update.material
    if product_update.branding is not None:
        product.branding = product_update.branding
    if product_update.packaging is not None:
        product.packaging = product_update.packaging
    if product_update.size_guide is not None:
        product.size_guide = product_update.size_guide
    if product_update.delivery_info is not None:
        product.delivery_info = product_update.delivery_info
    if product_update.return_info is not None:
        product.return_info = product_update.return_info
    if product_update.exchange_info is not None:
        product.exchange_info = product_update.exchange_info
    
    # Обновление вариантов (если предоставлены)
    if product_update.variants is not None:
        # Удаляем старые варианты
        db.query(ProductVariant).filter(ProductVariant.product_id == product_id).delete()
        
        # Создаем новые варианты
        for variant_data in product_update.variants:
            new_variant = ProductVariant(
                product_id=product.id,
                color_name=variant_data.color_name or "",
                color_image=variant_data.color_image,
                price=variant_data.price or 0,
                stock=variant_data.stock or 0,
                sizes=variant_data.sizes or [],
                size_stock=variant_data.size_stock or {}
            )
            db.add(new_variant)
            db.flush()
            
            # Добавляем изображения
            for idx, image_url in enumerate(variant_data.images or []):
                new_image = ProductImage(
                    variant_id=new_variant.id,
                    image_url=image_url,
                    order=idx
                )
                db.add(new_image)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Удалить товар (мягкое удаление - устанавливает is_active = False)
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_active = False
    db.commit()
    return None
