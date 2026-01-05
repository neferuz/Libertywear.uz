from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PartnerBase(BaseModel):
    name: str
    logo_url: str
    website_url: Optional[str] = None
    order: int = 0
    is_active: bool = True

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class PartnerResponse(PartnerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

