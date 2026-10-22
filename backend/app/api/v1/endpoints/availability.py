from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, get_current_user
from app.schemas.availability import AvailabilityCreate, AvailabilityUpdate, AvailabilityRead
from app.services.availability_service import AvailabilityService

router = APIRouter()


@router.get("/user/{user_id}", response_model=List[AvailabilityRead])
def get_user_availability(
    user_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = AvailabilityService(db)
    return service.get_user_availabilities(user_id)


@router.post("/", response_model=AvailabilityRead, status_code=status.HTTP_201_CREATED)
def create_availability(
    payload: AvailabilityCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = AvailabilityService(db)
    return service.create_availability(payload)


@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability(
    availability_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = AvailabilityService(db)
    if not service.delete_availability(availability_id):
        raise HTTPException(status_code=404, detail="Availability slot not found")
