from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, get_current_user
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Database = Depends(get_db)):
    auth_service = AuthService(db)
    result = auth_service.authenticate_user(payload)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return result


@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return current_user
