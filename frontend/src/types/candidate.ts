import { User } from './user';

export type CandidateStatus = 'APPLIED' | 'SCREENING' | 'INTERVIEW_LOOP' | 'DECISION_PENDING' | 'OFFER' | 'REJECTED';

export interface Candidate extends User {
  targetRole: string;
  department: string;
  status: CandidateStatus;
  resumeUrl?: string;
  notes?: string;
  appliedDate: string;
  recruiterId?: string;
  scheduledLoopId?: string;
}
