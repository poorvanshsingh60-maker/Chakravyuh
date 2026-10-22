from typing import Dict, Optional
from pydantic import Field
from app.models.common import BaseAuditModel


class Evaluation(BaseAuditModel):
    interview_id: str
    interviewer_id: str
    candidate_id: str
    rating: int = Field(ge=1, le=5)
    recommendation: str  # STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE
    summary: str
    rubric_scores: Dict[str, int] = Field(default_factory=dict)
    strengths: Optional[str] = None
    areas_for_growth: Optional[str] = None
    submitted_at: Optional[str] = None
