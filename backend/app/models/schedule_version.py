from typing import List, Optional
from pydantic import Field
from app.models.common import BaseAuditModel
from app.models.enums import ScheduleStatus


class ScheduleVersion(BaseAuditModel):
    version_number: int
    name: str
    status: ScheduleStatus = ScheduleStatus.DRAFT
    total_interviews: int = 0
    assigned_interviews: int = 0
    interview_ids: List[str] = Field(default_factory=list)
    published_at: Optional[str] = None
    created_by: Optional[str] = None
    notes: Optional[str] = None
