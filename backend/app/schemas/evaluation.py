from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, Field


class EvaluationBase(BaseModel):
    interview_id: str
    interviewer_id: str
    candidate_id: str
    rating: int = Field(ge=1, le=5)
    recommendation: str  # STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE
    summary: str
    rubric_scores: Dict[str, int] = {}
    strengths: Optional[str] = None
    areas_for_growth: Optional[str] = None


class EvaluationCreate(EvaluationBase):
    pass


class EvaluationUpdate(BaseModel):
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    recommendation: Optional[str] = None
    summary: Optional[str] = None
    rubric_scores: Optional[Dict[str, int]] = None
    strengths: Optional[str] = None
    areas_for_growth: Optional[str] = None


class EvaluationRead(EvaluationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[str] = None
    interviewer_name: Optional[str] = None
    candidate_name: Optional[str] = None
