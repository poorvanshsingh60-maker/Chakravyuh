from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.user import UserBase, UserRead
from app.models.enums import CandidateStatus


class CandidateBase(UserBase):
    status: CandidateStatus = CandidateStatus.APPLIED
    skills: List[str] = []
    resume_url: Optional[str] = None
    target_role: Optional[str] = None
    timezone: str = "UTC"


class CandidateCreate(CandidateBase):
    password: Optional[str] = "Chakravyuh@2026"


class CandidateUpdate(BaseModel):
    status: Optional[CandidateStatus] = None
    skills: Optional[List[str]] = None
    resume_url: Optional[str] = None
    target_role: Optional[str] = None
    timezone: Optional[str] = None
    completed_round_ids: Optional[List[str]] = None


class CandidateRead(CandidateBase, UserRead):
    completed_round_ids: List[str] = []
