from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import secrets
import datetime
from .models import Candidate, Interviewer, Room, InterviewReq, TimeSlot, SolverResult, ScheduleRequest
from .engine import SchedulingEngine
from .validator import ScheduleValidator
from .auth import (
    SignUpRequest, LoginRequest, AuthResponse, UserProfile,
    load_users, save_users, hash_password, verify_password,
    create_jwt_token, decode_jwt_token
)

app = FastAPI(title="Chakravyuh Optimization Engine")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Endpoints ---

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


def get_scheduling_data_from_mongo():
    """Realistic MNNIT Allahabad On-Campus Placement Drive Scheduling Dataset."""
    candidates = [
        Candidate(candidate_id="Aditya_Singh", available_slots=[TimeSlot(start_time=0, end_time=480, is_preferred=True)]),
        Candidate(candidate_id="Priya_Sharma", available_slots=[TimeSlot(start_time=30, end_time=480, is_preferred=True)]),
        Candidate(candidate_id="Rahul_Verma", available_slots=[TimeSlot(start_time=0, end_time=360, is_preferred=False)]),
        Candidate(candidate_id="Ananya_Patel", available_slots=[TimeSlot(start_time=60, end_time=480, is_preferred=True)]),
    ]
    interviewers = [
        Interviewer(
            interviewer_id="Panel_DSA_Coding",
            skills=["DSA", "Python", "Algorithms"],
            available_slots=[TimeSlot(start_time=0, end_time=480, is_preferred=True)],
            max_interviews_per_day=6
        ),
        Interviewer(
            interviewer_id="Panel_SystemDesign",
            skills=["SystemDesign", "CoreCS"],
            available_slots=[TimeSlot(start_time=60, end_time=480, is_preferred=True)],
            max_interviews_per_day=5
        ),
        Interviewer(
            interviewer_id="Panel_HR_Leadership",
            skills=["Leadership", "HR"],
            available_slots=[TimeSlot(start_time=120, end_time=480, is_preferred=True)],
            max_interviews_per_day=6
        ),
    ]
    rooms = [
        Room(room_id="CCF_Lab_1", capacity=4, available_slots=[TimeSlot(start_time=0, end_time=480)]),
        Room(room_id="CCF_Lab_2", capacity=4, available_slots=[TimeSlot(start_time=0, end_time=480)]),
        Room(room_id="LHC_Seminar_Hall", capacity=6, available_slots=[TimeSlot(start_time=0, end_time=480)]),
        Room(room_id="TP_Boardroom", capacity=8, available_slots=[TimeSlot(start_time=0, end_time=480)]),
    ]
    interviews = [
        # Aditya Singh: DSA -> SystemDesign -> HR
        InterviewReq(interview_id="Aditya_R1", candidate_id="Aditya_Singh", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="Aditya_R2", candidate_id="Aditya_Singh", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="Aditya_R1"),
        InterviewReq(interview_id="Aditya_R3", candidate_id="Aditya_Singh", round_order=3, required_skills=["Leadership"], duration_minutes=30, prerequisite_interview_id="Aditya_R2"),

        # Priya Sharma: DSA -> SystemDesign -> HR
        InterviewReq(interview_id="Priya_R1", candidate_id="Priya_Sharma", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="Priya_R2", candidate_id="Priya_Sharma", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="Priya_R1"),

        # Rahul Verma: DSA -> SystemDesign
        InterviewReq(interview_id="Rahul_R1", candidate_id="Rahul_Verma", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="Rahul_R2", candidate_id="Rahul_Verma", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="Rahul_R1"),

        # Ananya Patel: DSA -> SystemDesign
        InterviewReq(interview_id="Ananya_R1", candidate_id="Ananya_Patel", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="Ananya_R2", candidate_id="Ananya_Patel", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="Ananya_R1"),
    ]
    return candidates, interviewers, rooms, interviews

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Chakravyuh Optimization Engine", "solver": "Google OR-Tools CP-SAT"}

@app.post("/generate-schedule", response_model=SolverResult)
@app.post("/schedules/solve", response_model=SolverResult)
@app.post("/api/v1/schedules/solve", response_model=SolverResult)
async def generate_schedule(req: Optional[ScheduleRequest] = None):
    if req and req.candidates and req.interviewers and req.rooms and req.interviews:
        candidates = req.candidates
        interviewers = req.interviewers
        rooms = req.rooms
        interviews = req.interviews
        time_horizon = req.time_horizon
        time_step = req.time_step
        allow_partial = req.allow_partial
    else:
        candidates, interviewers, rooms, interviews = get_scheduling_data_from_mongo()
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

    return result