from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.chat_message import ChatMessage
from app.schemas.chat_message import ChatMessageCreate, ChatMessageUpdate, ChatMessage as ChatMessageSchema

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatMessageSchema, status_code=status.HTTP_201_CREATED)
def create_chat_message(message: ChatMessageCreate, db: Session = Depends(get_db)):
    """Создать новое сообщение в чате"""
    new_message = ChatMessage(**message.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/", response_model=List[ChatMessageSchema])
def get_chat_messages(
    skip: int = 0,
    limit: int = 100,
    is_read: bool = None,
    db: Session = Depends(get_db)
):
    """Получить все сообщения чата (для админа)"""
    query = db.query(ChatMessage)
    
    if is_read is not None:
        query = query.filter(ChatMessage.is_read == is_read)
    
    messages = query.order_by(ChatMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.get("/{message_id}", response_model=ChatMessageSchema)
def get_chat_message(message_id: int, db: Session = Depends(get_db)):
    """Получить сообщение по ID"""
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    return message

@router.patch("/{message_id}", response_model=ChatMessageSchema)
def update_chat_message(
    message_id: int, 
    update_data: ChatMessageUpdate,
    db: Session = Depends(get_db)
):
    """Обновить сообщение (ответ админа, отметка прочитанным)"""
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    
    if update_data.admin_reply is not None:
        message.admin_reply = update_data.admin_reply
    if update_data.is_read is not None:
        message.is_read = update_data.is_read
    
    db.commit()
    db.refresh(message)
    return message

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_message(message_id: int, db: Session = Depends(get_db)):
    """Удалить сообщение"""
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    db.delete(message)
    db.commit()
    return None

@router.get("/stats/count", response_model=dict)
def get_chat_stats(db: Session = Depends(get_db)):
    """Получить статистику сообщений чата"""
    total = db.query(ChatMessage).count()
    unread = db.query(ChatMessage).filter(ChatMessage.is_read == False).count()
    read = db.query(ChatMessage).filter(ChatMessage.is_read == True).count()
    
    return {
        "total": total,
        "unread": unread,
        "read": read
    }

