from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.schemas.user import UserCreate, UserUpdate, UserRead
from app.services.user_service import UserService

router = APIRouter()


@router.get("/", response_model=List[UserRead])
def list_users(
    role: Optional[str] = None,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    service = UserService(db)
    return service.get_users(role)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    service = UserService(db)
    return service.create_user(payload)


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    service = UserService(db)
    user = service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: str,
    payload: UserUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    service = UserService(db)
    user = service.update_user(user_id, payload)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    service = UserService(db)
    if not service.delete_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")
