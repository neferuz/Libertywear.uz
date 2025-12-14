"""
Скрипт для инициализации категорий
"""
from app.database import SessionLocal
from app.models.category import Category

def init_categories():
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже данные
        if db.query(Category).count() > 0:
            print("Категории уже инициализированы")
            return

        # Главные категории
        women = Category(
            title="WOMEN",
            slug="women",
            gender="female",
            image="https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg",
            order=1
        )
        men = Category(
            title="MEN",
            slug="men",
            gender="male",
            image="https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg",
            order=2
        )
        kids = Category(
            title="KIDS",
            slug="kids",
            gender="kids",
            image="https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg",
            order=3
        )

        db.add(women)
        db.add(men)
        db.add(kids)
        db.commit()
        db.refresh(women)
        db.refresh(men)
        db.refresh(kids)

        print("✅ Категории успешно инициализированы!")
        print(f"  - Главных категорий: 3")

    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при инициализации категорий: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_categories()

