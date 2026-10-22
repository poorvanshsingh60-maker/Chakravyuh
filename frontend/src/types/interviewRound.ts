export interface InterviewRound {
  id: string;
  name: string;
  sequenceOrder: number;
  durationMinutes: number;
  requiredSkillIds: string[];
  prerequisiteRoundIds: string[];
  interviewerCount: number;
  description?: string;
  jobId?: string;
}
