"""
Скрипт для автоматического проставления иконок существующим социальным ссылкам
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.social_links import SocialLinks

def get_social_icon(name, url):
    """Определяет иконку по названию или URL"""
    if not name and not url:
        return 'FiLink';
    
    lower_name = (name or '').lower();
    lower_url = (url or '').lower();
    
    if 'instagram' in lower_name or 'instagram' in lower_url:
        return 'FiInstagram';
    if 'facebook' in lower_name or 'facebook' in lower_url:
        return 'FiFacebook';
    if 'twitter' in lower_name or 'twitter' in lower_url or 'x.com' in lower_url:
        return 'FiTwitter';
    if 'youtube' in lower_name or 'youtube' in lower_url:
        return 'FiYoutube';
    if 'telegram' in lower_name or 'telegram' in lower_url:
        return 'FiSend';
    if 'whatsapp' in lower_name or 'whatsapp' in lower_url:
        return 'FiMessageCircle';
    if 'linkedin' in lower_name or 'linkedin' in lower_url:
        return 'FiLinkedin';
    if 'tiktok' in lower_name or 'tiktok' in lower_url:
        return 'FiVideo';
    if 'vk' in lower_name or 'vk.com' in lower_url:
        return 'FiUsers';
    if 'pinterest' in lower_name or 'pinterest' in lower_url:
        return 'FiImage';
    if 'snapchat' in lower_name or 'snapchat' in lower_url:
        return 'FiCamera';
    
    return 'FiLink';

def add_icons_to_existing_links():
    """Добавляет иконки к существующим социальным ссылкам"""
    db = SessionLocal();
    try:
        social_links = db.query(SocialLinks).first();
        
        if not social_links or not social_links.links:
            print("Нет социальных ссылок для обновления");
            return;
        
        updated = False;
        for link in social_links.links:
            # Если иконка не указана, определяем автоматически
            if 'icon' not in link or not link.get('icon'):
                link['icon'] = get_social_icon(link.get('name', ''), link.get('url', ''));
                updated = True;
                print(f"Добавлена иконка '{link['icon']}' для '{link.get('name', 'Без названия')}'");
        
        if updated:
            db.commit();
            print(f"\n✅ Успешно обновлено {len(social_links.links)} ссылок");
        else:
            print("\n✅ Все ссылки уже имеют иконки");
            
    except Exception as e:
        db.rollback();
        print(f"❌ Ошибка: {e}");
    finally:
        db.close();

if __name__ == "__main__":
    print("Добавление иконок к существующим социальным ссылкам...\n");
    add_icons_to_existing_links();

