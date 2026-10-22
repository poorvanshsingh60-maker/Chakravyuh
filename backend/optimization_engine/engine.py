from ortools.sat.python import cp_model
from .models import Candidate, Interviewer, Room, InterviewReq
from typing import List, Dict

class SchedulingEngine:
    def __init__(self, candidates: List[Candidate], interviewers: List[Interviewer], rooms: List[Room], interviews: List[InterviewReq], time_horizon: int):
        self.model = cp_model.CpModel()
        self.candidates = candidates
        self.interviewers = interviewers
        self.rooms = rooms
        self.interviews = interviews
        self.time_horizon = time_horizon # Total time slots available (e.g., 8 hours = 480 minutes)
        
        # Dictionary to store our boolean assignment variables
        # Key: (interview_id, interviewer_id, room_id, start_time)
        self.assignments = {}
        
    def build_model(self):
        # 1. Variable Modeling & Skill Matching (Hard Constraint)
        for interview in self.interviews:
            for interviewer in self.interviewers:
                # Check skill match before even creating the variable
                if not all(skill in interviewer.skills for skill in interview.required_skills):
                    continue
                    
                for room in self.rooms:
                    for t in range(self.time_horizon - interview.duration_minutes + 1):
                        var_name = f'assign_i{interview.interview_id}_int{interviewer.interviewer_id}_r{room.room_id}_t{t}'
                        self.assignments[(interview.interview_id, interviewer.interviewer_id, room.room_id, t)] = self.model.NewBoolVar(var_name)

        # 2. Hard Constraint: Each interview must be scheduled exactly once
        for interview in self.interviews:
            valid_assignments = [
                self.assignments[key] for key in self.assignments 
                if key[0] == interview.interview_id
            ]
            self.model.AddExactlyOne(valid_assignments)

        # 3. Hard Constraint: No overlapping interviews for interviewers
        for interviewer in self.interviewers:
            interviewer_tasks = []
            for key, var in self.assignments.items():
                if key[1] == interviewer.interviewer_id:
                    # key[3] is start_time, duration is tied to key[0] (interview_id)
                    duration = next(i.duration_minutes for i in self.interviews if i.interview_id == key[0])
                    
                    start_var = self.model.NewIntVar(0, self.time_horizon, f'start_{key}')
                    end_var = self.model.NewIntVar(0, self.time_horizon, f'end_{key}')
                    
                    # Tie the interval to the boolean assignment variable
                    self.model.Add(start_var == key[3]).OnlyEnforceIf(var)
                    self.model.Add(end_var == key[3] + duration).OnlyEnforceIf(var)
                    
                    interval = self.model.NewOptionalIntervalVar(start_var, duration, end_var, var, f'interval_{key}')
                    interviewer_tasks.append(interval)
            
            if interviewer_tasks:
                self.model.AddNoOverlap(interviewer_tasks)

        # 4. Soft Constraint Objective (e.g., maximize use of preferred time slots)
        # For study purposes, this is a placeholder where you will add logic to reward specific 't' values
        self.model.Maximize(sum(self.assignments.values())) 

    def solve(self) -> Dict:
        solver = cp_model.CpSolver()
        # Set a time limit so the API doesn't hang forever
        solver.parameters.max_time_in_seconds = 60.0 
        
        status = solver.Solve(self.model)
        
        result = {
            "status": solver.StatusName(status),
            "schedule": [],
            "conflicts": []
        }
        
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            for key, var in self.assignments.items():
                if solver.Value(var) == 1:
                    result["schedule"].append({
                        "interview_id": key[0],
                        "interviewer_id": key[1],
                        "room_id": key[2],
                        "start_time": key[3]
                    })
        else:
            result["conflicts"].append("Could not find a feasible schedule with the given constraints.")
            
        return result