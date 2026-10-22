from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple


def parse_dt(val: Any) -> datetime:
    if isinstance(val, datetime):
        return val
    return datetime.fromisoformat(str(val))


def check_candidate_no_overlap(interviews: List[Dict]) -> List[str]:
    """Verify that no candidate has two overlapping interviews."""
    violations = []
    # Group by candidate
    by_candidate: Dict[str, List[Dict]] = {}
    for inv in interviews:
        by_candidate.setdefault(inv["candidate_id"], []).append(inv)

    for cand_id, invs in by_candidate.items():
        sorted_invs = sorted(invs, key=lambda x: parse_dt(x["start_time"]))
        for i in range(len(sorted_invs) - 1):
            curr_end = parse_dt(sorted_invs[i]["end_time"])
            next_start = parse_dt(sorted_invs[i + 1]["start_time"])
            if curr_end > next_start:
                violations.append(
                    f"Candidate {cand_id} double-booked: interview {sorted_invs[i].get('id', i)} ends at {curr_end} after interview {sorted_invs[i+1].get('id', i+1)} starts at {next_start}"
                )
    return violations


def check_interviewer_no_overlap(interviews: List[Dict]) -> List[str]:
    """Verify that no interviewer has two overlapping interviews."""
    violations = []
    by_interviewer: Dict[str, List[Dict]] = {}
    for inv in interviews:
        for i_id in inv.get("interviewer_ids", []):
            by_interviewer.setdefault(i_id, []).append(inv)

    for i_id, invs in by_interviewer.items():
        sorted_invs = sorted(invs, key=lambda x: parse_dt(x["start_time"]))
        for i in range(len(sorted_invs) - 1):
            curr_end = parse_dt(sorted_invs[i]["end_time"])
            next_start = parse_dt(sorted_invs[i + 1]["start_time"])
            if curr_end > next_start:
                violations.append(
                    f"Interviewer {i_id} double-booked between {curr_end} and {next_start}"
                )
    return violations


def check_room_no_overlap(interviews: List[Dict]) -> List[str]:
    """Verify that no physical room has two overlapping interviews."""
    violations = []
    by_room: Dict[str, List[Dict]] = {}
    for inv in interviews:
        r_id = inv.get("room_id")
        if r_id:
            by_room.setdefault(r_id, []).append(inv)

    for r_id, invs in by_room.items():
        sorted_invs = sorted(invs, key=lambda x: parse_dt(x["start_time"]))
        for i in range(len(sorted_invs) - 1):
            curr_end = parse_dt(sorted_invs[i]["end_time"])
            next_start = parse_dt(sorted_invs[i + 1]["start_time"])
            if curr_end > next_start:
                violations.append(
                    f"Room {r_id} double-booked between {curr_end} and {next_start}"
                )
    return violations


def check_round_prerequisites(interviews: List[Dict], rounds: List[Dict]) -> List[str]:
    """Verify that all prerequisite rounds start before dependent rounds."""
    violations = []
    prereqs = {r["id"]: r.get("prerequisite_round_ids", []) for r in rounds}
    
    # Candidate -> round_id -> start_time
    cand_round_times: Dict[str, Dict[str, datetime]] = {}
    for inv in interviews:
        cand_id = inv["candidate_id"]
        round_id = inv["round_id"]
        cand_round_times.setdefault(cand_id, {})[round_id] = parse_dt(inv["start_time"])

    for cand_id, round_map in cand_round_times.items():
        for round_id, start in round_map.items():
            for p_id in prereqs.get(round_id, []):
                if p_id in round_map:
                    p_start = round_map[p_id]
                    if p_start >= start:
                        violations.append(
                            f"Candidate {cand_id} round {round_id} starts at {start} before prerequisite {p_id} at {p_start}"
                        )
    return violations
