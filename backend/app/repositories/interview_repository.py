from datetime import datetime
from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.base import BaseRepository


class InterviewRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "interviews")

    def find_by_candidate(self, candidate_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"candidate_id": candidate_id})

    def find_by_interviewer(self, interviewer_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"interviewer_ids": interviewer_id})

    def find_by_schedule_version(self, version_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"schedule_version_id": version_id})

    def find_in_range(self, start: datetime, end: datetime) -> List[Dict[str, Any]]:
        return self.find_all({
            "start_time": {"$lte": end},
            "end_time": {"$gte": start}
        })
