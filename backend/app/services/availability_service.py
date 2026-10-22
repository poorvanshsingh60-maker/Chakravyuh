from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.availability_repository import AvailabilityRepository
from app.schemas.availability import AvailabilityCreate, AvailabilityUpdate


class AvailabilityService:
    def __init__(self, db: Database):
        self.repo = AvailabilityRepository(db)

    def get_user_availabilities(self, user_id: str) -> List[Dict[str, Any]]:
        return self.repo.find_by_user(user_id)

    def create_availability(self, data: AvailabilityCreate) -> Dict[str, Any]:
        return self.repo.create(data.model_dump())

    def update_availability(self, avail_id: str, data: AvailabilityUpdate) -> Optional[Dict[str, Any]]:
        return self.repo.update(avail_id, data.model_dump(exclude_unset=True))

    def delete_availability(self, avail_id: str) -> bool:
        return self.repo.delete(avail_id)
