from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.page_content import AboutSection, TeamMember, ContactInfo, FAQItem
from app.schemas.page_content import (
    AboutSection as AboutSectionSchema,
    AboutSectionCreate,
    AboutSectionUpdate,
    TeamMember as TeamMemberSchema,
    TeamMemberCreate,
    TeamMemberUpdate,
    ContactInfo as ContactInfoSchema,
    ContactInfoCreate,
    ContactInfoUpdate,
    FAQItem as FAQItemSchema,
    FAQItemCreate,
    FAQItemUpdate,
)

router = APIRouter(prefix="/pages", tags=["pages"])

# ============ ABOUT SECTIONS ============
@router.get("/about/sections", response_model=List[AboutSectionSchema])
def get_about_sections(db: Session = Depends(get_db)):
    """Получить все секции страницы О компании"""
    sections = db.query(AboutSection).order_by(AboutSection.order).all()
    return sections

@router.post("/about/sections", response_model=AboutSectionSchema, status_code=status.HTTP_201_CREATED)
def create_about_section(section: AboutSectionCreate, db: Session = Depends(get_db)):
    """Создать новую секцию"""
    new_section = AboutSection(**section.model_dump())
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    return new_section

@router.put("/about/sections/{section_id}", response_model=AboutSectionSchema)
def update_about_section(section_id: int, section_update: AboutSectionUpdate, db: Session = Depends(get_db)):
    """Обновить секцию"""
    import logging
    logger = logging.getLogger(__name__)
    
    section = db.query(AboutSection).filter(AboutSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Секция не найдена")
    
    update_data = section_update.model_dump(exclude_unset=True)
    logger.info(f"Updating section {section_id} with data: {update_data}")
    logger.info(f"Title translations: {update_data.get('title_translations')}")
    logger.info(f"Description translations: {update_data.get('description_translations')}")
    
    for field, value in update_data.items():
        logger.info(f"Setting {field} = {value}")
        setattr(section, field, value)
    
    try:
        db.commit()
        db.refresh(section)
        logger.info(f"Section {section_id} updated successfully")
        logger.info(f"Final title_translations: {section.title_translations}")
        logger.info(f"Final description_translations: {section.description_translations}")
        
        # Явно сериализуем через схему чтобы гарантировать включение переводов
        result = AboutSectionSchema.model_validate(section)
        logger.info(f"Serialized title_translations: {result.title_translations}")
        logger.info(f"Serialized description_translations: {result.description_translations}")
        return result
    except Exception as e:
        logger.error(f"Error updating section: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении секции: {str(e)}")
    except Exception as e:
        logger.error(f"Error updating section: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении секции: {str(e)}")

@router.delete("/about/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_about_section(section_id: int, db: Session = Depends(get_db)):
    """Удалить секцию"""
    section = db.query(AboutSection).filter(AboutSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Секция не найдена")
    db.delete(section)
    db.commit()
    return None

# ============ TEAM MEMBERS ============
@router.get("/about/team", response_model=List[TeamMemberSchema])
def get_team_members(db: Session = Depends(get_db)):
    """Получить всех членов команды"""
    members = db.query(TeamMember).order_by(TeamMember.order).all()
    return members

@router.post("/about/team", response_model=TeamMemberSchema, status_code=status.HTTP_201_CREATED)
def create_team_member(member: TeamMemberCreate, db: Session = Depends(get_db)):
    """Создать нового члена команды"""
    new_member = TeamMember(**member.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.put("/about/team/{member_id}", response_model=TeamMemberSchema)
def update_team_member(member_id: int, member_update: TeamMemberUpdate, db: Session = Depends(get_db)):
    """Обновить члена команды"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Член команды не найден")
    
    update_data = member_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)
    
    db.commit()
    db.refresh(member)
    return member

@router.delete("/about/team/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    """Удалить члена команды"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Член команды не найден")
    db.delete(member)
    db.commit()
    return None

# ============ CONTACT INFO ============
@router.get("/contacts", response_model=List[ContactInfoSchema])
def get_contact_info(db: Session = Depends(get_db)):
    """Получить контактную информацию"""
    contacts = db.query(ContactInfo).order_by(ContactInfo.order).all()
    return contacts

@router.post("/contacts", response_model=ContactInfoSchema, status_code=status.HTTP_201_CREATED)
def create_contact_info(contact: ContactInfoCreate, db: Session = Depends(get_db)):
    """Создать новую контактную информацию"""
    new_contact = ContactInfo(**contact.model_dump())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.put("/contacts/{contact_id}", response_model=ContactInfoSchema)
def update_contact_info(contact_id: int, contact_update: ContactInfoUpdate, db: Session = Depends(get_db)):
    """Обновить контактную информацию"""
    import logging
    logger = logging.getLogger(__name__)
    
    contact = db.query(ContactInfo).filter(ContactInfo.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Контакт не найден")
    
    # Получаем все данные, включая None значения для переводов
    update_data = contact_update.model_dump(exclude_unset=True)
    logger.info(f"Updating contact {contact_id} with data: {update_data}")
    logger.info(f"Title translations received: {update_data.get('title_translations')}")
    logger.info(f"Content translations received: {update_data.get('content_translations')}")
    
    # Явно обновляем переводы, даже если они None (чтобы очистить старые значения)
    if 'title_translations' in update_data:
        contact.title_translations = update_data['title_translations']
        logger.info(f"Set title_translations to: {contact.title_translations}")
    
    if 'content_translations' in update_data:
        contact.content_translations = update_data['content_translations']
        logger.info(f"Set content_translations to: {contact.content_translations}")
    
    # Обновляем остальные поля
    for field, value in update_data.items():
        if field not in ['title_translations', 'content_translations']:
            logger.info(f"Setting {field} = {value}")
            setattr(contact, field, value)
    
    try:
        db.commit()
        db.refresh(contact)
        logger.info(f"Contact {contact_id} updated successfully")
        logger.info(f"Final title_translations in DB: {contact.title_translations}")
        logger.info(f"Final content_translations in DB: {contact.content_translations}")
        
        # Явно сериализуем через схему чтобы гарантировать включение переводов
        result = ContactInfoSchema.model_validate(contact)
        logger.info(f"Serialized title_translations: {result.title_translations}")
        logger.info(f"Serialized content_translations: {result.content_translations}")
        return result
    except Exception as e:
        logger.error(f"Error updating contact: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении контакта: {str(e)}")

@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_info(contact_id: int, db: Session = Depends(get_db)):
    """Удалить контактную информацию"""
    contact = db.query(ContactInfo).filter(ContactInfo.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Контакт не найден")
    db.delete(contact)
    db.commit()
    return None

# ============ FAQ ============
@router.get("/faq", response_model=List[FAQItemSchema])
def get_faq_items(db: Session = Depends(get_db)):
    """Получить все FAQ элементы"""
    from app.schemas.page_content import FAQItem as FAQItemSchema
    
    items = db.query(FAQItem).order_by(FAQItem.order).all()
    
    # Явно сериализуем через схему
    return [FAQItemSchema.model_validate(item) for item in items]

@router.post("/faq", response_model=FAQItemSchema, status_code=status.HTTP_201_CREATED)
def create_faq_item(item: FAQItemCreate, db: Session = Depends(get_db)):
    """Создать новый FAQ элемент"""
    from app.schemas.page_content import FAQItem as FAQItemSchema
    
    new_item = FAQItem(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # Явно сериализуем через схему
    return FAQItemSchema.model_validate(new_item)

@router.put("/faq/{item_id}", response_model=FAQItemSchema)
def update_faq_item(item_id: int, item_update: FAQItemUpdate, db: Session = Depends(get_db)):
    """Обновить FAQ"""
    import logging
    from app.schemas.page_content import FAQItem as FAQItemSchema
    
    logger = logging.getLogger(__name__)
    
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ не найден")
    
    # Получаем все данные, включая None значения для переводов
    update_data = item_update.model_dump(exclude_unset=True)
    logger.info(f"Updating FAQ {item_id} with data: {update_data}")
    logger.info(f"Question translations received: {update_data.get('question_translations')}")
    logger.info(f"Answer translations received: {update_data.get('answer_translations')}")
    
    # Явно обновляем переводы, даже если они None (чтобы очистить старые значения)
    if 'question_translations' in update_data:
        item.question_translations = update_data['question_translations']
        logger.info(f"Set question_translations to: {item.question_translations}")
    
    if 'answer_translations' in update_data:
        item.answer_translations = update_data['answer_translations']
        logger.info(f"Set answer_translations to: {item.answer_translations}")
    
    # Обновляем остальные поля
    for field, value in update_data.items():
        if field not in ['question_translations', 'answer_translations']:
            logger.info(f"Setting {field} = {value}")
            setattr(item, field, value)
    
    try:
        db.commit()
        db.refresh(item)
        logger.info(f"FAQ {item_id} updated successfully")
        logger.info(f"Final question_translations in DB: {item.question_translations}")
        logger.info(f"Final answer_translations in DB: {item.answer_translations}")
        
        # Явно сериализуем через схему
        result = FAQItemSchema.model_validate(item)
        logger.info(f"Serialized question_translations: {result.question_translations}")
        logger.info(f"Serialized answer_translations: {result.answer_translations}")
        return result
    except Exception as e:
        logger.error(f"Error updating FAQ: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении FAQ: {str(e)}")

@router.delete("/faq/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq_item(item_id: int, db: Session = Depends(get_db)):
    """Удалить FAQ элемент"""
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ элемент не найден")
    db.delete(item)
    db.commit()
    return None

