import { User } from './user';

export type InterviewerStatus = 'ACTIVE' | 'ON_LEAVE' | 'TRAINING' | 'BURNOUT_GUARD';

export interface Interviewer extends User {
  title: string;
  team: string;
  status: InterviewerStatus;
  skillIds: string[];
  maxWeeklyInterviews: number;
  assignedThisWeek: number;
  bio?: string;
  trainingLevel: 'LEVEL_1' | 'LEVEL_2_LEAD' | 'SHADOW';
}
