from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.round_repository import RoundRepository
from app.schemas.interview_round import RoundCreate, RoundUpdate, RoundRead

router = APIRouter()


@router.get("/", response_model=List[RoundRead])
def list_rounds(db: Database = Depends(get_db)):
    repo = RoundRepository(db)
    return repo.find_all_ordered()


@router.post("/", response_model=RoundRead, status_code=status.HTTP_201_CREATED)
def create_round(
    payload: RoundCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = RoundRepository(db)
    return repo.create(payload.model_dump())


@router.put("/{round_id}", response_model=RoundRead)
def update_round(
    round_id: str,
    payload: RoundUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = RoundRepository(db)
    item = repo.update(round_id, payload.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status_code=404, detail="Round not found")
    return item


@router.delete("/{round_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_round(
    round_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    repo = RoundRepository(db)
    if not repo.delete(round_id):
        raise HTTPException(status_code=404, detail="Round not found")
