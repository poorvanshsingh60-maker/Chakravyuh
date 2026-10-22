from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, get_current_user
from app.schemas.evaluation import EvaluationCreate, EvaluationRead
from app.services.evaluation_service import EvaluationService

router = APIRouter()


@router.post("/", response_model=EvaluationRead, status_code=status.HTTP_201_CREATED)
def submit_evaluation(
    payload: EvaluationCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = EvaluationService(db)
    return service.submit_evaluation(payload)


@router.get("/candidate/{candidate_id}", response_model=List[EvaluationRead])
def get_evaluations_for_candidate(
    candidate_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = EvaluationService(db)
    return service.get_evaluations_for_candidate(candidate_id)


@router.get("/interview/{interview_id}", response_model=EvaluationRead)
def get_evaluation_by_interview(
    interview_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(get_current_user)
):
    service = EvaluationService(db)
    evaluation = service.get_evaluation_by_interview(interview_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluation
