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
    new_section = AboutSection(**section.dict())
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    return new_section

@router.put("/about/sections/{section_id}", response_model=AboutSectionSchema)
def update_about_section(section_id: int, section_update: AboutSectionUpdate, db: Session = Depends(get_db)):
    """Обновить секцию"""
    section = db.query(AboutSection).filter(AboutSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Секция не найдена")
    
    update_data = section_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(section, field, value)
    
    db.commit()
    db.refresh(section)
    return section

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
    new_member = TeamMember(**member.dict())
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
    
    update_data = member_update.dict(exclude_unset=True)
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
    new_contact = ContactInfo(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.put("/contacts/{contact_id}", response_model=ContactInfoSchema)
def update_contact_info(contact_id: int, contact_update: ContactInfoUpdate, db: Session = Depends(get_db)):
    """Обновить контактную информацию"""
    contact = db.query(ContactInfo).filter(ContactInfo.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Контакт не найден")
    
    update_data = contact_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)
    
    db.commit()
    db.refresh(contact)
    return contact

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
    items = db.query(FAQItem).order_by(FAQItem.order).all()
    return items

@router.post("/faq", response_model=FAQItemSchema, status_code=status.HTTP_201_CREATED)
def create_faq_item(item: FAQItemCreate, db: Session = Depends(get_db)):
    """Создать новый FAQ элемент"""
    new_item = FAQItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/faq/{item_id}", response_model=FAQItemSchema)
def update_faq_item(item_id: int, item_update: FAQItemUpdate, db: Session = Depends(get_db)):
    """Обновить FAQ элемент"""
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ элемент не найден")
    
    update_data = item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/faq/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq_item(item_id: int, db: Session = Depends(get_db)):
    """Удалить FAQ элемент"""
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ элемент не найден")
    db.delete(item)
    db.commit()
    return None

