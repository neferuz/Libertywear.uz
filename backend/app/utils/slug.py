import re
import unicodedata

def generate_slug(text: str) -> str:
    """
    Генерация slug из текста
    Конвертирует кириллицу в латиницу, убирает спецсимволы, заменяет пробелы на дефисы
    """
    if not text:
        return ""
    
    # Транслитерация кириллицы в латиницу
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    }
    
    # Конвертируем текст
    result = ""
    for char in text:
        if char in translit_map:
            result += translit_map[char]
        else:
            result += char
    
    # Нормализуем Unicode (убираем диакритические знаки)
    result = unicodedata.normalize('NFKD', result)
    
    # Конвертируем в lowercase
    result = result.lower()
    
    # Заменяем пробелы и подчеркивания на дефисы
    result = re.sub(r'[\s_]+', '-', result)
    
    # Убираем все символы кроме букв, цифр и дефисов
    result = re.sub(r'[^a-z0-9\-]', '', result)
    
    # Убираем множественные дефисы
    result = re.sub(r'-+', '-', result)
    
    # Убираем дефисы в начале и конце
    result = result.strip('-')
    
    return result

