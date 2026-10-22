from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.interviewer_repository import InterviewerRepository
from app.schemas.interviewer import InterviewerCreate, InterviewerUpdate, InterviewerRead

router = APIRouter()


@router.get("/", response_model=List[InterviewerRead])
def list_interviewers(
    skill: Optional[str] = None,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = InterviewerRepository(db)
    if skill:
        return repo.find_by_skill(skill)
    return repo.find_all()


@router.post("/", response_model=InterviewerRead, status_code=status.HTTP_201_CREATED)
def create_interviewer(
    payload: InterviewerCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = InterviewerRepository(db)
    return repo.create(payload.model_dump())


@router.get("/{interviewer_id}", response_model=InterviewerRead)
def get_interviewer(
    interviewer_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = InterviewerRepository(db)
    interviewer = repo.find_by_id(interviewer_id)
    if not interviewer:
        raise HTTPException(status_code=404, detail="Interviewer not found")
    return interviewer


@router.put("/{interviewer_id}", response_model=InterviewerRead)
def update_interviewer(
    interviewer_id: str,
    payload: InterviewerUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = InterviewerRepository(db)
    interviewer = repo.update(interviewer_id, payload.model_dump(exclude_unset=True))
    if not interviewer:
        raise HTTPException(status_code=404, detail="Interviewer not found")
    return interviewer


@router.delete("/{interviewer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interviewer(
    interviewer_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    repo = InterviewerRepository(db)
    if not repo.delete(interviewer_id):
        raise HTTPException(status_code=404, detail="Interviewer not found")
