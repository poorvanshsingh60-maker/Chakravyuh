export interface Interviewer {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar: string;
  skills: string[];
  interviewsThisWeek: number;
  maxCapWeekly: number;
  bio: string;
  focusArea: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: string;
  timezone: string;
  appliedDate: string;
}

export interface InterviewSlot {
  id: string;
  roundName: string;
  roundNumber: number;
  time: string;
  duration: string;
  date: string;
  interviewerId: string;
  roomId: string;
  roomName: string;
  status: 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING';
  meetingUrl: string;
  prepNotes: string;
  focusSkills: string[];
}

export interface Room {
  id: string;
  name: string;
  type: 'PHYSICAL' | 'VIRTUAL';
  capacity: number;
  location: string;
  utilizationRate: number;
}

export const CURRENT_CANDIDATE: Candidate = {
  id: 'cand-9021',
  name: 'Alex Rivera',
  email: 'alex.rivera@cs.stanford.edu',
  role: 'Staff Distributed Systems Engineer',
  stage: 'Onsite Virtual Loop (4 Rounds)',
  timezone: 'PST (UTC-8)',
  appliedDate: 'Oct 14, 2026',
};

export const INTERVIEWERS: Interviewer[] = [
  {
    id: 'int-101',
    name: 'Sarah Chen',
    role: 'Principal Systems Architect',
    team: 'Core Storage Engine',
    avatar: '',
    skills: ['Raft Consensus', 'LSM Trees', 'Go/Rust', 'High Concurrency'],
    interviewsThisWeek: 4,
    maxCapWeekly: 6,
    bio: '8+ years leading petabyte-scale distributed key-value storage. Former open-source contributor to etcd.',
    focusArea: 'Concurrency safety, consensus algorithms, failure modes, and distributed transactions.',
  },
  {
    id: 'int-102',
    name: 'David Varma',
    role: 'Director of Infrastructure',
    team: 'Cloud Platform & Compute',
    avatar: '',
    skills: ['Kubernetes Orchestration', 'Multi-Region Architecture', 'SLA/SLO Planning'],
    interviewsThisWeek: 3,
    maxCapWeekly: 4,
    bio: 'Passionate about engineering resilience, zero-downtime migrations, and mentoring senior talent.',
    focusArea: 'Cross-functional engineering leadership, architecture trade-offs, and scaling bottlenecks.',
  },
  {
    id: 'int-103',
    name: 'Elena Rostova',
    role: 'Staff Reliability Engineer',
    team: 'Global Data Pipeline',
    avatar: '',
    skills: ['Kafka/Flink', 'Chaos Engineering', 'P99 Latency Tuning'],
    interviewsThisWeek: 5,
    maxCapWeekly: 6,
    bio: 'Specialist in streaming processing pipelines delivering 12M events/sec. Loves deep debugging.',
    focusArea: 'Algorithmic performance, memory modeling, profiling, and edge-case resilience.',
  },
  {
    id: 'int-104',
    name: 'Marcus Brody',
    role: 'Senior Bar Raiser & Engineering Manager',
    team: 'Developer Ecosystem',
    avatar: '',
    skills: ['System Design', 'Strategic Alignment', 'Engineering Culture'],
    interviewsThisWeek: 2,
    maxCapWeekly: 5,
    bio: 'Certified Bar Raiser. Focuses on collaborative velocity, bias for action, and technical mentorship.',
    focusArea: 'Cultural calibration, constructive disagreement, and technical ownership.',
  },
];

export const SCHEDULED_INTERVIEWS: InterviewSlot[] = [
  {
    id: 'slot-1',
    roundName: 'Round 1: Screening & Core Algorithms',
    roundNumber: 1,
    date: 'Wednesday, Oct 21',
    time: '10:00 AM – 11:00 AM PST',
    duration: '60 min',
    interviewerId: 'int-103',
    roomId: 'room-virt-1',
    roomName: 'Virtual Pod Alpha (Meet #891-23)',
    status: 'COMPLETED',
    meetingUrl: 'https://meet.google.com/chk-core-alg',
    prepNotes: 'Completed on Oct 21. Candidate demonstrated optimal asymptotic mastery and clean Rust syntax.',
    focusSkills: ['Algorithm Design', 'Space-Time Complexity', 'Data Structures'],
  },
  {
    id: 'slot-2',
    roundName: 'Round 2: Distributed Systems Architecture',
    roundNumber: 2,
    date: 'Thursday, Oct 22 (Today)',
    time: '1:00 PM – 2:00 PM PST',
    duration: '60 min',
    interviewerId: 'int-101',
    roomId: 'room-virt-2',
    roomName: 'Virtual Pod Gamma (Meet #441-92)',
    status: 'IN_PROGRESS',
    meetingUrl: 'https://meet.google.com/chk-dist-sys',
    prepNotes: 'Design an active-active multi-region key-value store with tunable consistency (tunable CAP).',
    focusSkills: ['Raft/Paxos', 'LSM Trees', 'Replication Topologies'],
  },
  {
    id: 'slot-3',
    roundName: 'Round 3: Resilience & Fault Tolerance',
    roundNumber: 3,
    date: 'Thursday, Oct 22 (Today)',
    time: '2:15 PM – 3:15 PM PST',
    duration: '60 min',
    interviewerId: 'int-102',
    roomId: 'room-virt-3',
    roomName: 'Virtual Pod Delta (Meet #110-84)',
    status: 'CONFIRMED',
    meetingUrl: 'https://meet.google.com/chk-fault-tol',
    prepNotes: 'Focus on split-brain prevention, network partition mitigation, and backpressure mechanisms.',
    focusSkills: ['Chaos Testing', 'SLA Boundaries', 'Failure Domain Isolation'],
  },
  {
    id: 'slot-4',
    roundName: 'Round 4: Bar Raiser & Values Calibration',
    roundNumber: 4,
    date: 'Thursday, Oct 22 (Today)',
    time: '3:30 PM – 4:30 PM PST',
    duration: '60 min',
    interviewerId: 'int-104',
    roomId: 'room-virt-1',
    roomName: 'Virtual Pod Alpha (Meet #891-23)',
    status: 'CONFIRMED',
    meetingUrl: 'https://meet.google.com/chk-bar-raise',
    prepNotes: 'Deep-dive behavioral evaluation: handling ambiguity, technical post-mortems, and engineering ethos.',
    focusSkills: ['Executive Clarity', 'Ownership & Rigor', 'Cross-Team Influence'],
  },
];

export const ROOMS: Room[] = [
  { id: 'room-virt-1', name: 'Virtual Pod Alpha', type: 'VIRTUAL', capacity: 10, location: 'Cloud Meet Server US-West', utilizationRate: 85 },
  { id: 'room-virt-2', name: 'Virtual Pod Gamma', type: 'VIRTUAL', capacity: 10, location: 'Cloud Meet Server US-West', utilizationRate: 70 },
  { id: 'room-virt-3', name: 'Virtual Pod Delta', type: 'VIRTUAL', capacity: 10, location: 'Cloud Meet Server US-East', utilizationRate: 60 },
  { id: 'room-phys-1', name: 'Executive Suite 402', type: 'PHYSICAL', capacity: 6, location: 'SF HQ - Floor 4', utilizationRate: 45 },
  { id: 'room-phys-2', name: 'Turing Collab Lab', type: 'PHYSICAL', capacity: 4, location: 'SF HQ - Floor 2', utilizationRate: 90 },
];
