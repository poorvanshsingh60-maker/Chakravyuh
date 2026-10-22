from datetime import datetime
from typing import List, Optional
from pydantic import Field
from app.models.common import BaseAuditModel
from app.models.enums import InterviewStatus


class Interview(BaseAuditModel):
    schedule_version_id: Optional[str] = None
    candidate_id: str
    round_id: str
    interviewer_ids: List[str] = Field(default_factory=list)
    room_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: InterviewStatus = InterviewStatus.SCHEDULED
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
