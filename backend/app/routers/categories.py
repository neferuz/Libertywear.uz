from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.utils.slug import generate_slug
from app.utils.translations import get_translated_category

def load_category_with_subcategories(db, category, lang, max_depth=3, current_depth=0):
    """Рекурсивно загружает категорию со всеми подкатегориями"""
    if current_depth >= max_depth:
        return []
    
    translated = get_translated_category(category, lang)
    translated['id'] = category.id
    translated['created_at'] = category.created_at
    translated['updated_at'] = category.updated_at
    
    # Загружаем подкатегории
    subcategories = db.query(Category).filter(
        Category.parent_id == category.id
    ).order_by(Category.order).all()
    
    translated['subcategories'] = [
        load_category_with_subcategories(db, sub, lang, max_depth, current_depth + 1)
        for sub in subcategories
    ]
    
    return translated

def get_all_subcategory_ids(db: Session, category_id: int) -> List[int]:
    """Рекурсивно получает все ID подкатегорий (включая вложенные)"""
    subcategory_ids = []
    subcategories = db.query(Category).filter(Category.parent_id == category_id).all()
    
    for subcategory in subcategories:
        subcategory_ids.append(subcategory.id)
        # Рекурсивно получаем подкатегории подкатегорий
        subcategory_ids.extend(get_all_subcategory_ids(db, subcategory.id))
    
    return subcategory_ids


router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[CategorySchema])
def list_categories(
    parent_id: Optional[int] = None, 
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """Получить все категории. Если указан parent_id, возвращает только подкатегории"""
    query = db.query(Category)
    
    if parent_id is not None:
        query = query.filter(Category.parent_id == parent_id)
    else:
        # По умолчанию возвращаем только главные категории (без родителя)
        query = query.filter(Category.parent_id == None)
    
    categories = query.order_by(Category.order).all()
    
    # Применяем переводы и загружаем подкатегории
    translated_categories = []
    for category in categories:
        translated = get_translated_category(category, lang)
        # Загружаем подкатегории
        subcategories = db.query(Category).filter(
            Category.parent_id == category.id
        ).order_by(Category.order).all()
        translated['subcategories'] = [
            {**get_translated_category(sub, lang), 'id': sub.id, 'created_at': sub.created_at, 'updated_at': sub.updated_at, 
             'subcategories': [
                 {**get_translated_category(subsub, lang), 'id': subsub.id, 'created_at': subsub.created_at, 'updated_at': subsub.updated_at,
                  'subcategories': [
                      {**get_translated_category(subsubsub, lang), 'id': subsubsub.id, 'created_at': subsubsub.created_at, 'updated_at': subsubsub.updated_at}
                      for subsubsub in db.query(Category).filter(Category.parent_id == subsub.id).order_by(Category.order).all()
                  ]}
                 for subsub in db.query(Category).filter(Category.parent_id == sub.id).order_by(Category.order).all()
             ]}
            for sub in subcategories
        ]
        translated['id'] = category.id
        translated['created_at'] = category.created_at
        translated['updated_at'] = category.updated_at
        translated_categories.append(translated)
    
    return translated_categories

@router.get("/all", response_model=List[CategorySchema])
def list_all_categories(
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """Получить все категории включая подкатегории с переводами (рекурсивно)"""
    def load_category_recursive(cat, max_depth=5, current_depth=0):
        """Рекурсивно загружает категорию со всеми подкатегориями"""
        if current_depth >= max_depth:
            return None
        
        translated = get_translated_category(cat, lang)
        translated['id'] = cat.id
        translated['created_at'] = cat.created_at
        translated['updated_at'] = cat.updated_at
        
        # Загружаем подкатегории
        subcategories = db.query(Category).filter(
            Category.parent_id == cat.id
        ).order_by(Category.order).all()
        
        translated['subcategories'] = [
            load_category_recursive(sub, max_depth, current_depth + 1)
            for sub in subcategories
        ]
        
        return translated
    
    # Получаем только главные категории (без родителя)
    main_categories = db.query(Category).filter(
        Category.parent_id == None
    ).order_by(Category.order).all()
    
    # Рекурсивно загружаем каждую категорию со всеми подкатегориями
    translated_categories = [
        load_category_recursive(category) for category in main_categories
    ]
    
    return translated_categories

@router.get("/slug/{slug}", response_model=CategorySchema)
def get_category_by_slug(
    slug: str,
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """Получить категорию по slug с переводами (ищет в категориях, подкатегориях и под-подкатегориях)"""
    # Ищем категорию по slug (включая подкатегории)
    category = db.query(Category).filter(Category.slug == slug).first()
    
    if not category:
        raise HTTPException(status_code=404, detail=f"Категория со slug '{slug}' не найдена")
    
    # Применяем переводы
    translated = get_translated_category(category, lang)
    # Загружаем подкатегории рекурсивно
    translated['subcategories'] = [
        load_category_with_subcategories(db, sub, lang, max_depth=3, current_depth=1)
        for sub in db.query(Category).filter(Category.parent_id == category.id).order_by(Category.order).all()
    ]
    translated['id'] = category.id
    translated['created_at'] = category.created_at
    translated['updated_at'] = category.updated_at
    
    return translated

@router.get("/{category_id}", response_model=CategorySchema)
def get_category(
    category_id: int, 
    lang: str = Query('ru', description="Language code (ru, uz, en, es)"),
    db: Session = Depends(get_db)
):
    """Получить категорию по ID с переводами"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Применяем переводы
    translated = get_translated_category(category, lang)
    # Загружаем подкатегории
    subcategories = db.query(Category).filter(
        Category.parent_id == category.id
    ).order_by(Category.order).all()
    translated['subcategories'] = [
        get_translated_category(sub, lang) for sub in subcategories
    ]
    translated['id'] = category.id
    translated['created_at'] = category.created_at
    translated['updated_at'] = category.updated_at
    
    return translated

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
    
    # Получаем все ID подкатегорий (включая вложенные)
    all_subcategory_ids = get_all_subcategory_ids(db, category_id)
    
    # Проверяем только АКТИВНЫЕ товары в самой категории (неактивные товары игнорируем)
    products_in_category = db.query(Product).filter(
        Product.category_id == category_id,
        Product.is_active == True
    ).count()
    
    # Получаем список активных товаров для отладки
    if products_in_category > 0:
        products_list = db.query(Product).filter(
            Product.category_id == category_id,
            Product.is_active == True
        ).all()
        print(f"🔍 [DELETE] Найдено {products_in_category} активных товаров в категории {category_id}:")
        for p in products_list:
            print(f"  - ID {p.id}: {p.name} (category_id={p.category_id}, is_active={p.is_active})")
    
    # Проверяем только АКТИВНЫЕ товары во всех подкатегориях
    products_in_subcategories = []
    for subcat_id in all_subcategory_ids:
        subcat = db.query(Category).filter(Category.id == subcat_id).first()
        if subcat:
            count = db.query(Product).filter(
                Product.category_id == subcat_id,
                Product.is_active == True
            ).count()
            if count > 0:
                # Получаем название подкатегории через get_translated_category
                from app.utils.translations import get_translated_category
                subcat_translated = get_translated_category(subcat, 'ru')
                subcat_title = subcat_translated.get('title') or subcat.title or f"ID {subcat_id}"
                products_list = db.query(Product).filter(
                    Product.category_id == subcat_id,
                    Product.is_active == True
                ).all()
                print(f"🔍 [DELETE] Найдено {count} активных товаров в подкатегории {subcat_id} ({subcat_title}):")
                for p in products_list:
                    print(f"  - ID {p.id}: {p.name} (category_id={p.category_id}, is_active={p.is_active})")
                products_in_subcategories.append({
                    'id': subcat_id,
                    'title': subcat_title,
                    'count': count
                })
    
    # Формируем сообщение об ошибке
    error_parts = []
    
    if products_in_category > 0:
        # Используем get_translated_category для получения названия
        from app.utils.translations import get_translated_category
        category_translated = get_translated_category(category, 'ru')
        category_title = category_translated.get('title') or category.title or f"ID {category_id}"
        error_parts.append(f"в категории '{category_title}' ({products_in_category} шт.)")
    
    if products_in_subcategories:
        subcat_messages = [f"в подкатегории '{item['title']}' ({item['count']} шт.)" for item in products_in_subcategories]
        error_parts.extend(subcat_messages)
    
    if error_parts:
        error_message = f"Нельзя удалить категорию. Товары найдены: {', '.join(error_parts)}. Сначала переместите или удалите товары."
        raise HTTPException(status_code=400, detail=error_message)
    
    # Если есть подкатегории, но в них нет товаров, все равно нельзя удалить
    if len(all_subcategory_ids) > 0:
        raise HTTPException(
            status_code=400, 
            detail="Нельзя удалить категорию, у которой есть подкатегории. Сначала удалите подкатегории."
        )
    
    db.delete(category)
    db.commit()
    return None
