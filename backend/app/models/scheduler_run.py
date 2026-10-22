from datetime import datetime
from typing import Dict, List, Optional
from pydantic import Field
from app.models.common import BaseAuditModel
from app.models.enums import SolverStatus


class SchedulerRun(BaseAuditModel):
    schedule_version_id: Optional[str] = None
    status: SolverStatus = SolverStatus.UNKNOWN
    solver_duration_seconds: float = 0.0
    objective_value: float = 0.0
    constraints_violated_count: int = 0
    candidate_count: int = 0
    interviewer_count: int = 0
    room_count: int = 0
    diagnostics: Dict[str, str] = Field(default_factory=dict)
    unassigned_interviews: List[str] = Field(default_factory=list)
