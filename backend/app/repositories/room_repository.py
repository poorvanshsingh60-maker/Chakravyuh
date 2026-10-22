from typing import List, Dict, Any
from pymongo.database import Database
from app.repositories.base import BaseRepository


class RoomRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db, "rooms")

    def find_active(self) -> List[Dict[str, Any]]:
        return self.find_all({"is_active": True})
