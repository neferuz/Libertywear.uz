"""
Утилиты для работы с переводами
"""
from typing import Optional, Dict, Any

def get_translated_text(
    translations: Optional[Dict[str, str]], 
    language: str = 'ru',
    fallback: Optional[str] = None
) -> str:
    """
    Получить переведенный текст из JSON поля переводов
    
    Args:
        translations: JSON объект с переводами {"ru": "...", "uz": "...", ...}
        language: Код языка (ru, uz, en, es)
        fallback: Значение по умолчанию, если перевод не найден
    
    Returns:
        Переведенный текст или fallback
    """
    if not translations:
        return fallback or ""
    
    if isinstance(translations, dict):
        # Пробуем получить перевод для нужного языка
        if language in translations and translations[language]:
            return translations[language]
        
        # Если нет перевода для нужного языка, пробуем русский
        if 'ru' in translations and translations['ru']:
            return translations['ru']
        
        # Если нет русского, берем первый доступный
        if translations:
            first_value = next(iter(translations.values()))
            if first_value:
                return first_value
    
    return fallback or ""


def get_translated_product(product: Any, language: str = 'ru') -> Dict[str, Any]:
    """
    Получить товар с переведенными полями
    
    Args:
        product: Объект Product из БД
        language: Код языка
    
    Returns:
        Словарь с переведенными полями товара
    """
    result = {
        'id': product.id,
        'name': get_translated_text(
            product.name_translations, 
            language, 
            product.name  # fallback на старое поле
        ),
        'description': get_translated_text(
            product.description_translations,
            language,
            product.description
        ),
        'category_id': product.category_id,
        'stock': product.stock,
        'is_active': product.is_active,
        'description_title': get_translated_text(
            product.description_title_translations,
            language,
            product.description_title
        ),
        'material': get_translated_text(
            product.material_translations,
            language,
            product.material
        ),
        'branding': get_translated_text(
            product.branding_translations,
            language,
            product.branding
        ),
        'packaging': get_translated_text(
            product.packaging_translations,
            language,
            product.packaging
        ),
        'size_guide': get_translated_text(
            product.size_guide_translations,
            language,
            product.size_guide
        ),
        'delivery_info': get_translated_text(
            product.delivery_info_translations,
            language,
            product.delivery_info
        ),
        'return_info': get_translated_text(
            product.return_info_translations,
            language,
            product.return_info
        ),
        'exchange_info': get_translated_text(
            product.exchange_info_translations,
            language,
            product.exchange_info
        ),
    }
    
    return result


def get_translated_category(category: Any, language: str = 'ru') -> Dict[str, Any]:
    """
    Получить категорию с переведенными полями
    """
    result = {
        'title_translations': category.title_translations if hasattr(category, 'title_translations') else None,
        'id': category.id,
        'title': get_translated_text(
            category.title_translations,
            language,
            category.title
        ),
        'slug': category.slug,
        'gender': category.gender,
        'image': category.image,
        'parent_id': category.parent_id,
        'order': category.order,
        'show_on_homepage': category.show_on_homepage if hasattr(category, 'show_on_homepage') else False,
        'created_at': category.created_at if hasattr(category, 'created_at') else None,
        'updated_at': category.updated_at if hasattr(category, 'updated_at') else None,
    }
    
    return result

