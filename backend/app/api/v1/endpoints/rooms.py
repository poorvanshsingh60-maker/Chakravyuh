from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.room_repository import RoomRepository
from app.schemas.room import RoomCreate, RoomUpdate, RoomRead

router = APIRouter()


@router.get("/", response_model=List[RoomRead])
def list_rooms(db: Database = Depends(get_db)):
    repo = RoomRepository(db)
    return repo.find_all()


@router.post("/", response_model=RoomRead, status_code=status.HTTP_201_CREATED)
def create_room(
    payload: RoomCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = RoomRepository(db)
    return repo.create(payload.model_dump())


@router.put("/{room_id}", response_model=RoomRead)
def update_room(
    room_id: str,
    payload: RoomUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = RoomRepository(db)
    item = repo.update(room_id, payload.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status_code=404, detail="Room not found")
    return item


@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(
    room_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    repo = RoomRepository(db)
    if not repo.delete(room_id):
        raise HTTPException(status_code=404, detail="Room not found")
