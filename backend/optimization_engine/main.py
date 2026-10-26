from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager
from pydantic import BaseModel
import secrets
import datetime
from .models import Candidate, Interviewer, Room, InterviewReq, TimeSlot, SolverResult, ScheduleRequest
from .engine import SchedulingEngine
from .validator import ScheduleValidator
from .auth import (
    SignUpRequest, LoginRequest, GoogleAuthRequest, AuthResponse, UserProfile,
    load_users, save_users, hash_password, verify_password,
    create_jwt_token, decode_jwt_token, verify_google_token
)
from .database import (
    init_db,
    db_get_all_candidates, db_get_candidate, db_create_candidate, db_update_candidate, db_delete_candidate,
    db_get_all_interviewers, db_get_interviewer, db_create_interviewer, db_update_interviewer_availability,
    db_get_all_jobs, db_get_job, db_create_job,
    db_get_all_rooms,
    db_get_active_schedule, db_save_schedule, db_publish_schedule,
    db_get_all_evaluations, db_get_evaluations_by_candidate, db_create_evaluation,
    db_get_messages, db_create_message, db_mark_message_read
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial data on startup
    init_db()
    yield

app = FastAPI(title="Chakravyuh Optimization Engine & Placement Backend", lifespan=lifespan)

# Enable CORS for local development and multi-device access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================================
# Authentication Endpoints
# =========================================================================

@app.post("/auth/signup", response_model=AuthResponse)
@app.post("/api/v1/auth/signup", response_model=AuthResponse)
async def signup(req: SignUpRequest):
    users = load_users()
    email_key = req.email.lower().strip()
    if email_key in users:
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")
    
    salt, hashed = hash_password(req.password)
    user_id = f"user-{secrets.token_hex(4)}"
    new_user = {
        "id": user_id,
        "email": email_key,
        "full_name": req.full_name.strip() or email_key.split("@")[0],
        "role": req.role,
        "salt": salt,
        "password_hash": hashed,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    users[email_key] = new_user
    save_users(users)
    
    token = create_jwt_token(new_user)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile(
            id=user_id,
            email=email_key,
            full_name=new_user["full_name"],
            role=new_user["role"]
        )
    )

@app.post("/auth/login", response_model=AuthResponse)
@app.post("/api/v1/auth/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    users = load_users()
    email_key = req.email.lower().strip()
    if email_key not in users:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    user = users[email_key]
    if not verify_password(req.password, user["salt"], user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_jwt_token(user)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"]
        )
    )

@app.post("/auth/google", response_model=AuthResponse)
@app.post("/api/v1/auth/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest):
    try:
        google_profile = verify_google_token(credential=req.credential, access_token=req.access_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google authentication failed: {str(e)}")

    users = load_users()
    email_key = google_profile["email"].lower().strip()

    if email_key in users:
        user = users[email_key]
        if google_profile.get("name"):
            user["full_name"] = google_profile["name"]
        if google_profile.get("picture"):
            user["picture"] = google_profile["picture"]
        user["auth_provider"] = "google"
        users[email_key] = user
        save_users(users)
    else:
        user_id = f"google-{google_profile.get('sub', secrets.token_hex(4))[:12]}"
        user = {
            "id": user_id,
            "email": email_key,
            "full_name": google_profile.get("name", email_key.split("@")[0]),
            "role": req.role,
            "picture": google_profile.get("picture", ""),
            "auth_provider": "google",
            "salt": "",
            "password_hash": "",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        users[email_key] = user
        save_users(users)

    token = create_jwt_token(user)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            picture=user.get("picture")
        )
    )

@app.get("/auth/me", response_model=UserProfile)
@app.get("/api/v1/auth/me", response_model=UserProfile)
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required.")
    
    token = authorization.split(" ", 1)[1].strip()
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")
    
    return UserProfile(
        id=payload["id"],
        email=payload["sub"],
        full_name=payload["full_name"],
        role=payload["role"]
    )


# =========================================================================
# Candidates REST Endpoints
# =========================================================================

class CandidateCreateRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: Optional[str] = "Software Engineer"
    department: Optional[str] = "Engineering"
    stage: Optional[str] = "Technical Loop"
    recruiter: Optional[str] = "T&P Coordinator Emma"
    status: Optional[str] = "NEEDS_SCHEDULING"
    available_slots: Optional[List[Dict[str, Any]]] = None

@app.get("/candidates")
@app.get("/api/v1/candidates")
async def list_candidates():
    return db_get_all_candidates()

@app.get("/candidates/{cand_id}")
@app.get("/api/v1/candidates/{cand_id}")
async def get_candidate_by_id(cand_id: str):
    cand = db_get_candidate(cand_id)
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return cand

@app.post("/candidates")
@app.post("/api/v1/candidates")
async def create_candidate(req: CandidateCreateRequest):
    return db_create_candidate(req.model_dump())

@app.put("/candidates/{cand_id}")
@app.put("/api/v1/candidates/{cand_id}")
async def update_candidate(cand_id: str, req: Dict[str, Any]):
    updated = db_update_candidate(cand_id, req)
    if not updated:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return updated

@app.delete("/candidates/{cand_id}")
@app.delete("/api/v1/candidates/{cand_id}")
async def delete_candidate(cand_id: str):
    success = db_delete_candidate(cand_id)
    if not success:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return {"status": "deleted", "id": cand_id}


# =========================================================================
# Interviewers & Panels REST Endpoints
# =========================================================================

class InterviewerCreateRequest(BaseModel):
    name: str
    email: Optional[str] = None
    avatar: Optional[str] = ""
    role: Optional[str] = "Senior Software Engineer"
    team: Optional[str] = "Core Panel"
    skills: Optional[List[str]] = None
    weekly_capacity: Optional[int] = 6
    training_level: Optional[str] = "Level 1 (Qualified)"
    available_slots: Optional[Dict[str, bool]] = None

class AvailabilityUpdateRequest(BaseModel):
    available_slots: Dict[str, bool]

@app.get("/interviewers")
@app.get("/api/v1/interviewers")
async def list_interviewers():
    return db_get_all_interviewers()

@app.get("/interviewers/{int_id}")
@app.get("/api/v1/interviewers/{int_id}")
async def get_interviewer_by_id(int_id: str):
    interviewer = db_get_interviewer(int_id)
    if not interviewer:
        raise HTTPException(status_code=404, detail="Interviewer not found.")
    return interviewer

@app.post("/interviewers")
@app.post("/api/v1/interviewers")
async def create_interviewer(req: InterviewerCreateRequest):
    return db_create_interviewer(req.model_dump())

@app.patch("/interviewers/{int_id}/availability")
@app.patch("/api/v1/interviewers/{int_id}/availability")
async def update_interviewer_availability(int_id: str, req: AvailabilityUpdateRequest):
    updated = db_update_interviewer_availability(int_id, req.available_slots)
    if not updated:
        raise HTTPException(status_code=404, detail="Interviewer not found.")
    return updated


# =========================================================================
# Job Positions & Placement Drives REST Endpoints
# =========================================================================

class JobCreateRequest(BaseModel):
    title: str
    department: Optional[str] = "Core Infrastructure"
    location: Optional[str] = "Hybrid / Remote"
    openings: Optional[int] = 1
    rounds: Optional[List[Dict[str, Any]]] = None

@app.get("/jobs")
@app.get("/api/v1/jobs")
async def list_jobs():
    return db_get_all_jobs()

@app.get("/jobs/{job_id}")
@app.get("/api/v1/jobs/{job_id}")
async def get_job_by_id(job_id: str):
    job = db_get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job position not found.")
    return job

@app.post("/jobs")
@app.post("/api/v1/jobs")
async def create_job(req: JobCreateRequest):
    return db_create_job(req.model_dump())


# =========================================================================
# Rooms REST Endpoints
# =========================================================================

@app.get("/rooms")
@app.get("/api/v1/rooms")
async def list_rooms():
    return db_get_all_rooms()


# =========================================================================
# Master Schedules REST Endpoints
# =========================================================================

@app.get("/schedules/active")
@app.get("/api/v1/schedules/active")
async def get_active_schedule():
    sched = db_get_active_schedule()
    if not sched:
        return {"status": "NO_SCHEDULE", "sessions": []}
    return sched

@app.post("/schedules/publish")
@app.post("/api/v1/schedules/publish")
async def publish_schedule(req: Optional[Dict[str, Any]] = None):
    sched = db_get_active_schedule()
    if not sched:
        raise HTTPException(status_code=400, detail="No active draft schedule to publish.")
    return db_publish_schedule(sched["id"])

@app.get("/schedules/my-schedule")
@app.get("/api/v1/schedules/my-schedule")
async def get_my_candidate_schedule(candidate_name: Optional[str] = Query(None)):
    sched = db_get_active_schedule()
    if not sched or not sched.get("sessions"):
        return {"status": "PENDING", "rounds": []}
    
    sessions = sched["sessions"]
    if candidate_name:
        cand_lower = candidate_name.lower().strip()
        sessions = [s for s in sessions if cand_lower in s.get("candidateName", "").lower()]
    
    return {"status": "CONFIRMED" if sched.get("status") == "PUBLISHED" else "DRAFT", "rounds": sessions}

@app.get("/schedules/my-interviews")
@app.get("/api/v1/schedules/my-interviews")
async def get_my_interviews(interviewer_name: Optional[str] = Query(None)):
    sched = db_get_active_schedule()
    if not sched or not sched.get("sessions"):
        return {"interviews": []}
    
    sessions = sched["sessions"]
    if interviewer_name:
        int_lower = interviewer_name.lower().strip()
        sessions = [s for s in sessions if int_lower in s.get("interviewer", "").lower()]
    
    return {"interviews": sessions}


# =========================================================================
# Scorecards & Evaluations REST Endpoints
# =========================================================================

class EvaluationCreateRequest(BaseModel):
    interview_id: str
    candidate_id: Optional[str] = None
    candidate_name: str
    interviewer_id: Optional[str] = None
    interviewer_name: str
    round_name: str
    decision: str  # STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE
    rating: Optional[int] = 5
    problem_solving_rating: Optional[int] = 5
    architecture_rating: Optional[int] = 4
    communication_rating: Optional[int] = 5
    strengths: Optional[str] = ""
    growth_areas: Optional[str] = ""
    notes: Optional[str] = ""

@app.get("/evaluations")
@app.get("/api/v1/evaluations")
async def list_evaluations():
    return db_get_all_evaluations()

@app.get("/evaluations/candidate/{cand_name}")
@app.get("/api/v1/evaluations/candidate/{cand_name}")
async def get_candidate_evaluations(cand_name: str):
    return db_get_evaluations_by_candidate(cand_name)

@app.post("/evaluations")
@app.post("/api/v1/evaluations")
async def submit_evaluation(req: EvaluationCreateRequest):
    return db_create_evaluation(req.model_dump())


# =========================================================================
# Messages & Communications REST Endpoints
# =========================================================================

class MessageCreateRequest(BaseModel):
    sender_name: str
    sender_role: str
    recipient_name: str
    recipient_role: str
    subject: str
    body: str
    type: Optional[str] = "DIRECT"

@app.get("/messages")
@app.get("/api/v1/messages")
async def list_messages(role: Optional[str] = Query(None)):
    return db_get_messages(role=role)

@app.post("/messages")
@app.post("/api/v1/messages")
async def send_message(req: MessageCreateRequest):
    return db_create_message(req.model_dump())

@app.patch("/messages/{msg_id}/read")
@app.patch("/api/v1/messages/{msg_id}/read")
async def mark_message_as_read(msg_id: str):
    db_mark_message_read(msg_id)
    return {"status": "read", "id": msg_id}


# =========================================================================
# Health & Status
# =========================================================================

@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "Chakravyuh Optimization Engine & Placement Backend",
        "database": "SQLite WAL Persistent Mode",
        "solver": "Google OR-Tools CP-SAT"
    }


# =========================================================================
# Dynamic Google OR-Tools CP-SAT Scheduling Engine
# =========================================================================

def get_scheduling_data_from_db():
    """Dynamically builds solver entities from active SQLite database."""
    raw_candidates = db_get_all_candidates()
    raw_interviewers = db_get_all_interviewers()
    raw_rooms = db_get_all_rooms()
    raw_jobs = db_get_all_jobs()

    # Map Candidates & Interview Requirements
    candidates = []
    interviews = []
    
    # Pre-build skill index across all calibrated interviewers
    interviewer_pool_skills = set()
    for inv in raw_interviewers:
        for sk in inv.get("skills", []):
            interviewer_pool_skills.add(sk.strip().lower())

    for cand in raw_candidates:
        c_id = cand["id"]
        # Candidate Availability
        cand_slots = []
        for s in cand.get("available_slots", []):
            if isinstance(s, dict) and "start_time" in s and "end_time" in s:
                cand_slots.append(TimeSlot(start_time=s["start_time"], end_time=s["end_time"], is_preferred=s.get("is_preferred", False)))
        if not cand_slots:
            cand_slots = [TimeSlot(start_time=0, end_time=480, is_preferred=True)]
        candidates.append(Candidate(candidate_id=c_id, available_slots=cand_slots))

        # Determine rounds from matching job
        matching_job = None
        for j in raw_jobs:
            if j["title"].lower() in cand.get("role", "").lower() or cand.get("role", "").lower() in j["title"].lower():
                matching_job = j
                break
        if not matching_job and raw_jobs:
            matching_job = raw_jobs[0]

        job_rounds = matching_job.get("rounds", []) if matching_job else []
        if not job_rounds:
            job_rounds = [
                {"id": "r1", "name": "Technical Screen", "duration": 45, "required_skills": ["DSA"], "round_order": 1, "prerequisite_round_id": None},
                {"id": "r2", "name": "System Architecture", "duration": 60, "required_skills": ["System Design"], "round_order": 2, "prerequisite_round_id": "r1"}
            ]

        # Register interview requirements
        for r_idx, r in enumerate(job_rounds):
            int_id = f"{c_id}_R{r_idx + 1}"
            raw_req_skills = r.get("required_skills") or ["DSA"]
            
            # Map required skills to interviewer skills to ensure feasibility
            clean_skills = []
            for sk in raw_req_skills:
                # Find matching or fallback skill in interviewer pool
                for pool_sk in interviewer_pool_skills:
                    if sk.lower() in pool_sk or pool_sk in sk.lower():
                        clean_skills.append(sk)
                        break
            if not clean_skills:
                clean_skills = [raw_req_skills[0]] if raw_req_skills else ["DSA"]

            duration = min(60, max(30, int(r.get("duration", 45))))
            prereq = f"{c_id}_R{r_idx}" if r_idx > 0 else None
            
            interviews.append(InterviewReq(
                interview_id=int_id,
                candidate_id=c_id,
                round_order=r_idx + 1,
                required_skills=clean_skills[:1], # single primary required skill per round for clean feasibility
                duration_minutes=duration,
                prerequisite_interview_id=prereq
            ))

    # Map Interviewers
    interviewers = []
    for inv in raw_interviewers:
        i_id = inv["id"]
        i_skills = inv.get("skills") or ["DSA", "Python", "System Design", "Core CS", "Leadership"]
        
        # Availability slots mapping
        raw_avail = inv.get("available_slots")
        slots = []
        if isinstance(raw_avail, dict):
            HOUR_MAP = {9: 0, 10: 60, 11: 120, 13: 240, 14: 300, 15: 360, 16: 420}
            for key, is_avail in raw_avail.items():
                if is_avail and "-" in key:
                    try:
                        h = int(key.split("-")[1])
                        st = HOUR_MAP.get(h, (h - 9) * 60)
                        slots.append(TimeSlot(start_time=max(0, st), end_time=min(480, st + 60), is_preferred=True))
                    except:
                        pass
        elif isinstance(raw_avail, list):
            for s in raw_avail:
                if isinstance(s, dict) and "start_time" in s and "end_time" in s:
                    slots.append(TimeSlot(start_time=s["start_time"], end_time=s["end_time"], is_preferred=True))
        
        # Fallback to generous available window if no slots chosen yet
        if not slots:
            slots = [TimeSlot(start_time=0, end_time=480, is_preferred=True)]

        interviewers.append(Interviewer(
            interviewer_id=i_id,
            skills=i_skills,
            available_slots=slots,
            max_interviews_per_day=max(4, int(inv.get("weekly_capacity", 6)))
        ))

    # Map Rooms
    rooms = []
    for rm in raw_rooms:
        rooms.append(Room(
            room_id=rm["id"],
            capacity=max(2, int(rm.get("capacity", 4))),
            available_slots=[TimeSlot(start_time=0, end_time=480)]
        ))

    return candidates, interviewers, rooms, interviews


@app.post("/generate-schedule", response_model=SolverResult)
@app.post("/schedules/solve", response_model=SolverResult)
@app.post("/api/v1/schedules/solve", response_model=SolverResult)
async def generate_schedule(req: Optional[ScheduleRequest] = None):
    # If explicit payload passed, use it; otherwise build dynamically from live SQLite database!
    if req and req.candidates and req.interviewers and req.rooms and req.interviews:
        candidates = req.candidates
        interviewers = req.interviewers
        rooms = req.rooms
        interviews = req.interviews
        time_horizon = req.time_horizon
        time_step = req.time_step
        allow_partial = req.allow_partial
    else:
        candidates, interviewers, rooms, interviews = get_scheduling_data_from_db()
        time_horizon = 480
        time_step = 15
        allow_partial = False

    # Pass 1: Strict Solve (All interviews mandatory)
    engine = SchedulingEngine(
        candidates=candidates,
        interviewers=interviewers,
        rooms=rooms,
        interviews=interviews,
        time_horizon=time_horizon,
        time_step=time_step,
        allow_partial=allow_partial
    )
    engine.build_model()
    result = engine.solve(time_limit_seconds=15.0)

    # Pass 2: Graceful Degradation (If strictly infeasible, solve maximum feasible subset to report exact bottlenecks)
    if result.status == "INFEASIBLE":
        partial_engine = SchedulingEngine(
            candidates=candidates,
            interviewers=interviewers,
            rooms=rooms,
            interviews=interviews,
            time_horizon=time_horizon,
            time_step=time_step,
            allow_partial=True
        )
        partial_engine.build_model()
        result = partial_engine.solve(time_limit_seconds=15.0)
        result.diagnostics.insert(0, "Strict schedule infeasible. Generated best partial schedule to isolate conflicting interviews.")

    # Pass 3: Independent Validation Layer
    is_valid, validation_errors = ScheduleValidator.validate(
        result.schedule, candidates, interviewers, rooms, interviews
    )
    result.is_validated = is_valid
    if not is_valid:
        result.diagnostics.extend(validation_errors)

    # Auto-save generated schedule into SQLite database
    if result.schedule:
        # Pre-fetch candidate, interviewer and room names for human-readable sessions
        cand_map = {c["id"]: c for c in db_get_all_candidates()}
        inv_map = {i["id"]: i for i in db_get_all_interviewers()}
        room_map = {r["id"]: r for r in db_get_all_rooms()}

        rich_sessions = []
        for idx, item in enumerate(result.schedule):
            cand_info = cand_map.get(item.candidate_id, {})
            inv_info = inv_map.get(item.interviewer_id, {})
            rm_info = room_map.get(item.room_id, {})

            c_name = cand_info.get("name", item.candidate_id)
            c_role = cand_info.get("role", "Candidate")
            i_name = inv_info.get("name", item.interviewer_id)
            i_role = inv_info.get("role", "Interviewer")
            r_name = rm_info.get("name", item.room_id)

            pst_hour = 9 + (item.start_time // 60)
            rich_sessions.append({
                "id": item.interview_id or f"sess-{idx + 1}",
                "candidateId": item.candidate_id,
                "candidateName": c_name,
                "candidateRole": c_role,
                "title": f"Round {item.interview_id.split('_R')[-1] if '_R' in item.interview_id else '1'}: Technical Assessment",
                "roundType": "tech" if "R1" in item.interview_id else "arch" if "R2" in item.interview_id else "values",
                "interviewer": i_name,
                "interviewerRole": i_role,
                "interviewerAvatar": inv_info.get("avatar", ""),
                "room": r_name,
                "dayIndex": idx % 5,
                "pstHour": pst_hour,
                "pstTimeSlot": f"{pst_hour}:00 - {pst_hour + (item.end_time - item.start_time)//60}:00 PST",
                "durationMins": item.end_time - item.start_time,
                "meetingLink": f"https://meet.jit.si/chakravyuh-loop-{item.interview_id.lower().replace('_', '-')}"
            })

        db_save_schedule({
            "version": "v2.4",
            "status": "DRAFT",
            "start_date": "2026-10-26",
            "end_date": "2026-10-30",
            "sessions": rich_sessions,
            "diagnostics": {
                "status": result.status,
                "objective_score": result.objective_score,
                "runtime_seconds": result.runtime_seconds,
                "conflicts_count": len(result.unscheduled_interviews)
            }
        })

    return result