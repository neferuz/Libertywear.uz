from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessage as ContactMessageSchema

router = APIRouter(prefix="/contact-messages", tags=["contact-messages"])

@router.post("/", response_model=ContactMessageSchema, status_code=status.HTTP_201_CREATED)
def create_contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    """Создать новое сообщение обратной связи"""
    new_message = ContactMessage(**message.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/", response_model=List[ContactMessageSchema])
def get_contact_messages(
    skip: int = 0,
    limit: int = 100,
    is_read: bool = None,
    db: Session = Depends(get_db)
):
    """Получить все сообщения обратной связи"""
    query = db.query(ContactMessage)
    
    if is_read is not None:
        query = query.filter(ContactMessage.is_read == is_read)
    
    messages = query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.get("/{message_id}", response_model=ContactMessageSchema)
def get_contact_message(message_id: int, db: Session = Depends(get_db)):
    """Получить сообщение по ID"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    return message

@router.patch("/{message_id}/read", response_model=ContactMessageSchema)
def mark_as_read(message_id: int, db: Session = Depends(get_db)):
    """Отметить сообщение как прочитанное"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(message_id: int, db: Session = Depends(get_db)):
    """Удалить сообщение"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    db.delete(message)
    db.commit()
    return None

@router.get("/stats/count", response_model=dict)
def get_message_stats(db: Session = Depends(get_db)):
    """Получить статистику сообщений"""
    total = db.query(ContactMessage).count()
    unread = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
    read = db.query(ContactMessage).filter(ContactMessage.is_read == True).count()
    
    return {
        "total": total,
        "unread": unread,
        "read": read
    }

