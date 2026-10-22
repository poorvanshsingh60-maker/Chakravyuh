from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class RoomBase(BaseModel):
    name: str
    capacity: int = 4
    building: Optional[str] = "Main Campus"
    floor: Optional[str] = "2nd Floor"
    has_video_conferencing: bool = True
    is_active: bool = True
    features: List[str] = []


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    building: Optional[str] = None
    floor: Optional[str] = None
    has_video_conferencing: Optional[bool] = None
    is_active: Optional[bool] = None
    features: Optional[List[str]] = None


class RoomRead(RoomBase):
    id: str
    created_at: datetime
    updated_at: datetime
