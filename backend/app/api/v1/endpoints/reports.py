from fastapi import APIRouter, Depends, Response
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.interview_repository import InterviewRepository
from app.services.exporter_service import ExporterService

router = APIRouter()


@router.get("/export/csv")
def export_csv_report(
    schedule_version_id: str = None,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = InterviewRepository(db)
    query = {"schedule_version_id": schedule_version_id} if schedule_version_id else {}
    interviews = repo.find_all(query)
    
    csv_content = ExporterService.export_interviews_to_csv(interviews)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=chakravyuh_schedule_export.csv"}
    )
