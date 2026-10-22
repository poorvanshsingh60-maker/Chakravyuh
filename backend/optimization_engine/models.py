from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TimeSlot(BaseModel):
    start_time: int # Using integer minutes/hours for solver simplicity
    end_time: int
    is_preferred: bool = False

class Candidate(BaseModel):
    candidate_id: str
    available_slots: List[TimeSlot]

class Interviewer(BaseModel):
    interviewer_id: str
    skills: List[str]
    available_slots: List[TimeSlot]
    max_interviews_per_day: int

class Room(BaseModel):
    room_id: str
    capacity: int
    available_slots: List[TimeSlot]

class InterviewReq(BaseModel):
    interview_id: str
    candidate_id: str
    required_skills: List[str]
    duration_minutes: int
    prerequisite_interview_id: Optional[str] = None