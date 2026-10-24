from fastapi import FastAPI
from .models import Candidate, Interviewer, Room, InterviewReq, TimeSlot, SolverResult
from .engine import SchedulingEngine
from .validator import ScheduleValidator

app = FastAPI(title="Chakravyuh Optimization Engine")

def get_scheduling_data_from_mongo():
    """Mock dataset demonstrating multi-round dependencies, skill matching, and slot preferences."""
    candidates = [
        Candidate(candidate_id="C1", available_slots=[TimeSlot(start_time=0, end_time=240, is_preferred=True)]),
        Candidate(candidate_id="C2", available_slots=[TimeSlot(start_time=60, end_time=360, is_preferred=False)]),
    ]
    interviewers = [
        Interviewer(
            interviewer_id="INT_DSA",
            skills=["DSA", "Python"],
            available_slots=[TimeSlot(start_time=0, end_time=300, is_preferred=True)],
            max_interviews_per_day=4
        ),
        Interviewer(
            interviewer_id="INT_SYS",
            skills=["SystemDesign", "Backend"],
            available_slots=[TimeSlot(start_time=60, end_time=360, is_preferred=True)],
            max_interviews_per_day=4
        ),
    ]
    rooms = [
        Room(room_id="R101", capacity=4, available_slots=[TimeSlot(start_time=0, end_time=480)]),
        Room(room_id="R102", capacity=2, available_slots=[TimeSlot(start_time=0, end_time=480)]),
    ]
    interviews = [
        # Candidate 1: Round 1 (DSA) -> Round 2 (System Design)
        InterviewReq(interview_id="C1_R1", candidate_id="C1", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="C1_R2", candidate_id="C1", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="C1_R1"),
        # Candidate 2: Round 1 (DSA) -> Round 2 (System Design)
        InterviewReq(interview_id="C2_R1", candidate_id="C2", round_order=1, required_skills=["DSA"], duration_minutes=45),
        InterviewReq(interview_id="C2_R2", candidate_id="C2", round_order=2, required_skills=["SystemDesign"], duration_minutes=60, prerequisite_interview_id="C2_R1"),
    ]
    return candidates, interviewers, rooms, interviews

@app.post("/generate-schedule", response_model=SolverResult)
async def generate_schedule():
    candidates, interviewers, rooms, interviews = get_scheduling_data_from_mongo()

    # Pass 1: Strict Solve (All interviews mandatory)
    engine = SchedulingEngine(
        candidates=candidates,
        interviewers=interviewers,
        rooms=rooms,
        interviews=interviews,
        time_horizon=480,
        time_step=15,
        allow_partial=False
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
            time_horizon=480,
            time_step=15,
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