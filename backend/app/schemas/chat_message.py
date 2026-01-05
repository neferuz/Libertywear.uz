from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ChatMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ChatMessageUpdate(BaseModel):
    admin_reply: Optional[str] = None
    is_read: Optional[bool] = None

class ChatMessage(BaseModel):
    id: int
    name: str
    email: str
    message: str
    admin_reply: Optional[str]
    is_read: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

