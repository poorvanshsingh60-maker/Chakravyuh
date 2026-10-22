from datetime import datetime, date
from typing import Dict, List, Optional
from pydantic import BaseModel
from app.models.enums import ScheduleStatus, SolverStatus
from app.schemas.interview import InterviewRead


class ScheduleSolveRequest(BaseModel):
    start_date: date
    end_date: date
    candidate_ids: Optional[List[str]] = None
    interviewer_ids: Optional[List[str]] = None
    round_ids: Optional[List[str]] = None
    timeout_seconds: Optional[int] = 30
    minimize_idle_time: bool = True
    balance_workload: bool = True


class ScheduleVersionRead(BaseModel):
    id: str
    version_number: int
    name: str
    status: ScheduleStatus
    total_interviews: int
    assigned_interviews: int
    created_at: datetime
    published_at: Optional[str] = None
    notes: Optional[str] = None
    interviews: Optional[List[InterviewRead]] = None


class ScheduleVersionCreate(BaseModel):
    name: str
    notes: Optional[str] = None


class SchedulerRunResponse(BaseModel):
    schedule_version_id: str
    status: SolverStatus
    solver_duration_seconds: float
    objective_value: float
    total_assigned: int
    total_requested: int
    diagnostics: Dict[str, str] = {}
    unassigned_interviews: List[str] = []
