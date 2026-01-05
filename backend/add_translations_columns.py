"""
Скрипт для добавления колонок переводов в существующие таблицы
"""
from app.database import engine
from sqlalchemy import text

def add_translation_columns():
    """Добавляет колонки для переводов в таблицы"""
    
    with engine.connect() as conn:
        # Product translations
        try:
            conn.execute(text("""
                ALTER TABLE products 
                ADD COLUMN IF NOT EXISTS name_translations JSON,
                ADD COLUMN IF NOT EXISTS description_translations JSON,
                ADD COLUMN IF NOT EXISTS description_title_translations JSON,
                ADD COLUMN IF NOT EXISTS material_translations JSON,
                ADD COLUMN IF NOT EXISTS branding_translations JSON,
                ADD COLUMN IF NOT EXISTS packaging_translations JSON,
                ADD COLUMN IF NOT EXISTS size_guide_translations JSON,
                ADD COLUMN IF NOT EXISTS delivery_info_translations JSON,
                ADD COLUMN IF NOT EXISTS return_info_translations JSON,
                ADD COLUMN IF NOT EXISTS exchange_info_translations JSON;
            """))
            print("✅ Product translation columns added")
        except Exception as e:
            print(f"⚠️ Product columns: {e}")
        
        # Category translations
        try:
            conn.execute(text("""
                ALTER TABLE categories 
                ADD COLUMN IF NOT EXISTS title_translations JSON;
            """))
            print("✅ Category translation columns added")
        except Exception as e:
            print(f"⚠️ Category columns: {e}")
        
        # Page content translations
        try:
            conn.execute(text("""
                ALTER TABLE about_sections 
                ADD COLUMN IF NOT EXISTS title_translations JSON,
                ADD COLUMN IF NOT EXISTS description_translations JSON;
            """))
            print("✅ AboutSection translation columns added")
        except Exception as e:
            print(f"⚠️ AboutSection columns: {e}")
        
        try:
            conn.execute(text("""
                ALTER TABLE team_members 
                ADD COLUMN IF NOT EXISTS name_translations JSON,
                ADD COLUMN IF NOT EXISTS role_translations JSON;
            """))
            print("✅ TeamMember translation columns added")
        except Exception as e:
            print(f"⚠️ TeamMember columns: {e}")
        
        try:
            conn.execute(text("""
                ALTER TABLE contact_info 
                ADD COLUMN IF NOT EXISTS title_translations JSON,
                ADD COLUMN IF NOT EXISTS content_translations JSON;
            """))
            print("✅ ContactInfo translation columns added")
        except Exception as e:
            print(f"⚠️ ContactInfo columns: {e}")
        
        try:
            conn.execute(text("""
                ALTER TABLE faq_items 
                ADD COLUMN IF NOT EXISTS question_translations JSON,
                ADD COLUMN IF NOT EXISTS answer_translations JSON;
            """))
            print("✅ FAQItem translation columns added")
        except Exception as e:
            print(f"⚠️ FAQItem columns: {e}")
        
        conn.commit()
        print("\n✅ All translation columns added successfully!")

if __name__ == "__main__":
    add_translation_columns()
