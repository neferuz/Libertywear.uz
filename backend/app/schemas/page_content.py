from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# About Schemas
class AboutSectionBase(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    reverse: bool = False
    order: int = 0

class AboutSectionCreate(AboutSectionBase):
    pass

class AboutSectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    reverse: Optional[bool] = None
    order: Optional[int] = None

class AboutSection(AboutSectionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Team Member Schemas
class TeamMemberBase(BaseModel):
    name: str
    role: str
    image: Optional[str] = None
    order: int = 0

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None

class TeamMember(TeamMemberBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Contact Info Schemas
class ContactInfoBase(BaseModel):
    icon_type: str  # 'map', 'phone', 'email', 'clock'
    title: str
    content: str
    details: Optional[str] = None
    order: int = 0

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(BaseModel):
    icon_type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    details: Optional[str] = None
    order: Optional[int] = None

class ContactInfo(ContactInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# FAQ Schemas
class FAQItemBase(BaseModel):
    question: str
    answer: str
    order: int = 0

class FAQItemCreate(FAQItemBase):
    pass

class FAQItemUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None

class FAQItem(FAQItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

