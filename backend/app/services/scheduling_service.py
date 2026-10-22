from datetime import datetime, timedelta, time
from typing import Dict, Any, List, Optional
from pymongo.database import Database
from app.solver.context import SchedulingContext, TimeSlotUnit
from app.solver.scheduler_engine import SchedulerEngine
from app.validator.schedule_validator import ScheduleValidator
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.interviewer_repository import InterviewerRepository
from app.repositories.room_repository import RoomRepository
from app.repositories.round_repository import RoundRepository
from app.repositories.availability_repository import AvailabilityRepository
from app.repositories.interview_repository import InterviewRepository
from app.repositories.schedule_repository import ScheduleRepository
from app.schemas.schedule import ScheduleSolveRequest


class SchedulingService:
    def __init__(self, db: Database):
        self.db = db
        self.candidate_repo = CandidateRepository(db)
        self.interviewer_repo = InterviewerRepository(db)
        self.room_repo = RoomRepository(db)
        self.round_repo = RoundRepository(db)
        self.avail_repo = AvailabilityRepository(db)
        self.interview_repo = InterviewRepository(db)
        self.schedule_repo = ScheduleRepository(db)

    def _generate_time_slots(self, start_date, end_date, interval_minutes: int = 60) -> List[TimeSlotUnit]:
        """Generate working hour time slots between start_date and end_date (9am to 5pm)."""
        slots: List[TimeSlotUnit] = []
        slot_id = 0
        curr_date = start_date
        
        while curr_date <= end_date:
            # Skip weekends (5=Saturday, 6=Sunday)
            if curr_date.weekday() < 5:
                # 9:00 AM to 5:00 PM
                start_dt = datetime.combine(curr_date, time(9, 0))
                end_day_dt = datetime.combine(curr_date, time(17, 0))
                
                curr_slot_start = start_dt
                while curr_slot_start + timedelta(minutes=interval_minutes) <= end_day_dt:
                    slot_end = curr_slot_start + timedelta(minutes=interval_minutes)
                    slots.append(TimeSlotUnit(
                        slot_id=slot_id,
                        start_time=curr_slot_start,
                        end_time=slot_end,
                        date_str=curr_date.isoformat()
                    ))
                    slot_id += 1
                    curr_slot_start = slot_end
            curr_date += timedelta(days=1)
        return slots

    def trigger_solver(self, req: ScheduleSolveRequest) -> Dict[str, Any]:
        candidates = self.candidate_repo.find_all({"_id": {"$in": req.candidate_ids}} if req.candidate_ids else {})
        if not candidates:
            # Fallback mock candidate if db is fresh
            candidates = [{"id": "cand_1", "email": "alex@example.com", "full_name": "Alex Mercer", "skills": ["Python", "FastAPI"]}]
            
        interviewers = self.interviewer_repo.find_active()
        if not interviewers:
            # Fallback mock interviewer if db is fresh
            interviewers = [
                {"id": "int_1", "email": "sara@company.com", "full_name": "Sara Chen", "skills": ["Python", "FastAPI", "System Design"], "max_interviews_per_day": 4},
                {"id": "int_2", "email": "david@company.com", "full_name": "David Kim", "skills": ["Python", "Algorithms", "Behavioral"], "max_interviews_per_day": 4}
            ]
            
        rooms = self.room_repo.find_active()
        if not rooms:
            rooms = [
                {"id": "room_1", "name": "Room Turing (Virtual)", "capacity": 6, "is_active": True},
                {"id": "room_2", "name": "Room Lovelace (Virtual)", "capacity": 6, "is_active": True}
            ]
            
        rounds = self.round_repo.find_all_ordered()
        if not rounds:
            rounds = [
                {"id": "round_1", "name": "Technical Screen", "order_index": 1, "duration_minutes": 60, "required_skills": ["Python"], "prerequisite_round_ids": []},
                {"id": "round_2", "name": "System Architecture", "order_index": 2, "duration_minutes": 60, "required_skills": ["System Design"], "prerequisite_round_ids": ["round_1"]}
            ]

        time_slots = self._generate_time_slots(req.start_date, req.end_date, interval_minutes=60)
        if not time_slots:
            time_slots = self._generate_time_slots(datetime.utcnow().date(), datetime.utcnow().date() + timedelta(days=5), interval_minutes=60)

        # Build context
        context = SchedulingContext(
            candidates=candidates,
            interviewers=interviewers,
            rooms=rooms,
            rounds=rounds,
            time_slots=time_slots,
            interviewer_skills={i["id"]: set(i.get("skills", [])) for i in interviewers},
            timeout_seconds=req.timeout_seconds or 30,
            minimize_idle_time=req.minimize_idle_time,
            balance_workload=req.balance_workload,
        )

        # Run CP-SAT optimization engine
        engine = SchedulerEngine(timeout_seconds=context.timeout_seconds)
        solver_output = engine.solve(context)

        # Run independent verification
        validator = ScheduleValidator(rounds=rounds)
        validation = validator.validate(solver_output["interviews"])

        # Determine next schedule version
        latest_version = self.schedule_repo.get_latest_version()
        next_ver_num = (latest_version.get("version_number", 0) + 1) if latest_version else 1

        # Create schedule version record
        version_doc = self.schedule_repo.create({
            "version_number": next_ver_num,
            "name": f"Optimized Schedule v{next_ver_num}",
            "status": "OPTIMIZED" if validation.is_valid else "DRAFT",
            "total_interviews": solver_output["total_requested"],
            "assigned_interviews": solver_output["total_assigned"],
            "interview_ids": [],
            "notes": f"Generated via Google OR-Tools CP-SAT in {solver_output['solver_duration_seconds']}s",
        })

        # Save individual interview records
        saved_interview_ids = []
        for inv in solver_output["interviews"]:
            inv["schedule_version_id"] = version_doc["id"]
            created_inv = self.interview_repo.create(inv)
            saved_interview_ids.append(created_inv["id"])

        self.schedule_repo.update(version_doc["id"], {"interview_ids": saved_interview_ids})

        solver_output["schedule_version_id"] = version_doc["id"]
        solver_output["version_number"] = next_ver_num
        solver_output["validation"] = {
            "is_valid": validation.is_valid,
            "errors": validation.errors,
            "warnings": validation.warnings,
        }
        return solver_output
