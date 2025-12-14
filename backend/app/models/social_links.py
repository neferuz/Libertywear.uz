from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class SocialLinks(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    links = Column(JSON, nullable=True)  # [{"name": "Instagram", "url": "https://..."}, ...]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

