from typing import Optional, Dict, Any
from pymongo.database import Database
from app.repositories.base import BaseRepository


class SkillRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "skills")

    def find_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
        return self._normalize_doc(doc)
