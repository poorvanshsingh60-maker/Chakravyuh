from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    candidates,
    interviewers,
    skills,
    availability,
    rounds,
    rooms,
    interviews,
    evaluations,
    schedules,
    reports,
    analytics,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
api_router.include_router(interviewers.router, prefix="/interviewers", tags=["Interviewers"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(availability.router, prefix="/availability", tags=["Availability"])
api_router.include_router(rounds.router, prefix="/rounds", tags=["Interview Rounds"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(evaluations.router, prefix="/evaluations", tags=["Evaluations"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
