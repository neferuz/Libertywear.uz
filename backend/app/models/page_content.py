from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class AboutSection(Base):
    __tablename__ = "about_sections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  # Старое поле
    title_translations = Column(JSON, nullable=True)  # Переводы заголовка
    description = Column(Text, nullable=False)  # Старое поле
    description_translations = Column(JSON, nullable=True)  # Переводы описания
    image = Column(String, nullable=True)
    reverse = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Старое поле
    name_translations = Column(JSON, nullable=True)  # Переводы имени
    role = Column(String, nullable=False)  # Старое поле
    role_translations = Column(JSON, nullable=True)  # Переводы роли
    image = Column(String, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    icon_type = Column(String, nullable=False)  # 'map', 'phone', 'email', 'clock'
    title = Column(String, nullable=False)  # Старое поле
    title_translations = Column(JSON, nullable=True)  # Переводы заголовка
    content = Column(String, nullable=False)  # Старое поле
    content_translations = Column(JSON, nullable=True)  # Переводы содержимого
    details = Column(String, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)  # Старое поле
    question_translations = Column(JSON, nullable=True)  # Переводы вопроса
    answer = Column(Text, nullable=False)  # Старое поле
    answer_translations = Column(JSON, nullable=True)  # Переводы ответа
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

