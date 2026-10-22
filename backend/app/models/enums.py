from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    COORDINATOR = "COORDINATOR"
    INTERVIEWER = "INTERVIEWER"
    CANDIDATE = "CANDIDATE"


class CandidateStatus(str, Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    SCHEDULED = "SCHEDULED"
    INTERVIEWING = "INTERVIEWING"
    OFFERED = "OFFERED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class InterviewerStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ON_LEAVE = "ON_LEAVE"
    INACTIVE = "INACTIVE"


class AvailabilityType(str, Enum):
    RECURRING = "RECURRING"
    SPECIFIC_DATE = "SPECIFIC_DATE"
    BUSY = "BUSY"


class InterviewStatus(str, Enum):
    PENDING = "PENDING"
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    RESCHEDULED = "RESCHEDULED"


class ScheduleStatus(str, Enum):
    DRAFT = "DRAFT"
    OPTIMIZED = "OPTIMIZED"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class SolverStatus(str, Enum):
    OPTIMAL = "OPTIMAL"
    FEASIBLE = "FEASIBLE"
    INFEASIBLE = "INFEASIBLE"
    MODEL_INVALID = "MODEL_INVALID"
    UNKNOWN = "UNKNOWN"
