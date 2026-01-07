from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime

# About Schemas
class AboutSectionBase(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    reverse: bool = False
    order: int = 0
    title_translations: Optional[Dict[str, str]] = None
    description_translations: Optional[Dict[str, str]] = None

class AboutSectionCreate(AboutSectionBase):
    pass

class AboutSectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    reverse: Optional[bool] = None
    order: Optional[int] = None
    title_translations: Optional[Dict[str, str]] = None
    description_translations: Optional[Dict[str, str]] = None

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
    title_translations: Optional[Dict[str, str]] = None
    content_translations: Optional[Dict[str, str]] = None

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(BaseModel):
    icon_type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    details: Optional[str] = None
    order: Optional[int] = None
    title_translations: Optional[Dict[str, str]] = None
    content_translations: Optional[Dict[str, str]] = None

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
    category: Optional[str] = 'All'  # Категория: All, Orders, Shipping, Returns, Products, Account
    order: int = 0
    question_translations: Optional[Dict[str, str]] = None
    answer_translations: Optional[Dict[str, str]] = None

class FAQItemCreate(FAQItemBase):
    pass

class FAQItemUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    question_translations: Optional[Dict[str, str]] = None
    answer_translations: Optional[Dict[str, str]] = None

class FAQItem(FAQItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

