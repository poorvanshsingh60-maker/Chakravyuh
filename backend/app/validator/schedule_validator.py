from dataclasses import dataclass, field
from typing import Dict, List, Optional
from app.validator.rules import (
    check_candidate_no_overlap,
    check_interviewer_no_overlap,
    check_room_no_overlap,
    check_round_prerequisites,
)


@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class ScheduleValidator:
    """
    Independent Schedule Verification Engine prior to publishing or persisting.
    """
    def __init__(self, rounds: Optional[List[Dict]] = None):
        self.rounds = rounds or []

    def validate(self, interviews: List[Dict]) -> ValidationResult:
        errors: List[str] = []
        warnings: List[str] = []

        # 1. Candidate no-overlap
        c_errors = check_candidate_no_overlap(interviews)
        errors.extend(c_errors)

        # 2. Interviewer no-overlap
        i_errors = check_interviewer_no_overlap(interviews)
        errors.extend(i_errors)

        # 3. Room no-overlap
        r_errors = check_room_no_overlap(interviews)
        errors.extend(r_errors)

        # 4. Prerequisite dependencies
        if self.rounds:
            p_errors = check_round_prerequisites(interviews, self.rounds)
            errors.extend(p_errors)

        # 5. Check if unassigned rooms
        for inv in interviews:
            if not inv.get("room_id"):
                warnings.append(f"Interview for candidate {inv['candidate_id']} round {inv['round_id']} has no room assigned")

        is_valid = len(errors) == 0
        return ValidationResult(is_valid=is_valid, errors=errors, warnings=warnings)
