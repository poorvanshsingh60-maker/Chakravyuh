from ortools.sat.python import cp_model
from typing import List, Dict, Tuple, Optional
from .models import (
    Candidate, Interviewer, Room, InterviewReq, 
    TimeSlot, PreviousAssignment, ScheduledInterview, SolverResult
)
import os

class SchedulingEngine:
    def __init__(
        self,
        candidates: List[Candidate],
        interviewers: List[Interviewer],
        rooms: List[Room],
        interviews: List[InterviewReq],
        time_horizon: int = 480,      # 8 hours = 480 mins
        time_step: int = 15,          # Discretize into 15-min blocks to save 93% CPU state space
        allow_partial: bool = False,  # If True, schedules as many as possible when strictly infeasible
        previous_schedule: Optional[List[PreviousAssignment]] = None
    ):
        self.model = cp_model.CpModel()
        self.candidates = {c.candidate_id: c for c in candidates}
        self.interviewers = {i.interviewer_id: i for i in interviewers}
        self.rooms = {r.room_id: r for r in rooms}
        self.interviews = {req.interview_id: req for req in interviews}
        
        self.time_horizon = time_horizon
        self.time_step = time_step
        self.allow_partial = allow_partial
        self.previous_schedule = previous_schedule or []

        # Core Decision Variables: (interview_id, interviewer_id, room_id, start_time) -> BoolVar
        self.x: Dict[Tuple[str, str, str, int], cp_model.IntVar] = {}
        
        # Auxiliary Tracking Variables per Interview
        self.interview_start: Dict[str, cp_model.IntVar] = {}
        self.interview_end: Dict[str, cp_model.IntVar] = {}
        self.is_scheduled: Dict[str, cp_model.IntVar] = {}
        self.preference_bonuses: Dict[Tuple[str, str, str, int], int] = {}

    @staticmethod
    def _check_window(slots: List[TimeSlot], start: int, end: int) -> Tuple[bool, bool]:
        """Returns (is_available, is_preferred) for a given time interval [start, end]."""
        for s in slots:
            if s.start_time <= start and end <= s.end_time:
                return True, s.is_preferred
        return False, False

    def build_model(self):
        # =========================================================================
        # PHASE 1: AGGRESSIVE DOMAIN PRUNING (VARIABLE INSTANTIATION)
        # Only create variables for combinations that physically & logically work.
        # =========================================================================
        valid_time_points = range(0, self.time_horizon, self.time_step)

        for int_id, req in self.interviews.items():
            cand = self.candidates.get(req.candidate_id)
            if not cand:
                continue

            # Create master start, end, and presence variables for this interview
            self.interview_start[int_id] = self.model.NewIntVar(0, self.time_horizon, f"start_{int_id}")
            self.interview_end[int_id] = self.model.NewIntVar(0, self.time_horizon, f"end_{int_id}")
            
            if self.allow_partial:
                self.is_scheduled[int_id] = self.model.NewBoolVar(f"sched_{int_id}")
            else:
                self.is_scheduled[int_id] = self.model.NewConstant(1)

            for t in valid_time_points:
                end_t = t + req.duration_minutes
                if end_t > self.time_horizon:
                    continue

                # Prune 1: Is Candidate available during [t, end_t]?
                cand_ok, cand_pref = self._check_window(cand.available_slots, t, end_t)
                if not cand_ok:
                    continue

                for inv_id, inv in self.interviewers.items():
                    # Prune 2: Does Interviewer possess ALL required skills?
                    if not set(req.required_skills).issubset(set(inv.skills)):
                        continue

                    # Prune 3: Is Interviewer available during [t, end_t]?
                    inv_ok, inv_pref = self._check_window(inv.available_slots, t, end_t)
                    if not inv_ok:
                        continue

                    for r_id, room in self.rooms.items():
                        # Prune 4: Does Room meet capacity requirements?
                        if room.capacity < req.required_capacity:
                            continue

                        # Prune 5: Is Room available during [t, end_t]?
                        room_ok, _ = self._check_window(room.available_slots, t, end_t)
                        if not room_ok:
                            continue

                        # Survived all pruning! Create the decision variable.
                        key = (int_id, inv_id, r_id, t)
                        var = self.model.NewBoolVar(f"x_{int_id}_{inv_id}_{r_id}_{t}")
                        self.x[key] = var

                        # Record soft preference score for this valid slot
                        pref_score = (10 if cand_pref else 0) + (10 if inv_pref else 0)
                        if pref_score > 0:
                            self.preference_bonuses[key] = pref_score

        # =========================================================================
        # PHASE 2: MANDATORY HARD CONSTRAINTS
        # =========================================================================
        cand_intervals: Dict[str, List[cp_model.IntervalVar]] = {c: [] for c in self.candidates}
        inv_intervals: Dict[str, List[cp_model.IntervalVar]] = {i: [] for i in self.interviewers}
        room_intervals: Dict[str, List[cp_model.IntervalVar]] = {r: [] for r in self.rooms}
        inv_assignment_vars: Dict[str, List[cp_model.IntVar]] = {i: [] for i in self.interviewers}

        # 1. Assignment Completeness & Channeling Start/End Times
        for int_id, req in self.interviews.items():
            possible_vars = [var for (i_id, _, _, _), var in self.x.items() if i_id == int_id]
            
            if not possible_vars:
                # No valid slots exist at all for this interview
                self.model.Add(self.is_scheduled[int_id] == 0)
                continue

            # Sum of assignments for an interview must equal its scheduled status (1 or 0)
            self.model.Add(sum(possible_vars) == self.is_scheduled[int_id])

            # Link chosen t directly to interview_start and interview_end via linear expression
            self.model.Add(
                self.interview_start[int_id] == sum(
                    t * var for (i_id, _, _, t), var in self.x.items() if i_id == int_id
                )
            )
            self.model.Add(
                self.interview_end[int_id] == self.interview_start[int_id] + req.duration_minutes * self.is_scheduled[int_id]
            )

            # Candidate No-Overlap Interval (1 per interview)
            c_interval = self.model.NewOptionalIntervalVar(
                self.interview_start[int_id],
                req.duration_minutes,
                self.interview_end[int_id],
                self.is_scheduled[int_id],
                f"cand_int_{int_id}"
            )
            cand_intervals[req.candidate_id].append(c_interval)

        # 2. Build Fixed-Size Optional Intervals for Interviewers and Rooms
        for (int_id, inv_id, r_id, t), var in self.x.items():
            dur = self.interviews[int_id].duration_minutes
            
            # Using NewOptionalFixedSizeIntervalVar is much faster in CP-SAT than dynamic start/end vars
            inv_int = self.model.NewOptionalFixedSizeIntervalVar(t, dur, var, f"inv_int_{int_id}_{inv_id}_{t}")
            room_int = self.model.NewOptionalFixedSizeIntervalVar(t, dur, var, f"room_int_{int_id}_{r_id}_{t}")
            
            inv_intervals[inv_id].append(inv_int)
            room_intervals[r_id].append(room_int)
            inv_assignment_vars[inv_id].append(var)

        # 3. Enforce Non-Overlapping Intervals across Candidates, Interviewers, and Rooms
        for c_id, intervals in cand_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        for inv_id, intervals in inv_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        for r_id, intervals in room_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        # 4. Enforce Daily Interviewer Workload Caps (Hard Limit)
        for inv_id, inv in self.interviewers.items():
            if inv_assignment_vars[inv_id]:
                self.model.Add(sum(inv_assignment_vars[inv_id]) <= inv.max_interviews_per_day)

        # 5. Enforce Round Prerequisites (Round 2 must start after Round 1 ends)
        for int_id, req in self.interviews.items():
            prereq_id = req.prerequisite_interview_id
            if prereq_id and prereq_id in self.interviews:
                # If Round 2 is scheduled, Round 1 must be scheduled
                self.model.AddImplication(self.is_scheduled[int_id], self.is_scheduled[prereq_id])
                # Round 2 start_time >= Round 1 end_time
                self.model.Add(
                    self.interview_start[int_id] >= self.interview_end[prereq_id]
                ).OnlyEnforceIf([self.is_scheduled[int_id], self.is_scheduled[prereq_id]])

        # =========================================================================
        # PHASE 3: SOFT CONSTRAINTS & MULTI-OBJECTIVE OPTIMIZATION
        # =========================================================================
        objective_terms = []

        # Objective A: Maximize scheduled interviews (if allow_partial=True, heavily weighted)
        for int_id, sched_var in self.is_scheduled.items():
            objective_terms.append(sched_var * 10000)

        # Objective B: Reward Preferred Time Slots (Candidates & Interviewers)
        for key, bonus in self.preference_bonuses.items():
            objective_terms.append(self.x[key] * bonus)

        # Objective C: Rescheduling Stability (Reward keeping previous valid assignments)
        for prev in self.previous_schedule:
            prev_key = (prev.interview_id, prev.interviewer_id, prev.room_id, prev.start_time)
            if prev_key in self.x:
                objective_terms.append(self.x[prev_key] * 500)

        # Objective D: Interviewer Workload Balancing (Minimize the Maximum Load across interviewers)
        if self.interviewers:
            max_possible_load = max((i.max_interviews_per_day for i in self.interviewers.values()), default=10)
            max_load_var = self.model.NewIntVar(0, max_possible_load, "max_interviewer_load")
            for inv_id in self.interviewers:
                if inv_assignment_vars[inv_id]:
                    self.model.Add(max_load_var >= sum(inv_assignment_vars[inv_id]))
            # Penalize high maximum load so interviews spread evenly across staff
            objective_terms.append(max_load_var * -50)

        # Objective E: Idle Gap Minimization (Minimize daily span [last_end - first_start] per interviewer)
        for inv_id in self.interviewers:
            inv_keys = [k for k in self.x if k[1] == inv_id]
            if len(inv_keys) > 1:
                first_start = self.model.NewIntVar(0, self.time_horizon, f"first_start_{inv_id}")
                last_end = self.model.NewIntVar(0, self.time_horizon, f"last_end_{inv_id}")
                span = self.model.NewIntVar(0, self.time_horizon, f"span_{inv_id}")

                for k in inv_keys:
                    t = k[3]
                    dur = self.interviews[k[0]].duration_minutes
                    self.model.Add(first_start <= t).OnlyEnforceIf(self.x[k])
                    self.model.Add(last_end >= t + dur).OnlyEnforceIf(self.x[k])

                self.model.Add(span >= last_end - first_start)
                # Penalize wide spans to pack interviews tightly together and eliminate idle gaps
                objective_terms.append(span * -1)

        self.model.Maximize(sum(objective_terms))

    def solve(self, time_limit_seconds: float = 15.0) -> SolverResult:
        solver = cp_model.CpSolver()
        
        # Performance & Pruning Configurations
        solver.parameters.max_time_in_seconds = time_limit_seconds
        solver.parameters.num_search_workers = min(8, os.cpu_count() or 4)  # Multi-threaded parallel search
        solver.parameters.relative_gap_limit = 0.01  # Stop early if within 1% of mathematical optimum
        solver.parameters.linearization_level = 2    # Aggressive LP relaxation tightening

        status = solver.Solve(self.model)
        status_name = solver.StatusName(status)

        schedule: List[ScheduledInterview] = []
        unscheduled: List[str] = []
        diagnostics: List[str] = []

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            for (int_id, inv_id, r_id, t), var in self.x.items():
                if solver.BooleanValue(var):
                    req = self.interviews[int_id]
                    schedule.append(
                        ScheduledInterview(
                            interview_id=int_id,
                            candidate_id=req.candidate_id,
                            interviewer_id=inv_id,
                            room_id=r_id,
                            start_time=t,
                            end_time=t + req.duration_minutes
                        )
                    )
            
            scheduled_ids = {s.interview_id for s in schedule}
            for int_id in self.interviews:
                if int_id not in scheduled_ids:
                    unscheduled.append(int_id)
                    diagnostics.append(f"Interview '{int_id}' could not be scheduled due to resource/availability conflicts.")
        else:
            unscheduled = list(self.interviews.keys())
            for int_id in self.interviews:
                has_vars = any(k[0] == int_id for k in self.x)
                if not has_vars:
                    diagnostics.append(
                        f"CRITICAL: Interview '{int_id}' has ZERO valid combinations of (Candidate + Skilled Interviewer + Room) availability."
                    )
            if not diagnostics:
                diagnostics.append("Schedule is strictly INFEASIBLE due to overlapping bottlenecks or prerequisite deadlocks.")

        return SolverResult(
            status=status_name,
            objective_score=solver.ObjectiveValue() if status in (cp_model.OPTIMAL, cp_model.FEASIBLE) else 0.0,
            runtime_seconds=round(solver.WallTime(), 4),
            schedule= sorted(schedule, key=lambda s: s.start_time),
            unscheduled_interviews=unscheduled,
            diagnostics=diagnostics
        )