from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.models.enums import InterviewStatus


class InterviewBase(BaseModel):
    schedule_version_id: Optional[str] = None
    candidate_id: str
    round_id: str
    interviewer_ids: List[str] = []
    room_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: InterviewStatus = InterviewStatus.SCHEDULED
    meeting_link: Optional[str] = None
    notes: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    schedule_version_id: Optional[str] = None
    interviewer_ids: Optional[List[str]] = None
    room_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[InterviewStatus] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None


class InterviewRead(InterviewBase):
    id: str
    created_at: datetime
    updated_at: datetime
    candidate_name: Optional[str] = None
    round_name: Optional[str] = None
    room_name: Optional[str] = None
    interviewer_names: List[str] = []
