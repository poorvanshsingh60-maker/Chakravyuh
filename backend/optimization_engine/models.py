from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class TimeSlot(BaseModel):
    start_time: int  # In minutes from start of scheduling day (e.g., 9:00 AM = 0)
    end_time: int
    is_preferred: bool = False

class Candidate(BaseModel):
    candidate_id: str
    available_slots: List[TimeSlot]

class Interviewer(BaseModel):
    interviewer_id: str
    skills: List[str]
    available_slots: List[TimeSlot]
    max_interviews_per_day: int = 5

class Room(BaseModel):
    room_id: str
    capacity: int
    available_slots: List[TimeSlot]

class PreviousAssignment(BaseModel):
    """Used during Rescheduling to minimize unnecessary changes."""
    interview_id: str
    interviewer_id: str
    room_id: str
    start_time: int

class InterviewReq(BaseModel):
    interview_id: str
    candidate_id: str
    round_order: int = 1
    required_skills: List[str]
    duration_minutes: int
    required_capacity: int = 2  # Candidate + Interviewer(s)
    prerequisite_interview_id: Optional[str] = None

class ScheduledInterview(BaseModel):
    interview_id: str
    candidate_id: str
    interviewer_id: str
    room_id: str
    start_time: int
    end_time: int

class SolverResult(BaseModel):
    status: str
    objective_score: float
    runtime_seconds: float
    schedule: List[ScheduledInterview]
    unscheduled_interviews: List[str]
    diagnostics: List[str]
    is_validated: bool = False