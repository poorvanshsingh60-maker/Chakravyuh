from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, get_current_user
from app.repositories.interview_repository import InterviewRepository
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewRead

router = APIRouter()


@router.get("/", response_model=List[InterviewRead])
def list_interviews(
    candidate_id: Optional[str] = None,
    interviewer_id: Optional[str] = None,
    schedule_version_id: Optional[str] = None,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    repo = InterviewRepository(db)
    query = {}
    if candidate_id:
        query["candidate_id"] = candidate_id
    if interviewer_id:
        query["interviewer_ids"] = interviewer_id
    if schedule_version_id:
        query["schedule_version_id"] = schedule_version_id
    return repo.find_all(query)


@router.post("/", response_model=InterviewRead, status_code=status.HTTP_201_CREATED)
def create_interview(
    payload: InterviewCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    repo = InterviewRepository(db)
    return repo.create(payload.model_dump())


@router.get("/{interview_id}", response_model=InterviewRead)
def get_interview(
    interview_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    repo = InterviewRepository(db)
    item = repo.find_by_id(interview_id)
    if not item:
        raise HTTPException(status_code=404, detail="Interview not found")
    return item


@router.put("/{interview_id}", response_model=InterviewRead)
def update_interview(
    interview_id: str,
    payload: InterviewUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    repo = InterviewRepository(db)
    item = repo.update(interview_id, payload.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status_code=404, detail="Interview not found")
    return item


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    repo = InterviewRepository(db)
    if not repo.delete(interview_id):
        raise HTTPException(status_code=404, detail="Interview not found")
