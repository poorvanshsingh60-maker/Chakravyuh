from typing import Dict, List, Tuple
from ortools.sat.python import cp_model
from app.solver.context import SchedulingContext


def add_soft_objectives(
    model: cp_model.CpModel,
    assignment_vars: Dict[Tuple[str, str, str, str, int], cp_model.IntVar],
    context: SchedulingContext,
):
    """
    Construct objective function terms:
    - Prefer earlier slots (small weight)
    - Workload balancing across interviewers
    """
    objective_terms = []

    # 1. Slot lateness penalty (encourages compact scheduling)
    if context.minimize_idle_time:
        for (c, r, i, rm, s), var in assignment_vars.items():
            # Linear penalty for later slots
            objective_terms.append(s * var * 2)

    # 2. Workload balance: track interview count per interviewer
    if context.balance_workload and len(context.interviewers) > 1:
        load_vars = []
        for interviewer in context.interviewers:
            i_id = interviewer["id"]
            interviews_for_i = [
                var for (c, r, i, rm, s), var in assignment_vars.items()
                if i == i_id
            ]
            load_var = model.NewIntVar(0, len(context.time_slots), f"load_{i_id}")
            if interviews_for_i:
                model.Add(load_var == sum(interviews_for_i))
            else:
                model.Add(load_var == 0)
            load_vars.append(load_var)

        # Minimize max load across interviewers
        max_load = model.NewIntVar(0, len(context.time_slots), "max_interviewer_load")
        for lv in load_vars:
            model.Add(max_load >= lv)
        objective_terms.append(max_load * 20)

    if objective_terms:
        model.Minimize(sum(objective_terms))
