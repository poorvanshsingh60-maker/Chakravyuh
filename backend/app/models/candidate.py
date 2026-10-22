from typing import List, Optional
from pydantic import Field
from app.models.user import User
from app.models.enums import CandidateStatus


class Candidate(User):
    status: CandidateStatus = CandidateStatus.APPLIED
    skills: List[str] = Field(default_factory=list)
    resume_url: Optional[str] = None
    target_role: Optional[str] = None
    timezone: str = "UTC"
    completed_round_ids: List[str] = Field(default_factory=list)
