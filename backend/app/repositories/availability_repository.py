from datetime import datetime
from typing import List, Dict, Any
from pymongo.database import Database
from app.repositories.base import BaseRepository


class AvailabilityRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "availabilities")

    def find_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"user_id": user_id})

    def find_in_range(self, start_time: datetime, end_time: datetime, user_ids: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {
            "start_time": {"$lte": end_time},
            "end_time": {"$gte": start_time}
        }
        if user_ids:
            query["user_id"] = {"$in": user_ids}
        return self.find_all(query)
