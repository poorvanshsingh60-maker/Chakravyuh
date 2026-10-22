from typing import List, Optional
from pydantic import Field
from app.models.user import User
from app.models.enums import InterviewerStatus


class Interviewer(User):
    status: InterviewerStatus = InterviewerStatus.ACTIVE
    department: str = "Engineering"
    seniority_level: str = "Senior"
    skills: List[str] = Field(default_factory=list)
    max_interviews_per_day: int = 4
    max_interviews_per_week: int = 15
    current_scheduled_count: int = 0
    timezone: str = "UTC"
