from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.base import BaseRepository


class InterviewerRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "interviewers")

    def find_active(self) -> List[Dict[str, Any]]:
        return self.find_all({"status": "ACTIVE"})

    def find_by_skill(self, skill_name: str) -> List[Dict[str, Any]]:
        return self.find_all({"skills": skill_name, "status": "ACTIVE"})

    def increment_scheduled_count(self, interviewer_id: str, delta: int = 1):
        self.collection.update_one(
            {"_id": self._to_object_id(interviewer_id)},
            {"$inc": {"current_scheduled_count": delta}}
        )
