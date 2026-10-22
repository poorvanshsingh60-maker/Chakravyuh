from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class RoundBase(BaseModel):
    name: str
    order_index: int
    duration_minutes: int = 45
    description: Optional[str] = None
    required_skills: List[str] = []
    prerequisite_round_ids: List[str] = []
    is_technical: bool = True


class RoundCreate(RoundBase):
    pass


class RoundUpdate(BaseModel):
    name: Optional[str] = None
    order_index: Optional[int] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    prerequisite_round_ids: Optional[List[str]] = None
    is_technical: Optional[bool] = None


class RoundRead(RoundBase):
    id: str
    created_at: datetime
    updated_at: datetime
