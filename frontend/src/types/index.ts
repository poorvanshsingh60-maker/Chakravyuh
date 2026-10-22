export type NavTab = 
  | 'my-tasks'
  | 'all-tasks'
  | 'upcoming'
  | 'candidates'
  | 'jobs'
  | 'scheduling'
  | 'training'
  | 'communications'
  | 'directory'
  | 'metrics'
  | 'settings'
  | 'help';

export interface Task {
  id: string;
  title: string;
  candidateName: string;
  role: string;
  roundName: string;
  dueDate: string;
  dueTime: string;
  type: 'SCORECARD' | 'CONFIRM_AVAILABILITY' | 'SHADOW_REVIEW' | 'RESCHEDULE';
  status: 'PENDING' | 'COMPLETED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  interviewerName: string;
}

export interface CandidateItem {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  stage: 'Recruiter Screen' | 'Technical Loop' | 'Executive Review' | 'Offer Extended';
  appliedDate: string;
  scheduledDate?: string;
  recruiter: string;
  status: 'SCHEDULED' | 'NEEDS_SCHEDULING' | 'DECISION_PENDING';
  rating?: number;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  openings: number;
  activeCandidates: number;
  rounds: {
    name: string;
    duration: number;
    requiredSkills: string[];
  }[];
}

export interface InterviewerDirectoryItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  skills: string[];
  weeklyCapacity: number;
  scheduledThisWeek: number;
  trainingLevel: 'Level 1 (Qualified)' | 'Level 2 (Lead)' | 'In Training (Shadow)';
  status: 'ACTIVE' | 'ON_LEAVE' | 'FOCUS_MODE';
}
