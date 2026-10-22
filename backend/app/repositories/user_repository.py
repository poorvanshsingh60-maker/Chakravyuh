from typing import Optional, Dict, Any
from pymongo.database import Database
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "users")

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"email": email.lower()})
        return self._normalize_doc(doc)


class CandidateRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "candidates")

    def find_by_status(self, status: str):
        return self.find_all({"status": status})


class InterviewerRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "interviewers")

    def find_active(self):
        return self.find_all({"status": "ACTIVE"})

    def find_by_skill(self, skill_name: str):
        return self.find_all({"skills": skill_name, "status": "ACTIVE"})
