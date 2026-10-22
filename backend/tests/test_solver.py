import pytest
from app.solver.scheduler_engine import SchedulerEngine
from app.models.enums import SolverStatus


def test_solver_feasible_schedule(mock_scheduling_context):
    engine = SchedulerEngine(timeout_seconds=10)
    result = engine.solve(mock_scheduling_context)
    
    assert result["status"] in [SolverStatus.OPTIMAL, SolverStatus.FEASIBLE]
    assert result["total_assigned"] > 0
    assert len(result["interviews"]) == result["total_assigned"]
    assert result["solver_duration_seconds"] >= 0


def test_solver_no_overlaps_in_output(mock_scheduling_context):
    engine = SchedulerEngine(timeout_seconds=10)
    result = engine.solve(mock_scheduling_context)
    interviews = result["interviews"]
    
    # Check candidate overlaps
    cand_slots = {}
    for inv in interviews:
        cand_id = inv["candidate_id"]
        slot_id = inv["slot_id"]
        assert slot_id not in cand_slots.get(cand_id, set()), f"Candidate {cand_id} overlapped on slot {slot_id}"
        cand_slots.setdefault(cand_id, set()).add(slot_id)

    # Check interviewer overlaps
    int_slots = {}
    for inv in interviews:
        for i_id in inv["interviewer_ids"]:
            slot_id = inv["slot_id"]
            assert slot_id not in int_slots.get(i_id, set()), f"Interviewer {i_id} overlapped on slot {slot_id}"
            int_slots.setdefault(i_id, set()).add(slot_id)
