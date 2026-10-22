from typing import List, Optional, Dict, Any
from pymongo.database import Database
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Database):
        self.user_repo = UserRepository(db)

    def get_users(self, role: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {"role": role.upper()} if role else {}
        return self.user_repo.find_all(query)

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self.user_repo.find_by_id(user_id)

    def create_user(self, user_data: UserCreate) -> Dict[str, Any]:
        data = user_data.model_dump()
        data["hashed_password"] = get_password_hash(data.pop("password"))
        return self.user_repo.create(data)

    def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[Dict[str, Any]]:
        return self.user_repo.update(user_id, user_data.model_dump(exclude_unset=True))

    def delete_user(self, user_id: str) -> bool:
        return self.user_repo.delete(user_id)
