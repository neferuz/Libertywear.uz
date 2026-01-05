"""
Middleware для определения языка из заголовков запроса
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class LanguageMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Получаем язык из query параметра или заголовка
        language = request.query_params.get('lang', 'ru')
        
        # Если нет в query, пробуем из заголовка
        if language == 'ru':
            accept_language = request.headers.get('Accept-Language', '')
            if 'uz' in accept_language.lower():
                language = 'uz'
            elif 'en' in accept_language.lower():
                language = 'en'
            elif 'es' in accept_language.lower():
                language = 'es'
        
        # Сохраняем язык в state запроса
        request.state.language = language
        
        response = await call_next(request)
        return response
