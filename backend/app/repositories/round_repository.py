from typing import List, Dict, Any
from pymongo.database import Database
from app.repositories.base import BaseRepository


class RoundRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "interview_rounds")

    def find_all_ordered(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({}).sort("order_index", 1)
        return [self._normalize_doc(doc) for doc in cursor]
