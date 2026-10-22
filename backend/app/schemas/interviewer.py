from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.user import UserBase, UserRead
from app.models.enums import InterviewerStatus


class InterviewerBase(UserBase):
    status: InterviewerStatus = InterviewerStatus.ACTIVE
    department: str = "Engineering"
    seniority_level: str = "Senior"
    skills: List[str] = []
    max_interviews_per_day: int = 4
    max_interviews_per_week: int = 15
    timezone: str = "UTC"


class InterviewerCreate(InterviewerBase):
    password: Optional[str] = "Chakravyuh@2026"


class InterviewerUpdate(BaseModel):
    status: Optional[InterviewerStatus] = None
    department: Optional[str] = None
    seniority_level: Optional[str] = None
    skills: Optional[List[str]] = None
    max_interviews_per_day: Optional[int] = None
    max_interviews_per_week: Optional[int] = None


class InterviewerRead(InterviewerBase, UserRead):
    current_scheduled_count: int = 0
