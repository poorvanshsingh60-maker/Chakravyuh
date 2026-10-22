from typing import List, Optional
from pydantic import Field
from app.models.common import BaseAuditModel


class Room(BaseAuditModel):
    name: str
    capacity: int = 4
    building: Optional[str] = "Main Campus"
    floor: Optional[str] = "2nd Floor"
    has_video_conferencing: bool = True
    is_active: bool = True
    features: List[str] = Field(default_factory=list)
