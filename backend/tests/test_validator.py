from datetime import datetime
from app.validator.schedule_validator import ScheduleValidator
from app.validator.rules import (
    check_candidate_no_overlap,
    check_interviewer_no_overlap,
    check_round_prerequisites,
)


def test_validator_detects_candidate_overlap():
    interviews = [
        {
            "candidate_id": "c1",
            "round_id": "r1",
            "start_time": datetime(2026, 10, 26, 9, 0),
            "end_time": datetime(2026, 10, 26, 10, 0),
        },
        {
            "candidate_id": "c1",
            "round_id": "r2",
            "start_time": datetime(2026, 10, 26, 9, 30), # Overlaps with r1
            "end_time": datetime(2026, 10, 26, 10, 30),
        },
    ]
    violations = check_candidate_no_overlap(interviews)
    assert len(violations) == 1
    assert "Candidate c1 double-booked" in violations[0]


def test_validator_detects_interviewer_overlap():
    interviews = [
        {
            "candidate_id": "c1",
            "interviewer_ids": ["int_1"],
            "round_id": "r1",
            "start_time": datetime(2026, 10, 26, 9, 0),
            "end_time": datetime(2026, 10, 26, 10, 0),
        },
        {
            "candidate_id": "c2",
            "interviewer_ids": ["int_1"],
            "round_id": "r1",
            "start_time": datetime(2026, 10, 26, 9, 30),
            "end_time": datetime(2026, 10, 26, 10, 30),
        },
    ]
    violations = check_interviewer_no_overlap(interviews)
    assert len(violations) == 1
    assert "Interviewer int_1 double-booked" in violations[0]


def test_validator_detects_prerequisite_violation():
    rounds = [
        {"id": "r1", "name": "Screen", "prerequisite_round_ids": []},
        {"id": "r2", "name": "Onsite", "prerequisite_round_ids": ["r1"]},
    ]
    interviews = [
        {
            "candidate_id": "c1",
            "round_id": "r2", # starts earlier than r1
            "start_time": datetime(2026, 10, 26, 9, 0),
            "end_time": datetime(2026, 10, 26, 10, 0),
        },
        {
            "candidate_id": "c1",
            "round_id": "r1",
            "start_time": datetime(2026, 10, 26, 11, 0),
            "end_time": datetime(2026, 10, 26, 12, 0),
        },
    ]
    violations = check_round_prerequisites(interviews, rounds)
    assert len(violations) == 1
    assert "before prerequisite r1" in violations[0]


def test_schedule_validator_valid_schedule():
    validator = ScheduleValidator()
    interviews = [
        {
            "candidate_id": "c1",
            "interviewer_ids": ["i1"],
            "room_id": "rm1",
            "round_id": "r1",
            "start_time": datetime(2026, 10, 26, 9, 0),
            "end_time": datetime(2026, 10, 26, 10, 0),
        },
        {
            "candidate_id": "c1",
            "interviewer_ids": ["i2"],
            "room_id": "rm2",
            "round_id": "r2",
            "start_time": datetime(2026, 10, 26, 10, 0),
            "end_time": datetime(2026, 10, 26, 11, 0),
        },
    ]
    result = validator.validate(interviews)
    assert result.is_valid is True
    assert len(result.errors) == 0
