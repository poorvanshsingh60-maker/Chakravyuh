from fastapi import FastAPI, BackgroundTasks
from .models import Candidate, Interviewer, Room, InterviewReq
from .engine import SchedulingEngine

app = FastAPI(title="Chakravyuh Optimization Engine")

# Mock database retrieval function
def get_scheduling_data_from_mongo():
    # You will replace this with actual PyMongo calls later
    return [], [], [], []

@app.post("/generate-schedule")
async def generate_schedule(background_tasks: BackgroundTasks):
    # 1. Data Retrieval
    candidates, interviewers, rooms, interviews = get_scheduling_data_from_mongo()
    
    # 2. Initialize Engine
    # Time horizon set to 480 minutes (8-hour workday)
    engine = SchedulingEngine(candidates, interviewers, rooms, interviews, time_horizon=480)
    
    # 3. Execution (This should ideally be pushed to a BackgroundTask or Celery worker)
    engine.build_model()
    result = engine.solve()
    
    # 4. Status Handling
    if result["status"] == "OPTIMAL":
        message = "Perfect schedule generated."
    elif result["status"] == "FEASIBLE":
        message = "Valid schedule generated, but might not be highly optimized."
    else:
        message = "Solver failed. Check constraints and resource availability."
        
    return {
        "message": message,
        "solver_status": result["status"],
        "schedule": result["schedule"],
        "diagnostics": result["conflicts"]
    }