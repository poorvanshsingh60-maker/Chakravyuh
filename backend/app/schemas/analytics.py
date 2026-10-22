from typing import List, Optional
from pydantic import BaseModel


class WorkloadMetric(BaseModel):
    interviewer_id: str
    interviewer_name: str
    department: str
    interview_count: int
    total_hours: float
    max_weekly_capacity: int


class RoomUtilizationMetric(BaseModel):
    room_id: str
    room_name: str
    hours_booked: float
    utilization_percentage: float


class DashboardStats(BaseModel):
    total_candidates: int
    active_interviewers: int
    scheduled_interviews: int
    completed_interviews: int
    active_rooms: int
    solver_success_rate: float
    workload_distribution: List[WorkloadMetric] = []
    room_utilization: List[RoomUtilizationMetric] = []
