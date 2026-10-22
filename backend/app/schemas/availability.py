from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.enums import AvailabilityType


class AvailabilityBase(BaseModel):
    user_id: str
    availability_type: AvailabilityType = AvailabilityType.SPECIFIC_DATE
    start_time: datetime
    end_time: datetime
    is_busy_override: bool = False
    recurring_day_of_week: Optional[int] = None
    notes: Optional[str] = None


class AvailabilityCreate(AvailabilityBase):
    pass


class AvailabilityUpdate(BaseModel):
    availability_type: Optional[AvailabilityType] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    is_busy_override: Optional[bool] = None
    recurring_day_of_week: Optional[int] = None
    notes: Optional[str] = None


class AvailabilityRead(AvailabilityBase):
    id: str
    created_at: datetime
    updated_at: datetime
