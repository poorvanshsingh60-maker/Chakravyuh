from datetime import datetime
from typing import List, Dict, Any, Optional
from pymongo.database import Database
from app.repositories.evaluation_repository import EvaluationRepository
from app.repositories.interview_repository import InterviewRepository
from app.schemas.evaluation import EvaluationCreate, EvaluationUpdate


class EvaluationService:
    def __init__(self, db: Database):
        self.eval_repo = EvaluationRepository(db)
        self.interview_repo = InterviewRepository(db)

    def submit_evaluation(self, data: EvaluationCreate) -> Dict[str, Any]:
        payload = data.model_dump()
        payload["submitted_at"] = datetime.utcnow().isoformat()
        res = self.eval_repo.create(payload)
        
        # Mark interview as COMPLETED
        self.interview_repo.update(data.interview_id, {"status": "COMPLETED"})
        return res

    def get_evaluations_for_candidate(self, candidate_id: str) -> List[Dict[str, Any]]:
        return self.eval_repo.find_by_candidate(candidate_id)

    def get_evaluation_by_interview(self, interview_id: str) -> Optional[Dict[str, Any]]:
        return self.eval_repo.find_by_interview(interview_id)
