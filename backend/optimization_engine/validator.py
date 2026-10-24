from typing import List, Tuple
from .models import Candidate, Interviewer, Room, InterviewReq, ScheduledInterview

class ScheduleValidator:
    @staticmethod
    def validate(
        schedule: List[ScheduledInterview],
        candidates: List[Candidate],
        interviewers: List[Interviewer],
        rooms: List[Room],
        interviews: List[InterviewReq]
    ) -> Tuple[bool, List[str]]:
        errors: List[str] = []
        
        cand_map = {c.candidate_id: c for c in candidates}
        inv_map = {i.interviewer_id: i for i in interviewers}
        room_map = {r.room_id: r for r in rooms}
        req_map = {req.interview_id: req for req in interviews}
        sched_map = {s.interview_id: s for s in schedule}

        # 1. Individual Assignment Verification
        for item in schedule:
            req = req_map.get(item.interview_id)
            inv = inv_map.get(item.interviewer_id)
            room = room_map.get(item.room_id)
            cand = cand_map.get(item.candidate_id)

            if not (req and inv and room and cand):
                errors.append(f"Missing reference entity for scheduled interview {item.interview_id}.")
                continue

            # Skill Check
            if not set(req.required_skills).issubset(set(inv.skills)):
                errors.append(f"Skill mismatch in {item.interview_id}: Interviewer {inv.interviewer_id} lacks {req.required_skills}.")

            # Capacity Check
            if room.capacity < req.required_capacity:
                errors.append(f"Room capacity violated in {item.interview_id}: Room {room.room_id} holds {room.capacity}, needs {req.required_capacity}.")

            # Availability Window Checks
            if not any(s.start_time <= item.start_time and item.end_time <= s.end_time for s in cand.available_slots):
                errors.append(f"Candidate {cand.candidate_id} unavailable for {item.interview_id} at [{item.start_time}, {item.end_time}].")
            if not any(s.start_time <= item.start_time and item.end_time <= s.end_time for s in inv.available_slots):
                errors.append(f"Interviewer {inv.interviewer_id} unavailable for {item.interview_id} at [{item.start_time}, {item.end_time}].")
            if not any(s.start_time <= item.start_time and item.end_time <= s.end_time for s in room.available_slots):
                errors.append(f"Room {room.room_id} unavailable for {item.interview_id} at [{item.start_time}, {item.end_time}].")

            # Prerequisite Round Check
            if req.prerequisite_interview_id:
                prereq_sched = sched_map.get(req.prerequisite_interview_id)
                if not prereq_sched:
                    errors.append(f"Prerequisite {req.prerequisite_interview_id} missing for scheduled round {item.interview_id}.")
                elif item.start_time < prereq_sched.end_time:
                    errors.append(f"Round dependency violated: {item.interview_id} starts before {req.prerequisite_interview_id} ends.")

        # 2. Pairwise Overlap Detection
        n = len(schedule)
        for i in range(n):
            for j in range(i + 1, n):
                a, b = schedule[i], schedule[j]
                # Two intervals [startA, endA] and [startB, endB] overlap if max(startA, startB) < min(endA, endB)
                if max(a.start_time, b.start_time) < min(a.end_time, b.end_time):
                    if a.candidate_id == b.candidate_id:
                        errors.append(f"Candidate overlap: {a.candidate_id} in both {a.interview_id} and {b.interview_id}.")
                    if a.interviewer_id == b.interviewer_id:
                        errors.append(f"Interviewer overlap: {a.interviewer_id} in both {a.interview_id} and {b.interview_id}.")
                    if a.room_id == b.room_id:
                        errors.append(f"Room overlap: {a.room_id} double-booked for {a.interview_id} and {b.interview_id}.")

        return (len(errors) == 0), errors