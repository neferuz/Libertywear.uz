import random
import string
from datetime import datetime, timedelta
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.utils.email_template import get_verification_email_html, get_verification_email_text
from app.config import settings
import os

def generate_verification_code(length: int = 5) -> str:
    """Генерация кода подтверждения (5 цифр)"""
    return ''.join(random.choices(string.digits, k=length))

def get_code_expiration(minutes: int = 15) -> datetime:
    """Получение времени истечения кода"""
    return datetime.utcnow() + timedelta(minutes=minutes)

async def send_verification_email(email: str, code: str) -> bool:
    """
    Отправка кода подтверждения на email через SMTP
    """
    try:
        # Настройки SMTP из settings (загружаются из .env)
        smtp_host = settings.SMTP_HOST or "smtp.gmail.com"
        smtp_port = settings.SMTP_PORT or 587
        smtp_user = settings.SMTP_USER or ""
        smtp_password = settings.SMTP_PASSWORD or ""
        smtp_from_email = settings.SMTP_FROM_EMAIL or smtp_user
        smtp_from_name = settings.SMTP_FROM_NAME or "Liberty"
        
        # Если SMTP не настроен, выводим в консоль для разработки
        # Проверяем, что это не шаблонные значения
        is_template = (
            not smtp_user or 
            not smtp_password or 
            smtp_user == "your-email@gmail.com" or 
            "your-" in smtp_user.lower() or 
            "your-" in smtp_password.lower()
        )
        if is_template:
            print(f"\n{'='*70}")
            print(f"📧 [LIBERTY] КОД ПОДТВЕРЖДЕНИЯ")
            print(f"{'='*70}")
            print(f"Email: {email}")
            print(f"Код: {code}")
            print(f"{'='*70}\n")
            # Также выводим в stderr для лучшей видимости
            import sys
            print(f"[LIBERTY] Код подтверждения для {email}: {code}", file=sys.stderr)
            return True
        
        # Создание сообщения
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Код подтверждения Liberty"
        msg['From'] = f"{smtp_from_name} <{smtp_from_email}>"
        msg['To'] = email
        
        # HTML и текстовая версии
        text_part = MIMEText(get_verification_email_text(code), 'plain', 'utf-8')
        html_part = MIMEText(get_verification_email_html(code, email), 'html', 'utf-8')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Отправка через SMTP
        print(f"[LIBERTY] Попытка отправки email на {email}...")
        print(f"[LIBERTY] SMTP: {smtp_host}:{smtp_port}, User: {smtp_user}")
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        print(f"[LIBERTY] SMTP соединение установлено")
        
        server.starttls()
        print(f"[LIBERTY] TLS активирован")
        
        server.login(smtp_user, smtp_password)
        print(f"[LIBERTY] Авторизация успешна")
        
        server.send_message(msg)
        print(f"[LIBERTY] Сообщение отправлено")
        
        server.quit()
        
        # Всегда выводим код в лог для отладки (на случай если письмо не придет)
        import sys
        print(f"\n{'='*70}")
        print(f"📧 [LIBERTY] КОД ПОДТВЕРЖДЕНИЯ ОТПРАВЛЕН")
        print(f"{'='*70}")
        print(f"Email получателя: {email}")
        print(f"Код подтверждения: {code}")
        print(f"{'='*70}\n")
        print(f"[LIBERTY] Код подтверждения для {email}: {code}", file=sys.stderr)
        
        print(f"[LIBERTY] ✅ Email успешно отправлен на {email}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        # Ошибка аутентификации
        print(f"\n{'='*70}")
        print(f"❌ [LIBERTY] ОШИБКА АВТОРИЗАЦИИ SMTP")
        print(f"{'='*70}")
        print(f"Ошибка: {e}")
        print(f"Email: {email}")
        print(f"Код подтверждения: {code}")
        print(f"{'='*70}\n")
        import sys
        print(f"[LIBERTY] Код подтверждения для {email}: {code}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Возвращаем False, но выводим код в консоль для разработки
        return False
    except smtplib.SMTPException as e:
        # Другие SMTP ошибки
        print(f"\n{'='*70}")
        print(f"❌ [LIBERTY] ОШИБКА SMTP")
        print(f"{'='*70}")
        print(f"Ошибка: {e}")
        print(f"Email: {email}")
        print(f"Код подтверждения: {code}")
        print(f"{'='*70}\n")
        import sys
        print(f"[LIBERTY] Код подтверждения для {email}: {code}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Возвращаем False, но выводим код в консоль для разработки
        return False
    except Exception as e:
        # В случае любой другой ошибки выводим код в консоль
        print(f"\n{'='*70}")
        print(f"❌ [LIBERTY] ОШИБКА ОТПРАВКИ EMAIL")
        print(f"{'='*70}")
        print(f"Ошибка: {e}")
        print(f"Тип ошибки: {type(e).__name__}")
        print(f"Email: {email}")
        print(f"Код подтверждения: {code}")
        print(f"{'='*70}\n")
        import sys
        print(f"[LIBERTY] Код подтверждения для {email}: {code}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Возвращаем False при ошибках
        return False

