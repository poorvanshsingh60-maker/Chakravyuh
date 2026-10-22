import { Task, CandidateItem, JobPosition, InterviewerDirectoryItem } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Submit Scorecard for Zach Buechler',
    candidateName: 'Zach Buechler',
    role: 'Product Designer',
    roundName: 'Design Exercise 1',
    dueDate: 'Today',
    dueTime: '5:00 PM',
    type: 'SCORECARD',
    status: 'PENDING',
    priority: 'HIGH',
    interviewerName: 'Claire Pritchett'
  },
  {
    id: 'task-2',
    title: 'Review Shadow Notes for Phil Dunphy',
    candidateName: 'Alex Rivera',
    role: 'Staff Distributed Systems Engineer',
    roundName: 'Company Values',
    dueDate: 'Today',
    dueTime: '6:30 PM',
    type: 'SHADOW_REVIEW',
    status: 'PENDING',
    priority: 'MEDIUM',
    interviewerName: 'Phil Dunphy'
  },
  {
    id: 'task-3',
    title: 'Confirm Schedule Conflict Delta',
    candidateName: 'Maya Lin',
    role: 'Senior Frontend Engineer',
    roundName: 'Systems Architecture',
    dueDate: 'Tomorrow',
    dueTime: '11:00 AM',
    type: 'RESCHEDULE',
    status: 'PENDING',
    priority: 'HIGH',
    interviewerName: 'Manny Delgado'
  },
  {
    id: 'task-4',
    title: 'Submit Scorecard for Lucas Vance',
    candidateName: 'Lucas Vance',
    role: 'Platform Infrastructure Engineer',
    roundName: 'Coding Fundamentals',
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
    name: 'Zach Buechler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Product Designer',
    stage: 'Technical Loop',
    appliedDate: 'May 10, 2024',
    scheduledDate: 'May 18, 2024 (Onsite)',
    recruiter: 'Sarah Jenkins',
    status: 'SCHEDULED',
    rating: 4.8
  },
  {
    id: 'cand-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Staff Distributed Systems Engineer',
    stage: 'Technical Loop',
    appliedDate: 'May 12, 2024',
    scheduledDate: 'May 19, 2024 (Virtual)',
    recruiter: 'Michael Chang',
    status: 'SCHEDULED',
    rating: 4.9
  },
  {
    id: 'cand-3',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    role: 'Senior Frontend Engineer',
    stage: 'Recruiter Screen',
    appliedDate: 'May 15, 2024',
    recruiter: 'Sarah Jenkins',
    status: 'NEEDS_SCHEDULING'
  },
  {
    id: 'cand-4',
    name: 'Devon Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    role: 'Lead Security Engineer',
    stage: 'Executive Review',
    appliedDate: 'May 2, 2024',
    scheduledDate: 'May 20, 2024',
    recruiter: 'Michael Chang',
    status: 'DECISION_PENDING',
    rating: 4.5
  },
  {
    id: 'cand-5',
    name: 'Sophia Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    role: 'Product Designer',
    stage: 'Technical Loop',
    appliedDate: 'May 16, 2024',
    recruiter: 'Sarah Jenkins',
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
    name: 'Claire Pritchett',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    role: 'Principal Designer & Bar Raiser',
    team: 'Core Experience',
    skills: ['Interaction Design', 'Design Systems', 'Values Calibration'],
    weeklyCapacity: 8,
    scheduledThisWeek: 4,
    trainingLevel: 'Level 2 (Lead)',
    status: 'ACTIVE'
  },
  {
    id: 'int-2',
    name: 'Phil Dunphy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Senior Product Manager',
    team: 'Growth & Monetization',
    skills: ['Company Values', 'Product Execution', 'User Research'],
    weeklyCapacity: 6,
    scheduledThisWeek: 3,
    trainingLevel: 'In Training (Shadow)',
    status: 'ACTIVE'
  },
  {
    id: 'int-3',
    name: 'Manny Delgado',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    role: 'Staff Systems Architect',
    team: 'Storage Infrastructure',
    skills: ['Raft Consensus', 'Distributed Storage', 'High Concurrency'],
    weeklyCapacity: 5,
    scheduledThisWeek: 2,
    trainingLevel: 'Level 1 (Qualified)',
    status: 'ACTIVE'
  },
  {
    id: 'int-4',
    name: 'Gloria Vergara',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Director of Engineering',
    team: 'Platform Reliability',
    skills: ['Executive Evaluation', 'Chaos Engineering', 'Architecture'],
    weeklyCapacity: 4,
    scheduledThisWeek: 1,
    trainingLevel: 'Level 2 (Lead)',
    status: 'FOCUS_MODE'
  }
];
