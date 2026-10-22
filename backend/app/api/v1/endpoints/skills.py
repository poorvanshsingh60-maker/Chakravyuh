from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from app.core.dependencies import get_db, require_roles
from app.repositories.skill_repository import SkillRepository
from app.schemas.skill import SkillCreate, SkillUpdate, SkillRead

router = APIRouter()


@router.get("/", response_model=List[SkillRead])
def list_skills(db: Database = Depends(get_db)):
    repo = SkillRepository(db)
    return repo.find_all()


@router.post("/", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN", "COORDINATOR"]))
):
    repo = SkillRepository(db)
    return repo.create(payload.model_dump())


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: str,
    db: Database = Depends(get_db),
    _user: dict = Depends(require_roles(["ADMIN"]))
):
    repo = SkillRepository(db)
    if not repo.delete(skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")
