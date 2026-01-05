#!/usr/bin/env python3
"""
Тестовый скрипт для проверки отправки email
"""
import asyncio
import sys
import os

# Добавляем путь к проекту
sys.path.insert(0, os.path.dirname(__file__))

from app.utils.email import send_verification_email

async def test_email():
    """Тестовая отправка email"""
    test_email = "notferuz@gmail.com"
    test_code = "12345"
    
    print("=" * 70)
    print("ТЕСТ ОТПРАВКИ EMAIL")
    print("=" * 70)
    print(f"Email получателя: {test_email}")
    print(f"Тестовый код: {test_code}")
    print("=" * 70)
    print()
    
    try:
        result = await send_verification_email(test_email, test_code)
        if result:
            print()
            print("✅ Функция вернула True - email должен быть отправлен")
            print("Проверьте почту:", test_email)
        else:
            print()
            print("❌ Функция вернула False - email не был отправлен")
    except Exception as e:
        print()
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_email())

