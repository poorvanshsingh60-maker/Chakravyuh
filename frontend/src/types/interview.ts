import { TimeSlot } from './availability';

export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  roundId: string;
  roundName: string;
  interviewerIds: string[];
  interviewerNames: string[];
  roomId?: string;
  roomName?: string;
  meetingUrl?: string;
  slot: TimeSlot;
  status: InterviewStatus;
  evaluationSubmitted?: boolean;
}
