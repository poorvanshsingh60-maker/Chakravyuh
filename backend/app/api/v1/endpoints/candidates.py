from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.candidate_repository import CandidateRepository
from app.schemas.candidate import CandidateCreate, CandidateUpdate, CandidateRead

router = APIRouter()


@router.get("/", response_model=List[CandidateRead])
def list_candidates(
    status_filter: Optional[str] = None,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR", "INTERVIEWER"]))
):
    repo = CandidateRepository(db)
    query = {"status": status_filter} if status_filter else {}
    return repo.find_all(query)


@router.post("/", response_model=CandidateRead, status_code=status.HTTP_201_CREATED)
def create_candidate(
    payload: CandidateCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = CandidateRepository(db)
    return repo.create(payload.model_dump())


@router.get("/{candidate_id}", response_model=CandidateRead)
def get_candidate(
    candidate_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR", "INTERVIEWER"]))
):
    repo = CandidateRepository(db)
    cand = repo.find_by_id(candidate_id)
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand


@router.put("/{candidate_id}", response_model=CandidateRead)
def update_candidate(
    candidate_id: str,
    payload: CandidateUpdate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = CandidateRepository(db)
    cand = repo.update(candidate_id, payload.model_dump(exclude_unset=True))
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = CandidateRepository(db)
    if not repo.delete(candidate_id):
        raise HTTPException(status_code=404, detail="Candidate not found")
