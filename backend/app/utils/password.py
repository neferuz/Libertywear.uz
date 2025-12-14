from passlib.context import CryptContext
import bcrypt

# Используем bcrypt напрямую для избежания проблем с версиями
def hash_password(password: str) -> str:
    """Хеширование пароля"""
    # Конвертируем в bytes если нужно
    if isinstance(password, str):
        password = password.encode('utf-8')
    # Генерируем соль и хешируем
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    try:
        if isinstance(plain_password, str):
            plain_password = plain_password.encode('utf-8')
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password, hashed_password)
    except Exception:
        return False

