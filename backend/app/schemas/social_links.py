from pydantic import BaseModel
from typing import Optional, List

class SocialLinkItem(BaseModel):
    name: str
    url: str
    icon: Optional[str] = None  # Название иконки из react-icons (например: "FiInstagram")
    iconUrl: Optional[str] = None  # URL кастомной иконки
    iconType: Optional[str] = 'default'  # Тип иконки: 'default' (из списка) или 'custom' (кастомная)

class SocialLinksBase(BaseModel):
    links: Optional[List[SocialLinkItem]] = []

class SocialLinksCreate(SocialLinksBase):
    pass

class SocialLinksUpdate(SocialLinksBase):
    pass

class SocialLinksResponse(SocialLinksBase):
    id: int
    
    class Config:
        from_attributes = True

