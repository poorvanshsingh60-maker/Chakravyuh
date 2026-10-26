import { Task, CandidateItem, JobPosition, InterviewerDirectoryItem } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Submit Scorecard for Marcus Vance (Google SDE Loop)',
    candidateName: 'Marcus Vance',
    role: 'B.Tech CSE — Software Engineer (L3)',
    roundName: 'Round 1: DSA & Problem Solving',
    dueDate: 'Today',
    dueTime: '5:00 PM',
    type: 'SCORECARD',
    status: 'PENDING',
    priority: 'HIGH',
    interviewerName: 'Dr. Sarah Chen (Google)'
  },
  {
    id: 'task-2',
    title: 'Confirm CCF Lab 2 Interview Slots for Atlassian Drive',
    candidateName: 'Priya Sharma',
    role: 'B.Tech IT — Backend Engineer',
    roundName: 'Round 2: Distributed Systems',
    dueDate: 'Today',
    dueTime: '6:30 PM',
    type: 'RESCHEDULE',
    status: 'PENDING',
    priority: 'HIGH',
    interviewerName: 'Phil Dunphy (Atlassian)'
  },
  {
    id: 'task-3',
    title: 'Verify LHC Hall 102 Room Booking for Microsoft Loops',
    candidateName: 'Rahul Verma',
    role: 'B.Tech ECE — Embedded Systems',
    roundName: 'Round 1: Core Fundamentals',
    dueDate: 'Tomorrow',
    dueTime: '11:00 AM',
    type: 'SHADOW_REVIEW',
    status: 'PENDING',
    priority: 'MEDIUM',
    interviewerName: 'Manny Delgado (Microsoft)'
  },
  {
    id: 'task-4',
    title: 'Submit Scorecard for Ananya Patel',
    candidateName: 'Ananya Patel',
    role: 'B.Tech CSE — Systems Engineer',
    roundName: 'Round 3: Behavioral & Values',
    dueDate: 'Yesterday',
    dueTime: 'Completed',
    type: 'SCORECARD',
    status: 'COMPLETED',
    priority: 'LOW',
    interviewerName: 'Claire Pritchett'
  }
];

export const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 'cand-1',
    name: 'Marcus Vance',
    role: 'B.Tech CSE (Reg: 20214012) — Google SDE',
    stage: 'Technical Loop',
    appliedDate: 'Oct 20, 2026',
    scheduledDate: 'Oct 26, 2026 (CCF Lab 1)',
    recruiter: 'T&P Coordinator Emma',
    status: 'SCHEDULED',
    rating: 4.9
  },
  {
    id: 'cand-2',
    name: 'Priya Sharma',
    role: 'B.Tech IT (Reg: 20214088) — Atlassian Core',
    stage: 'Technical Loop',
    appliedDate: 'Oct 21, 2026',
    scheduledDate: 'Oct 26, 2026 (CCF Lab 2)',
    recruiter: 'T&P Coordinator Emma',
    status: 'SCHEDULED',
    rating: 4.8
  },
  {
    id: 'cand-3',
    name: 'Rahul Verma',
    role: 'B.Tech ECE (Reg: 20215045) — Microsoft Cloud',
    stage: 'Recruiter Screen',
    appliedDate: 'Oct 22, 2026',
    recruiter: 'T&P Coordinator Emma',
    status: 'NEEDS_SCHEDULING'
  },
  {
    id: 'cand-4',
    name: 'Ananya Patel',
    role: 'B.Tech CSE (Reg: 20214056) — Oracle Systems',
    stage: 'Executive Review',
    appliedDate: 'Oct 18, 2026',
    scheduledDate: 'Oct 27, 2026 (LHC Hall)',
    recruiter: 'T&P Coordinator Emma',
    status: 'DECISION_PENDING',
    rating: 4.7
  },
  {
    id: 'cand-5',
    name: 'Rohan Gupta',
    role: 'B.Tech CSE (Reg: 20214110) — Goldman Sachs SDE',
    stage: 'Technical Loop',
    appliedDate: 'Oct 23, 2026',
    recruiter: 'T&P Coordinator Emma',
    status: 'NEEDS_SCHEDULING'
  }
];

export const INITIAL_JOBS: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Product Designer',
    department: 'Product & Design',
    location: 'San Francisco, CA / Remote',
    openings: 2,
    activeCandidates: 14,
    rounds: [
      { name: 'Portfolio Screen', duration: 45, requiredSkills: ['UI/UX', 'Design Systems'] },
      { name: 'Design Exercise 1', duration: 30, requiredSkills: ['Figma', 'Interaction Design'] },
      { name: 'Company Values', duration: 30, requiredSkills: ['Values Calibration', 'Collaboration'] },
      { name: 'Design Presentation', duration: 60, requiredSkills: ['Product Strategy', 'Communication'] }
    ]
  },
  {
    id: 'job-2',
    title: 'Staff Distributed Systems Engineer',
    department: 'Core Infrastructure',
    location: 'Sunnyvale, CA / Hybrid',
    openings: 1,
    activeCandidates: 8,
    rounds: [
      { name: 'Technical Screen', duration: 60, requiredSkills: ['Algorithms', 'Go/C++'] },
      { name: 'System Architecture', duration: 60, requiredSkills: ['Raft/Paxos', 'LSM Storage'] },
      { name: 'Resilience & Concurrency', duration: 60, requiredSkills: ['Chaos Testing', 'Distributed DB'] },
      { name: 'Bar Raiser Leadership', duration: 60, requiredSkills: ['Executive Rigor', 'Mentorship'] }
    ]
  },
  {
    id: 'job-3',
    title: 'Senior Frontend Engineer',
    department: 'Web Applications',
    location: 'New York, NY / Remote',
    openings: 3,
    activeCandidates: 22,
    rounds: [
      { name: 'Screening', duration: 45, requiredSkills: ['React', 'TypeScript'] },
      { name: 'Architecture & State', duration: 60, requiredSkills: ['Web Performance', 'SSR'] },
      { name: 'Design System & UI', duration: 45, requiredSkills: ['Tailwind', 'Accessibility'] }
    ]
  }
];

export const INITIAL_DIRECTORY: InterviewerDirectoryItem[] = [
  {
    id: 'int-1',
    name: 'Dr. Sarah Chen',
    role: 'Staff Distributed Systems Engineer',
    team: 'Google SDE Panel',
    skills: ['DSA', 'Python', 'Algorithms', 'High Concurrency'],
    weeklyCapacity: 8,
    scheduledThisWeek: 4,
    trainingLevel: 'Level 2 (Lead)',
    status: 'ACTIVE'
  },
  {
    id: 'int-2',
    name: 'Phil Dunphy',
    role: 'Principal Architect',
    team: 'Atlassian Panel',
    skills: ['System Design', 'Core CS', 'Distributed Storage'],
    weeklyCapacity: 6,
    scheduledThisWeek: 3,
    trainingLevel: 'Level 1 (Qualified)',
    status: 'ACTIVE'
  },
  {
    id: 'int-3',
    name: 'Alex Rivera',
    role: 'Senior Staff Engineer',
    team: 'Microsoft Cloud Panel',
    skills: ['Cloud Architecture', 'Core Systems', 'Raft'],
    weeklyCapacity: 5,
    scheduledThisWeek: 2,
    trainingLevel: 'Level 1 (Qualified)',
    status: 'ACTIVE'
  },
  {
    id: 'int-4',
    name: 'Claire Pritchett',
    role: 'Talent Lead & Evaluator',
    team: 'Talent Operations Committee',
    skills: ['Executive Evaluation', 'Values Calibration', 'Leadership'],
    weeklyCapacity: 4,
    scheduledThisWeek: 2,
    trainingLevel: 'Level 2 (Lead)',
    status: 'ACTIVE'
  }
];
