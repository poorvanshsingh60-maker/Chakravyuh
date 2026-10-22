import pytest
from datetime import datetime, date, timedelta
from app.solver.context import SchedulingContext, TimeSlotUnit


@pytest.fixture
def mock_scheduling_context():
    # 2 candidates, 2 interviewers, 2 rooms, 2 rounds, 10 slots
    now = datetime(2026, 10, 26, 9, 0)
    slots = [
        TimeSlotUnit(
            slot_id=i,
            start_time=now + timedelta(hours=i),
            end_time=now + timedelta(hours=i + 1),
            date_str="2026-10-26"
        )
        for i in range(8)
    ]

    candidates = [
        {"id": "cand_1", "email": "c1@test.com", "full_name": "Alice Smith", "skills": ["Python"], "completed_round_ids": []},
        {"id": "cand_2", "email": "c2@test.com", "full_name": "Bob Jones", "skills": ["React"], "completed_round_ids": []},
    ]

    interviewers = [
        {"id": "int_1", "email": "i1@test.com", "full_name": "Dr. Eve", "skills": ["Python", "DSA"], "max_interviews_per_day": 4},
        {"id": "int_2", "email": "i2@test.com", "full_name": "Dr. Frank", "skills": ["System Design", "Python"], "max_interviews_per_day": 4},
    ]

    rooms = [
        {"id": "room_1", "name": "Room A", "capacity": 4, "is_active": True},
        {"id": "room_2", "name": "Room B", "capacity": 4, "is_active": True},
    ]

    rounds = [
        {"id": "round_1", "name": "Round 1 - Technical", "order_index": 1, "duration_minutes": 60, "required_skills": ["Python"], "prerequisite_round_ids": []},
        {"id": "round_2", "name": "Round 2 - Architecture", "order_index": 2, "duration_minutes": 60, "required_skills": ["System Design"], "prerequisite_round_ids": ["round_1"]},
    ]

    return SchedulingContext(
        candidates=candidates,
        interviewers=interviewers,
        rooms=rooms,
        rounds=rounds,
        time_slots=slots,
        interviewer_skills={
            "int_1": {"Python", "DSA"},
            "int_2": {"System Design", "Python"},
        },
        timeout_seconds=10,
        minimize_idle_time=True,
        balance_workload=True,
    )
