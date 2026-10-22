from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.base import BaseRepository


class EvaluationRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "evaluations")

    def find_by_interview(self, interview_id: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"interview_id": interview_id})
        return self._normalize_doc(doc)

    def find_by_candidate(self, candidate_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"candidate_id": candidate_id})

    def find_by_interviewer(self, interviewer_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"interviewer_id": interviewer_id})
