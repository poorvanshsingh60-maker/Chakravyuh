from typing import List, Optional
from pydantic import Field
from app.models.common import BaseAuditModel


class InterviewRound(BaseAuditModel):
    name: str
    order_index: int
    duration_minutes: int = 45
    description: Optional[str] = None
    required_skills: List[str] = Field(default_factory=list)
    prerequisite_round_ids: List[str] = Field(default_factory=list)
    is_technical: bool = True
