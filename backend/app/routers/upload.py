from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/upload", tags=["upload"])

# Создаем директорию для загрузок, если её нет
UPLOAD_DIR = Path("uploads/images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Разрешенные типы файлов
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

def allowed_file(filename: str) -> bool:
    """Проверка расширения файла"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Загрузка изображения с компьютера
    Возвращает URL для использования в формах
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Файл не выбран")
    
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"Неподдерживаемый формат файла. Разрешенные форматы: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Генерируем уникальное имя файла
    import uuid
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Возвращаем URL для доступа к файлу
        # В продакшене это должен быть полный URL с доменом
        file_url = f"/uploads/images/{unique_filename}"
        
        return JSONResponse({
            "url": file_url,
            "filename": unique_filename,
            "message": "Файл успешно загружен"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла: {str(e)}")

