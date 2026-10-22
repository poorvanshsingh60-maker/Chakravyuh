from dataclasses import dataclass, field
from datetime import datetime, date
from typing import Dict, List, Optional, Set, Tuple


@dataclass
class CandidateSlot:
    candidate_id: str
    round_id: str
    duration_minutes: int
    required_skills: List[str]
    prerequisites: List[str] = field(default_factory=list)


@dataclass
class TimeSlotUnit:
    slot_id: int
    start_time: datetime
    end_time: datetime
    date_str: str


@dataclass
class SchedulingContext:
    candidates: List[Dict] = field(default_factory=list)
    interviewers: List[Dict] = field(default_factory=list)
    rooms: List[Dict] = field(default_factory=list)
    rounds: List[Dict] = field(default_factory=list)
    availabilities: List[Dict] = field(default_factory=list)
    
    # Pre-calculated discreet time slots (e.g. 45 or 60 min intervals across target date range)
    time_slots: List[TimeSlotUnit] = field(default_factory=list)
    
    # Lookup indices
    interviewer_skills: Dict[str, Set[str]] = field(default_factory=dict)
    interviewer_availability_slots: Dict[str, Set[int]] = field(default_factory=dict)
    candidate_availability_slots: Dict[str, Set[int]] = field(default_factory=dict)
    room_capacity: Dict[str, int] = field(default_factory=dict)

    # Configuration
    timeout_seconds: int = 30
    minimize_idle_time: bool = True
    balance_workload: bool = True
