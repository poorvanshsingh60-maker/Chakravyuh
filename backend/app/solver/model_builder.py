from typing import Dict, List, Tuple
from ortools.sat.python import cp_model
from app.solver.context import SchedulingContext
from app.solver.hard_constraints import (
    add_no_overlap_constraints,
    add_single_assignment_constraints,
    add_round_prerequisite_constraints,
    add_interviewer_capacity_constraints,
)
from app.solver.soft_objectives import add_soft_objectives


def build_schedule_model(context: SchedulingContext) -> Tuple[cp_model.CpModel, Dict[Tuple[str, str, str, str, int], cp_model.IntVar], List[Tuple[str, str]]]:
    """
    Builds Google OR-Tools CP-SAT model for interview scheduling.
    Returns (model, assignment_vars, interview_keys).
    """
    model = cp_model.CpModel()
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar] = {}
    interview_keys: List[Tuple[str, str]] = []

    # Map rounds
    rounds_by_id = {r["id"]: r for r in context.rounds}

    # Identify pairs of (candidate, round) that need scheduling
    for cand in context.candidates:
        c_id = cand["id"]
        completed = set(cand.get("completed_round_ids", []))
        
        for r_id, round_info in rounds_by_id.items():
            if r_id in completed:
                continue
            interview_keys.append((c_id, r_id))
            required_skills = set(round_info.get("required_skills", []))

            # Filter valid interviewers by skills
            valid_interviewers = []
            for interviewer in context.interviewers:
                i_id = interviewer["id"]
                i_skills = context.interviewer_skills.get(i_id, set())
                # If round has skills, interviewer must cover them (or at least 1 if empty)
                if not required_skills or required_skills.issubset(i_skills):
                    valid_interviewers.append(i_id)

            # Filter valid rooms (active & capacity >= 2)
            valid_rooms = [rm["id"] for rm in context.rooms if rm.get("is_active", True) and rm.get("capacity", 4) >= 2]
            if not valid_rooms and context.rooms:
                valid_rooms = [context.rooms[0]["id"]]

            # Candidate available slots
            cand_slots = context.candidate_availability_slots.get(c_id, set())
            if not cand_slots:
                # If no specific restriction, all slots valid
                cand_slots = {ts.slot_id for ts in context.time_slots}

            for i_id in valid_interviewers:
                i_slots = context.interviewer_availability_slots.get(i_id, set())
                if not i_slots:
                    i_slots = {ts.slot_id for ts in context.time_slots}

                # Intersection of candidate & interviewer slots
                common_slots = cand_slots.intersection(i_slots)

                for rm_id in valid_rooms:
                    for s_id in common_slots:
                        var_name = f"assign_c{c_id}_r{r_id}_i{i_id}_rm{rm_id}_s{s_id}"
                        var = model.NewBoolVar(var_name)
                        assignment_vars[(c_id, r_id, i_id, rm_id, s_id)] = var

    # Apply Hard Constraints
    add_no_overlap_constraints(model, assignment_vars, context, interview_keys)
    add_single_assignment_constraints(model, assignment_vars, interview_keys)
    add_round_prerequisite_constraints(model, assignment_vars, context)
    add_interviewer_capacity_constraints(model, assignment_vars, context)

    # Apply Soft Objectives
    add_soft_objectives(model, assignment_vars, context)

    return model, assignment_vars, interview_keys
