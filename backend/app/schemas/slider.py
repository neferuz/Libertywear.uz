from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SliderSlideBase(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None
    image_url_desktop: str
    image_url_mobile: Optional[str] = None
    alt_text: Optional[str] = None
    order: int = 0
    is_active: bool = True


class SliderSlideCreate(SliderSlideBase):
    pass


class SliderSlideUpdate(SliderSlideBase):
    title: Optional[str] = None
    link: Optional[str] = None
    image_url_desktop: Optional[str] = None
    image_url_mobile: Optional[str] = None
    alt_text: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class SliderSlideResponse(SliderSlideBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

