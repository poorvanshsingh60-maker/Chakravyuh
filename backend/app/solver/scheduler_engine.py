import time
from typing import Any, Dict, List
from ortools.sat.python import cp_model
from app.solver.context import SchedulingContext
from app.solver.model_builder import build_schedule_model
from app.models.enums import SolverStatus


class SchedulerEngine:
    def __init__(self, timeout_seconds: int = 30):
        self.timeout_seconds = timeout_seconds

    def solve(self, context: SchedulingContext) -> Dict[str, Any]:
        """
        Executes Google OR-Tools CP-SAT solver and extracts scheduled interview slots.
        """
        start_wall_time = time.time()
        
        # Build model and variables
        model, assignment_vars, interview_keys = build_schedule_model(context)

        # Configure solver
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = context.timeout_seconds
        solver.parameters.num_workers = 4

        # Run optimization
        status = solver.Solve(model)
        duration = round(time.time() - start_wall_time, 3)

        status_map = {
            cp_model.OPTIMAL: SolverStatus.OPTIMAL,
            cp_model.FEASIBLE: SolverStatus.FEASIBLE,
            cp_model.INFEASIBLE: SolverStatus.INFEASIBLE,
            cp_model.MODEL_INVALID: SolverStatus.MODEL_INVALID,
            cp_model.UNKNOWN: SolverStatus.UNKNOWN,
        }

        solver_status = status_map.get(status, SolverStatus.UNKNOWN)
        scheduled_interviews = []
        unassigned_keys = []
        slot_lookup = {ts.slot_id: ts for ts in context.time_slots}

        if solver_status in [SolverStatus.OPTIMAL, SolverStatus.FEASIBLE]:
            # Extract assigned decision variables
            for (c_id, r_id, i_id, rm_id, s_id), var in assignment_vars.items():
                if solver.Value(var) == 1:
                    ts = slot_lookup.get(s_id)
                    scheduled_interviews.append({
                        "candidate_id": c_id,
                        "round_id": r_id,
                        "interviewer_ids": [i_id],
                        "room_id": rm_id,
                        "slot_id": s_id,
                        "start_time": ts.start_time.isoformat() if ts else None,
                        "end_time": ts.end_time.isoformat() if ts else None,
                        "status": "SCHEDULED",
                    })

            # Check which requested interview keys were not satisfied
            assigned_c_r = {(item["candidate_id"], item["round_id"]) for item in scheduled_interviews}
            for key in interview_keys:
                if key not in assigned_c_r:
                    unassigned_keys.append(f"Candidate {key[0]} - Round {key[1]}")
        else:
            unassigned_keys = [f"Candidate {k[0]} - Round {k[1]}" for k in interview_keys]

        return {
            "status": solver_status,
            "solver_duration_seconds": duration,
            "objective_value": solver.ObjectiveValue() if solver_status in [SolverStatus.OPTIMAL, SolverStatus.FEASIBLE] else 0.0,
            "interviews": scheduled_interviews,
            "unassigned_interviews": unassigned_keys,
            "total_assigned": len(scheduled_interviews),
            "total_requested": len(interview_keys),
            "diagnostics": {
                "wall_time": f"{duration}s",
                "branches": str(solver.NumBranches()),
                "conflicts": str(solver.NumConflicts()),
                "status_name": solver.StatusName(status),
            }
        }
