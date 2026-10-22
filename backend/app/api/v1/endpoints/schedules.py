from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.schedule_repository import ScheduleRepository
from app.repositories.interview_repository import InterviewRepository
from app.schemas.schedule import (
    ScheduleSolveRequest,
    ScheduleVersionRead,
    SchedulerRunResponse,
)
from app.services.scheduling_service import SchedulingService

router = APIRouter()


@router.post("/solve", response_model=SchedulerRunResponse)
def trigger_schedule_solver(
    payload: ScheduleSolveRequest,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    service = SchedulingService(db)
    result = service.trigger_solver(payload)
    return result


@router.get("/versions", response_model=List[ScheduleVersionRead])
def list_schedule_versions(
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = ScheduleRepository(db)
    return repo.find_all()


@router.get("/versions/{version_id}", response_model=ScheduleVersionRead)
def get_schedule_version(
    version_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = ScheduleRepository(db)
    interview_repo = InterviewRepository(db)
    version = repo.find_by_id(version_id)
    if not version:
        raise HTTPException(status_code=404, detail="Schedule version not found")
    
    interviews = interview_repo.find_by_schedule_version(version_id)
    version["interviews"] = interviews
    return version


@router.post("/versions/{version_id}/publish")
def publish_schedule_version(
    version_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = ScheduleRepository(db)
    version = repo.update(version_id, {"status": "PUBLISHED"})
    if not version:
        raise HTTPException(status_code=404, detail="Schedule version not found")
    return {"message": f"Schedule version {version.get('version_number')} successfully published", "status": "PUBLISHED"}


@router.post("/versions/{version_id}/archive")
def archive_schedule_version(
    version_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = ScheduleRepository(db)
    version = repo.update(version_id, {"status": "ARCHIVED"})
    if not version:
        raise HTTPException(status_code=404, detail="Schedule version not found")
    return {"message": "Schedule version archived", "status": "ARCHIVED"}
