from fastapi import APIRouter, Query, Depends, HTTPException, status, Request
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
from app.utils.translations import get_translated_product, get_translated_text

router = APIRouter(prefix="/products", tags=["products"])

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
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """
    Получить список товаров с пагинацией и фильтрацией
    """
    query = db.query(Product).filter(Product.is_active == True)
    
    # Фильтрация по gender через категорию
    if itemGender:
        # Пробуем разные варианты gender для совместимости
        gender_variants = [itemGender]
        if itemGender.lower() == 'kids':
            gender_variants = ['kids', 'children', 'girls', 'boys', 'kid']
        elif itemGender.lower() == 'children':
            gender_variants = ['children', 'kids', 'girls', 'boys']
        elif itemGender.lower() == 'male' or itemGender.lower() == 'men':
            gender_variants = ['male', 'men']
        elif itemGender.lower() == 'female' or itemGender.lower() == 'women':
            gender_variants = ['female', 'women']
        
        # Находим все категории с нужным gender (любого уровня)
        categories_with_gender = db.query(Category.id).filter(
            Category.gender.in_(gender_variants)
        ).all()
        category_ids_with_gender = [cat.id for cat in categories_with_gender]
        
        # Находим все подкатегории этих категорий (рекурсивно до 4 уровней)
        def get_all_subcategory_ids(parent_ids, depth=0, max_depth=4):
            if depth >= max_depth or not parent_ids:
                return []
            subcategories = db.query(Category.id).filter(
                Category.parent_id.in_(parent_ids)
            ).all()
            subcategory_ids = [sub.id for sub in subcategories]
            # Рекурсивно получаем подкатегории подкатегорий
            if subcategory_ids:
                subcategory_ids.extend(get_all_subcategory_ids(subcategory_ids, depth + 1, max_depth))
            return subcategory_ids
        
        all_subcategory_ids = get_all_subcategory_ids(category_ids_with_gender)
        
        # Объединяем категории с gender и все их подкатегории
        all_valid_category_ids = list(set(category_ids_with_gender + all_subcategory_ids))
        
        if all_valid_category_ids:
            # Фильтруем товары по найденным категориям
            query = query.join(Category).filter(
                Category.id.in_(all_valid_category_ids)
            )
        else:
            # Если нет категорий с нужным gender, возвращаем пустой результат
            query = query.filter(Product.id == -1)  # Невозможное условие
    
    # Фильтрация по категории (slug)
    if itemCategory:
        # Если уже есть join с Category, используем его, иначе делаем новый join
        if not itemGender:
            query = query.join(Category)
        query = query.filter(Category.slug == itemCategory)
    
    # Подсчет общего количества
    total_count = query.count()
    
    # Пагинация
    products = query.offset(page * limit).limit(limit).all()
    
    # Применяем переводы к товарам
    translated_products = []
    for product in products:
        translated = get_translated_product(product, lang)
        # Добавляем остальные поля
        translated['variants'] = product.variants
        translated['category'] = product.category
        translated['created_at'] = product.created_at
        translated['updated_at'] = product.updated_at
        translated_products.append(translated)
    
    return {
        "data": translated_products,
        "count": total_count,
        "page": page,
        "limit": limit
    }

@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(
    product_id: int, 
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """
    Получить товар по ID с переводами
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Применяем переводы
    translated = get_translated_product(product, lang)
    # Добавляем остальные поля
    translated['variants'] = product.variants
    translated['category'] = product.category
    translated['created_at'] = product.created_at
    translated['updated_at'] = product.updated_at
    
    return translated

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
        # Получаем старые варианты
        old_variants = db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()
        
        # Удаляем изображения старых вариантов
        for old_variant in old_variants:
            db.query(ProductImage).filter(ProductImage.variant_id == old_variant.id).delete()
        
        # Удаляем старые варианты
        for old_variant in old_variants:
            db.delete(old_variant)
        
        db.flush()  # Применяем удаление перед созданием новых
        
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
            db.flush()  # Получаем ID нового варианта
            
            # Добавляем изображения
            if variant_data.images:
                for idx, image_url in enumerate(variant_data.images):
                    if image_url:  # Проверяем, что URL не пустой
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
