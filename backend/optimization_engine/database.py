import sqlite3
import json
import os
import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "chakravyuh.db")

def get_db_connection() -> sqlite3.Connection:
    """Returns a thread-safe connection to the SQLite database with row factory."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    """Initializes tables and seeds initial data if database is empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Candidates Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT DEFAULT 'Engineering',
        stage TEXT DEFAULT 'Technical Loop',
        recruiter TEXT DEFAULT 'T&P Coordinator Emma',
        status TEXT DEFAULT 'NEEDS_SCHEDULING',
        applied_date TEXT,
        scheduled_date TEXT,
        rating REAL DEFAULT 0.0,
        available_slots TEXT DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 2. Interviewers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interviewers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT DEFAULT '',
        role TEXT NOT NULL,
        team TEXT NOT NULL,
        skills TEXT NOT NULL DEFAULT '[]',
        weekly_capacity INTEGER DEFAULT 6,
        scheduled_this_week INTEGER DEFAULT 0,
        training_level TEXT DEFAULT 'Level 1 (Qualified)',
        status TEXT DEFAULT 'ACTIVE',
        available_slots TEXT DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 3. Jobs / Placement Positions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        openings INTEGER DEFAULT 1,
        active_candidates INTEGER DEFAULT 0,
        rounds TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 4. Rooms / Virtual Labs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER DEFAULT 4,
        is_virtual INTEGER DEFAULT 0,
        available_slots TEXT DEFAULT '[]',
        created_at TEXT NOT NULL
    );
    """)

    # 5. Master Schedules Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        version TEXT NOT NULL DEFAULT 'v2.4',
        status TEXT NOT NULL DEFAULT 'DRAFT',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        sessions TEXT NOT NULL DEFAULT '[]',
        diagnostics TEXT NOT NULL DEFAULT '{}',
        published_at TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 6. Interview Scorecards / Evaluations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        interview_id TEXT NOT NULL,
        candidate_id TEXT,
        candidate_name TEXT NOT NULL,
        interviewer_id TEXT,
        interviewer_name TEXT NOT NULL,
        round_name TEXT NOT NULL,
        decision TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        problem_solving_rating INTEGER DEFAULT 5,
        architecture_rating INTEGER DEFAULT 4,
        communication_rating INTEGER DEFAULT 5,
        strengths TEXT,
        growth_areas TEXT,
        notes TEXT,
        submitted_at TEXT NOT NULL
    );
    """)

    # 7. Coordination Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sender_name TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        recipient_role TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'DIRECT',
        is_read INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL
    );
    """)

    # 8. Tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        candidate_name TEXT NOT NULL,
        role TEXT NOT NULL,
        round_name TEXT NOT NULL,
        due_date TEXT NOT NULL,
        due_time TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        priority TEXT NOT NULL DEFAULT 'MEDIUM',
        interviewer_name TEXT NOT NULL,
        user_id TEXT DEFAULT 'ALL',
        created_at TEXT NOT NULL
    );
    """)

    conn.commit()

    # Seed Initial Data if tables are empty
    seed_initial_data(conn)
    conn.close()


def seed_initial_data(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM candidates;")
    if cursor.fetchone()[0] > 0:
        return  # Database already seeded

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # 1. Seed Candidates
    initial_candidates = [
        ("cand-1", "Marcus Vance", "marcus.vance@gmail.com", "B.Tech CSE (Reg: 20214012) — Google SDE", "Computer Science", "Technical Loop", "T&P Coordinator Emma", "SCHEDULED", "Oct 20, 2026", "Oct 26, 2026 (CCF Lab 1)", 4.9, json.dumps([{"start_time": 0, "end_time": 480, "is_preferred": True}]), now, now),
        ("cand-2", "Priya Sharma", "priya.sharma@mnnit.ac.in", "B.Tech IT (Reg: 20214088) — Atlassian Core", "Information Tech", "Technical Loop", "T&P Coordinator Emma", "SCHEDULED", "Oct 21, 2026", "Oct 26, 2026 (CCF Lab 2)", 4.8, json.dumps([{"start_time": 30, "end_time": 480, "is_preferred": True}]), now, now),
        ("cand-3", "Rahul Verma", "rahul.verma@mnnit.ac.in", "B.Tech ECE (Reg: 20215045) — Microsoft Cloud", "Electronics & Comm", "Recruiter Screen", "T&P Coordinator Emma", "NEEDS_SCHEDULING", "Oct 22, 2026", None, 0.0, json.dumps([{"start_time": 0, "end_time": 360, "is_preferred": False}]), now, now),
        ("cand-4", "Ananya Patel", "ananya.patel@mnnit.ac.in", "B.Tech CSE (Reg: 20214056) — Oracle Systems", "Computer Science", "Executive Review", "T&P Coordinator Emma", "DECISION_PENDING", "Oct 18, 2026", "Oct 27, 2026 (LHC Hall)", 4.7, json.dumps([{"start_time": 60, "end_time": 480, "is_preferred": True}]), now, now),
        ("cand-5", "Rohan Gupta", "rohan.gupta@mnnit.ac.in", "B.Tech CSE (Reg: 20214110) — Goldman Sachs SDE", "Computer Science", "Technical Loop", "T&P Coordinator Emma", "NEEDS_SCHEDULING", "Oct 23, 2026", None, 0.0, json.dumps([{"start_time": 0, "end_time": 480, "is_preferred": True}]), now, now),
    ]
    cursor.executemany("""
    INSERT INTO candidates (id, name, email, role, department, stage, recruiter, status, applied_date, scheduled_date, rating, available_slots, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, initial_candidates)

    # 2. Seed Interviewers
    initial_interviewers = [
        ("int-1", "Dr. Sarah Chen", "sarah.chen@google.com", "", "Staff Distributed Systems Engineer", "Google SDE Panel", json.dumps(["DSA", "Python", "Algorithms", "High Concurrency"]), 8, 4, "Level 2 (Lead)", "ACTIVE", json.dumps({"Monday-10": True, "Monday-11": True, "Tuesday-10": True, "Wednesday-14": True}), now, now),
        ("int-2", "Phil Dunphy", "phil.dunphy@atlassian.com", "", "Principal Architect", "Atlassian Panel", json.dumps(["System Design", "Core CS", "Distributed Storage", "Raft"]), 6, 3, "Level 1 (Qualified)", "ACTIVE", json.dumps({"Monday-14": True, "Tuesday-14": True, "Wednesday-15": True}), now, now),
        ("int-3", "Alex Rivera", "alex.rivera@microsoft.com", "", "Senior Staff Engineer", "Microsoft Cloud Panel", json.dumps(["Cloud Architecture", "Core Systems", "Raft", "Distributed DB"]), 5, 2, "Level 1 (Qualified)", "ACTIVE", json.dumps({"Tuesday-9": True, "Thursday-10": True, "Friday-14": True}), now, now),
        ("int-4", "Claire Pritchett", "claire.pritchett@oracle.com", "", "Talent Lead & Evaluator", "Talent Operations Committee", json.dumps(["Executive Evaluation", "Values Calibration", "Leadership"]), 4, 2, "Level 2 (Lead)", "ACTIVE", json.dumps({"Monday-11": True, "Wednesday-10": True, "Friday-15": True}), now, now),
    ]
    cursor.executemany("""
    INSERT INTO interviewers (id, name, email, avatar, role, team, skills, weekly_capacity, scheduled_this_week, training_level, status, available_slots, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, initial_interviewers)

    # 3. Seed Job Positions
    initial_jobs = [
        ("job-1", "Google SDE (L3/L4 Campus Drive)", "Core Engineering", "Bangalore / Hyderabad", 4, 15, json.dumps([
            {"id": "r1", "name": "Round 1: DSA & Problem Solving", "duration": 45, "required_skills": ["DSA", "Algorithms"], "round_order": 1, "prerequisite_round_id": None},
            {"id": "r2", "name": "Round 2: Systems Architecture", "duration": 60, "required_skills": ["System Design", "Core CS"], "round_order": 2, "prerequisite_round_id": "r1"},
            {"id": "r3", "name": "Round 3: Googleyness & Leadership", "duration": 30, "required_skills": ["Leadership"], "round_order": 3, "prerequisite_round_id": "r2"}
        ]), now, now),
        ("job-2", "Atlassian Core Backend Engineer", "Platform Systems", "Bangalore / Remote", 3, 10, json.dumps([
            {"id": "r1", "name": "Round 1: Coding & Concurrency", "duration": 45, "required_skills": ["DSA", "Python"], "round_order": 1, "prerequisite_round_id": None},
            {"id": "r2", "name": "Round 2: Distributed Systems Design", "duration": 60, "required_skills": ["Distributed Storage", "System Design"], "round_order": 2, "prerequisite_round_id": "r1"}
        ]), now, now),
        ("job-3", "Oracle Systems & Cloud Engineer", "Infrastructure", "Hyderabad", 2, 8, json.dumps([
            {"id": "r1", "name": "Round 1: Core Fundamentals", "duration": 45, "required_skills": ["Core CS", "Algorithms"], "round_order": 1, "prerequisite_round_id": None},
            {"id": "r2", "name": "Round 2: Cloud Infrastructure", "duration": 60, "required_skills": ["Cloud Architecture"], "round_order": 2, "prerequisite_round_id": "r1"}
        ]), now, now),
    ]
    cursor.executemany("""
    INSERT INTO jobs (id, title, department, location, openings, active_candidates, rounds, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, initial_jobs)

    # 4. Seed Rooms
    initial_rooms = [
        ("room-1", "CCF Lab 1 (Terminal 12)", "CCF Ground Floor", 4, 0, json.dumps([{"start_time": 0, "end_time": 480}]), now),
        ("room-2", "CCF Lab 2 (Terminal 08)", "CCF Ground Floor", 4, 0, json.dumps([{"start_time": 0, "end_time": 480}]), now),
        ("room-3", "LHC Seminar Hall 102", "Lecture Hall Complex", 6, 0, json.dumps([{"start_time": 0, "end_time": 480}]), now),
        ("room-4", "T&P Boardroom", "Administrative Block", 8, 0, json.dumps([{"start_time": 0, "end_time": 480}]), now),
        ("room-5", "Virtual Pod Alpha", "Online / Google Meet", 10, 1, json.dumps([{"start_time": 0, "end_time": 480}]), now),
    ]
    cursor.executemany("""
    INSERT INTO rooms (id, name, location, capacity, is_virtual, available_slots, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, initial_rooms)

    # 5. Seed Messages
    initial_messages = [
        ("msg-1", "Emma Watson", "Lead Coordinator", "Marcus Vance", "CANDIDATE", "Welcome to Google SDE Technical Loop — Schedule Confirmation", "Hi Marcus, your technical interview timetable has been confirmed across 3 rounds. All virtual meeting links and preparation packets are attached.", "SCHEDULED_CONFIRMATION", 0, "Today, 9:00 AM"),
        ("msg-2", "Emma Watson", "Lead Coordinator", "Dr. Sarah Chen", "INTERVIEWER", "Scorecard Evaluation Reminder for Marcus Vance", "Hi Sarah, please complete your scorecard evaluation for Marcus Vance (Round 1: Problem Solving & DSA Screen) to unblock loop advancement.", "NUDGE", 0, "Today, 10:30 AM"),
        ("msg-3", "Emma Watson", "Lead Coordinator", "Claire Pritchett", "INTERVIEWER", "New Panel Assignment: Product Design Onsite with Marcus Vance", "Hi Claire, you have been assigned as the Bar Raiser for Marcus Vance in T&P Boardroom.", "INVITE", 1, "Today, 11:15 AM")
    ]
    cursor.executemany("""
    INSERT INTO messages (id, sender_name, sender_role, recipient_name, recipient_role, subject, body, type, is_read, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, initial_messages)

    # 6. Seed Tasks
    initial_tasks = [
        ("task-1", "Submit Scorecard for Marcus Vance (Google SDE Loop)", "Marcus Vance", "B.Tech CSE — Software Engineer (L3)", "Round 1: DSA & Problem Solving", "Today", "5:00 PM", "SCORECARD", "PENDING", "HIGH", "Dr. Sarah Chen (Google)", "ALL", now),
        ("task-2", "Confirm CCF Lab 2 Interview Slots for Atlassian Drive", "Priya Sharma", "B.Tech IT — Backend Engineer", "Round 2: Distributed Systems", "Today", "6:30 PM", "RESCHEDULE", "PENDING", "HIGH", "Phil Dunphy (Atlassian)", "ALL", now),
        ("task-3", "Verify LHC Hall 102 Room Booking for Microsoft Loops", "Rahul Verma", "B.Tech ECE — Embedded Systems", "Round 1: Core Fundamentals", "Tomorrow", "11:00 AM", "SHADOW_REVIEW", "PENDING", "MEDIUM", "Alex Rivera (Microsoft)", "ALL", now),
    ]
    cursor.executemany("""
    INSERT INTO tasks (id, title, candidate_name, role, round_name, due_date, due_time, type, status, priority, interviewer_name, user_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, initial_tasks)

    conn.commit()


# =========================================================================
# CRUD Operations Helper Functions
# =========================================================================

# --- Candidates ---
def db_get_all_candidates() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM candidates ORDER BY created_at DESC;").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["available_slots"] = json.loads(d.get("available_slots") or "[]")
        result.append(d)
    return result

def db_get_candidate(cand_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM candidates WHERE id = ?;", (cand_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["available_slots"] = json.loads(d.get("available_slots") or "[]")
    return d

def db_create_candidate(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    cand_id = data.get("id") or f"cand-{int(datetime.datetime.now().timestamp() * 1000)}"
    slots_json = json.dumps(data.get("available_slots") or [{"start_time": 0, "end_time": 480, "is_preferred": True}])

    conn.execute("""
    INSERT INTO candidates (id, name, email, role, department, stage, recruiter, status, applied_date, scheduled_date, rating, available_slots, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        cand_id,
        data.get("name") or "Candidate",
        data.get("email") or f"{cand_id}@example.com",
        data.get("role") or "Software Engineer",
        data.get("department") or "Engineering",
        data.get("stage") or "Technical Loop",
        data.get("recruiter") or "T&P Coordinator Emma",
        data.get("status") or "NEEDS_SCHEDULING",
        data.get("applied_date") or "Just now",
        data.get("scheduled_date"),
        data.get("rating") if data.get("rating") is not None else 0.0,
        slots_json,
        now,
        now
    ))
    conn.commit()
    conn.close()
    return db_get_candidate(cand_id)

def db_update_candidate(cand_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    fields = []
    values = []
    for k in ["name", "email", "role", "department", "stage", "recruiter", "status", "scheduled_date", "rating"]:
        if k in data:
            fields.append(f"{k} = ?")
            values.append(data[k])
    if "available_slots" in data:
        fields.append("available_slots = ?")
        values.append(json.dumps(data["available_slots"]))
    if not fields:
        conn.close()
        return db_get_candidate(cand_id)
    fields.append("updated_at = ?")
    values.append(now)
    values.append(cand_id)
    conn.execute(f"UPDATE candidates SET {', '.join(fields)} WHERE id = ?;", values)
    conn.commit()
    conn.close()
    return db_get_candidate(cand_id)

def db_delete_candidate(cand_id: str) -> bool:
    conn = get_db_connection()
    res = conn.execute("DELETE FROM candidates WHERE id = ?;", (cand_id,))
    conn.commit()
    deleted = res.rowcount > 0
    conn.close()
    return deleted


# --- Interviewers ---
def db_get_all_interviewers() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM interviewers ORDER BY name ASC;").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["skills"] = json.loads(d.get("skills") or "[]")
        try:
            d["available_slots"] = json.loads(d.get("available_slots") or "{}")
        except:
            d["available_slots"] = {}
        result.append(d)
    return result

def db_get_interviewer(interviewer_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM interviewers WHERE id = ? OR email = ?;", (interviewer_id, interviewer_id)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["skills"] = json.loads(d.get("skills") or "[]")
    try:
        d["available_slots"] = json.loads(d.get("available_slots") or "{}")
    except:
        d["available_slots"] = {}
    return d

def db_create_interviewer(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    int_id = data.get("id") or f"int-{int(datetime.datetime.now().timestamp() * 1000)}"
    skills_json = json.dumps(data.get("skills") or ["General Engineering"])
    slots_json = json.dumps(data.get("available_slots") or {})

    conn.execute("""
    INSERT INTO interviewers (id, name, email, avatar, role, team, skills, weekly_capacity, scheduled_this_week, training_level, status, available_slots, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        int_id,
        data.get("name") or "Interviewer",
        data.get("email") or f"{int_id}@chakravyuh.ai",
        data.get("avatar") or "",
        data.get("role") or "Senior Software Engineer",
        data.get("team") or "Core Panel",
        skills_json,
        data.get("weekly_capacity") or 6,
        data.get("scheduled_this_week") or 0,
        data.get("training_level") or "Level 1 (Qualified)",
        data.get("status") or "ACTIVE",
        slots_json,
        now,
        now
    ))
    conn.commit()
    conn.close()
    return db_get_interviewer(int_id)

def db_update_interviewer_availability(interviewer_id: str, slots: Dict[str, bool]) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    conn.execute("UPDATE interviewers SET available_slots = ?, updated_at = ? WHERE id = ? OR email = ?;", (
        json.dumps(slots), now, interviewer_id, interviewer_id
    ))
    conn.commit()
    conn.close()
    return db_get_interviewer(interviewer_id)


# --- Jobs ---
def db_get_all_jobs() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM jobs ORDER BY title ASC;").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["rounds"] = json.loads(d.get("rounds") or "[]")
        result.append(d)
    return result

def db_get_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM jobs WHERE id = ?;", (job_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["rounds"] = json.loads(d.get("rounds") or "[]")
    return d

def db_create_job(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    job_id = data.get("id") or f"job-{int(datetime.datetime.now().timestamp() * 1000)}"
    rounds_json = json.dumps(data.get("rounds") or [])

    conn.execute("""
    INSERT INTO jobs (id, title, department, location, openings, active_candidates, rounds, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        job_id,
        data.get("title", "Software Engineer"),
        data.get("department", "Core Infrastructure"),
        data.get("location", "Hybrid / Remote"),
        data.get("openings", 1),
        data.get("active_candidates", 0),
        rounds_json,
        now,
        now
    ))
    conn.commit()
    conn.close()
    return db_get_job(job_id)


# --- Rooms ---
def db_get_all_rooms() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM rooms ORDER BY name ASC;").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["available_slots"] = json.loads(d.get("available_slots") or "[]")
        result.append(d)
    return result


# --- Schedules ---
def db_get_active_schedule() -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM schedules ORDER BY created_at DESC LIMIT 1;").fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["sessions"] = json.loads(d.get("sessions") or "[]")
    d["diagnostics"] = json.loads(d.get("diagnostics") or "{}")
    return d

def db_save_schedule(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    sched_id = data.get("id") or f"sched-{int(datetime.datetime.now().timestamp() * 1000)}"
    sessions_json = json.dumps(data.get("sessions") or [])
    diag_json = json.dumps(data.get("diagnostics") or {})

    conn.execute("""
    INSERT OR REPLACE INTO schedules (id, version, status, start_date, end_date, sessions, diagnostics, published_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        sched_id,
        data.get("version", "v2.4"),
        data.get("status", "DRAFT"),
        data.get("start_date", "2026-10-26"),
        data.get("end_date", "2026-10-30"),
        sessions_json,
        diag_json,
        data.get("published_at"),
        now
    ))
    conn.commit()
    conn.close()
    return db_get_active_schedule()

def db_publish_schedule(sched_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    conn.execute("UPDATE schedules SET status = 'PUBLISHED', published_at = ? WHERE id = ?;", (now, sched_id))
    conn.commit()
    conn.close()
    return db_get_active_schedule()


# --- Scorecards & Evaluations ---
def db_get_all_evaluations() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM evaluations ORDER BY submitted_at DESC;").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_evaluations_by_candidate(cand_name: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM evaluations WHERE candidate_name LIKE ? OR candidate_id = ? ORDER BY submitted_at DESC;", (f"%{cand_name}%", cand_name)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_create_evaluation(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    eval_id = data.get("id") or f"eval-{int(datetime.datetime.now().timestamp() * 1000)}"

    conn.execute("""
    INSERT INTO evaluations (id, interview_id, candidate_id, candidate_name, interviewer_id, interviewer_name, round_name, decision, rating, problem_solving_rating, architecture_rating, communication_rating, strengths, growth_areas, notes, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        eval_id,
        data.get("interview_id", ""),
        data.get("candidate_id"),
        data.get("candidate_name", "Candidate"),
        data.get("interviewer_id"),
        data.get("interviewer_name", "Interviewer"),
        data.get("round_name", "Technical Round"),
        data.get("decision", "HIRE"),
        data.get("rating", 5),
        data.get("problem_solving_rating", 5),
        data.get("architecture_rating", 4),
        data.get("communication_rating", 5),
        data.get("strengths", ""),
        data.get("growth_areas", ""),
        data.get("notes", ""),
        now
    ))
    conn.commit()
    conn.close()
    return data


# --- Messages & Tasks ---
def db_get_messages(user_email: Optional[str] = None, role: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if role:
        rows = conn.execute("SELECT * FROM messages WHERE recipient_role = ? OR recipient_role = 'ALL' ORDER BY timestamp DESC;", (role,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM messages ORDER BY timestamp DESC;").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_create_message(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    msg_id = data.get("id") or f"msg-{int(datetime.datetime.now().timestamp() * 1000)}"
    conn.execute("""
    INSERT INTO messages (id, sender_name, sender_role, recipient_name, recipient_role, subject, body, type, is_read, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        msg_id,
        data.get("sender_name", "Coordinator"),
        data.get("sender_role", "COORDINATOR"),
        data.get("recipient_name", "All"),
        data.get("recipient_role", "ALL"),
        data.get("subject", "Notice"),
        data.get("body", ""),
        data.get("type", "DIRECT"),
        0,
        data.get("timestamp", "Just now")
    ))
    conn.commit()
    conn.close()
    data["id"] = msg_id
    return data

def db_mark_message_read(msg_id: str):
    conn = get_db_connection()
    conn.execute("UPDATE messages SET is_read = 1 WHERE id = ?;", (msg_id,))
    conn.commit()
    conn.close()
