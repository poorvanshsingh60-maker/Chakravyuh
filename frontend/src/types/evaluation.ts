export type Recommendation = 'STRONG_NO_HIRE' | 'NO_HIRE' | 'LEAN_HIRE' | 'HIRE' | 'STRONG_HIRE';

export interface CompetencyScore {
  name: string;
  score: number; // 1-5
  notes?: string;
}

export interface Evaluation {
  id: string;
  interviewId: string;
  interviewerId: string;
  interviewerName: string;
  candidateId: string;
  scores: CompetencyScore[];
  recommendation: Recommendation;
  strengths: string;
  weaknesses: string;
  summaryNotes: string;
  submittedAt: string;
}
