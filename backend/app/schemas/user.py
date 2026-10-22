from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.CANDIDATE
    phone: Optional[str] = None
    is_active: bool = True
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    avatar_url: Optional[str] = None
    role: Optional[UserRole] = None


class UserRead(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
