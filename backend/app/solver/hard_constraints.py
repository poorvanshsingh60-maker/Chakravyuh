from typing import Dict, List, Tuple
from ortools.sat.python import cp_model
from app.solver.context import SchedulingContext


def add_no_overlap_constraints(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    context: SchedulingContext,
    interview_keys: List[Tuple[str, str]], # (cand_id, round_id)
):
    """
    Ensure no candidate, interviewer, or room has more than 1 interview per time slot.
    assignment_vars key: (candidate_id, round_id, interviewer_id, room_id, slot_id)
    """
    slot_ids = [ts.slot_id for ts in context.time_slots]
    
    # 1. Candidate no-overlap: at most 1 interview per slot per candidate
    for cand in context.candidates:
        c_id = cand["id"]
        for s_id in slot_ids:
            cand_slot_vars = [
                var for (c, r, i, rm, s), var in assignment_vars.items()
                if c == c_id and s == s_id
            ]
            if cand_slot_vars:
                model.Add(sum(cand_slot_vars) <= 1)

    # 2. Interviewer no-overlap: at most 1 interview per slot per interviewer
    for interviewer in context.interviewers:
        i_id = interviewer["id"]
        for s_id in slot_ids:
            interviewer_slot_vars = [
                var for (c, r, i, rm, s), var in assignment_vars.items()
                if i == i_id and s == s_id
            ]
            if interviewer_slot_vars:
                model.Add(sum(interviewer_slot_vars) <= 1)

    # 3. Room no-overlap: at most 1 interview per slot per room
    for room in context.rooms:
        rm_id = room["id"]
        for s_id in slot_ids:
            room_slot_vars = [
                var for (c, r, i, rm, s), var in assignment_vars.items()
                if rm == rm_id and s == s_id
            ]
            if room_slot_vars:
                model.Add(sum(room_slot_vars) <= 1)


def add_single_assignment_constraints(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    interview_keys: List[Tuple[str, str]],
):
    """Each candidate-round pair must be scheduled exactly once (or at most once)."""
    for (cand_id, round_id) in interview_keys:
        interviews_for_pair = [
            var for (c, r, i, rm, s), var in assignment_vars.items()
            if c == cand_id and r == round_id
        ]
        if interviews_for_pair:
            model.Add(sum(interviews_for_pair) == 1)


def add_round_prerequisite_constraints(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    context: SchedulingContext,
):
    """
    Ensure that if round B requires round A, slot_B > slot_A.
    """
    round_order = {r["id"]: r.get("order_index", 0) for r in context.rounds}
    prereqs = {r["id"]: r.get("prerequisite_round_ids", []) for r in context.rounds}

    for cand in context.candidates:
        c_id = cand["id"]
        for r_id, p_list in prereqs.items():
            for p_id in p_list:
                # slot for prereq round
                p_slot_terms = [
                    s * var for (c, r, i, rm, s), var in assignment_vars.items()
                    if c == c_id and r == p_id
                ]
                # slot for current round
                curr_slot_terms = [
                    s * var for (c, r, i, rm, s), var in assignment_vars.items()
                    if c == c_id and r == r_id
                ]
                if p_slot_terms and curr_slot_terms:
                    model.Add(sum(curr_slot_terms) > sum(p_slot_terms))


def add_interviewer_capacity_constraints(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    context: SchedulingContext,
):
    """Enforce interviewer max daily interview count."""
    # Group slots by date
    slots_by_date: Dict[str, List[int]] = {}
    for ts in context.time_slots:
        slots_by_date.setdefault(ts.date_str, []).append(ts.slot_id)

    for interviewer in context.interviewers:
        i_id = interviewer["id"]
        max_daily = interviewer.get("max_interviews_per_day", 4)

        for date_str, slot_list in slots_by_date.items():
            daily_vars = [
                var for (c, r, i, rm, s), var in assignment_vars.items()
                if i == i_id and s in slot_list
            ]
            if daily_vars:
                model.Add(sum(daily_vars) <= max_daily)
