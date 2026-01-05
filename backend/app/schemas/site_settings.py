from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SiteSettingsBase(BaseModel):
    key: str
    value: Optional[str] = None
    description: Optional[str] = None

class SiteSettingsCreate(SiteSettingsBase):
    pass

class SiteSettingsUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = None

class SiteSettingsResponse(SiteSettingsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

