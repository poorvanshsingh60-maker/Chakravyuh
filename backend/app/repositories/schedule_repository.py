from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.base import BaseRepository


class ScheduleRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "schedule_versions")

    def get_latest_version(self) -> Optional[Dict[str, Any]]:
        cursor = self.collection.find({}).sort("version_number", -1).limit(1)
        docs = list(cursor)
        return self._normalize_doc(docs[0]) if docs else None

    def get_published(self) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"status": "PUBLISHED"})
        return self._normalize_doc(doc)
