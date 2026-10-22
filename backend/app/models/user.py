from typing import Optional
from pydantic import EmailStr, Field
from app.models.common import BaseAuditModel
from app.models.enums import UserRole


class User(BaseAuditModel):
    email: EmailStr
    hashed_password: str
    full_name: str
    role: UserRole = UserRole.CANDIDATE
    phone: Optional[str] = None
    is_active: bool = True
    avatar_url: Optional[str] = None
