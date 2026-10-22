from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.base import BaseRepository


class CandidateRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "candidates")

    def find_by_status(self, status: str) -> List[Dict[str, Any]]:
        return self.find_all({"status": status})

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"email": email.lower()})
        return self._normalize_doc(doc)
