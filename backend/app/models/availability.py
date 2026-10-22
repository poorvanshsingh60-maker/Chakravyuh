from datetime import datetime, time
from typing import Optional
from pydantic import Field
from app.models.common import BaseAuditModel
from app.models.enums import AvailabilityType


class Availability(BaseAuditModel):
    user_id: str
    availability_type: AvailabilityType = AvailabilityType.SPECIFIC_DATE
    start_time: datetime
    end_time: datetime
    is_busy_override: bool = False
    recurring_day_of_week: Optional[int] = None  # 0=Monday, 6=Sunday
    notes: Optional[str] = None
