from typing import Dict, List, Tuple
from ortools.sat.python import cp_model


def add_churn_penalty_objective(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    previous_assignments: List[Dict], # list of previous interview mappings
    churn_penalty_weight: int = 50,
):
    """
    Applies penalty to the objective function when an assignment deviates from previous schedule.
    Helps avoid disruptive changes during delta schedule updates.
    """
    churn_terms = []
    
    # Map previous assignments: (candidate_id, round_id) -> (interviewer_id, room_id, slot_id)
    prev_map = {
        (p["candidate_id"], p["round_id"]): (p.get("interviewer_id"), p.get("room_id"), p.get("slot_id"))
        for p in previous_assignments
    }

    for (c, r, i, rm, s), var in assignment_vars.items():
        prev = prev_map.get((c, r))
        if prev:
            prev_i, prev_rm, prev_s = prev
            # If this assignment is the SAME as previous, bonus (or penalty for 1 - var)
            if i == prev_i and rm == prev_rm and s == prev_s:
                # Encourage keeping this assignment: penalize (1 - var)
                churn_terms.append((1 - var) * churn_penalty_weight)

    return churn_terms
