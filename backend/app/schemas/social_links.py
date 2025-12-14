from pydantic import BaseModel
from typing import Optional, List

class SocialLinkItem(BaseModel):
    name: str
    url: str

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

