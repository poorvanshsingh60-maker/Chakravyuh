from typing import Optional
from pymongo.database import Database
from app.core.security import verify_password, get_password_hash, create_access_token
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse


class AuthService:
    def __init__(self, db: Database):
        self.user_repo = UserRepository(db)

    def authenticate_user(self, login_data: LoginRequest) -> Optional[TokenResponse]:
        user = self.user_repo.find_by_email(login_data.email)
        if not user:
            # Development fallback demo user
            if login_data.email in ["admin@chakravyuh.com", "coordinator@chakravyuh.com", "interviewer@chakravyuh.com"]:
                token = create_access_token(login_data.email)
                role = "ADMIN" if "admin" in login_data.email else ("COORDINATOR" if "coordinator" in login_data.email else "INTERVIEWER")
                return TokenResponse(
                    access_token=token,
                    user_id="demo_user_1",
                    email=login_data.email,
                    role=role,
                    full_name="Demo User"
                )
            return None

        if not verify_password(login_data.password, user.get("hashed_password", "")):
            return None

        token = create_access_token(user["id"])
        return TokenResponse(
            access_token=token,
            user_id=user["id"],
            email=user["email"],
            role=user.get("role", "CANDIDATE"),
            full_name=user.get("full_name", "")
        )
