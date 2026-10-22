from typing import Optional
from app.models.common import BaseAuditModel


class Skill(BaseAuditModel):
    name: str
    category: str = "Technical"  # Technical, Behavioral, Domain
    description: Optional[str] = None
