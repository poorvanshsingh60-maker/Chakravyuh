import api from './api';

export interface EvaluationPayload {
  interview_id?: string;
  interviewId?: string;
  candidate_id?: string;
  candidateId?: string;
  candidate_name?: string;
  candidateName?: string;
  interviewer_id?: string;
  interviewerId?: string;
  interviewer_name?: string;
  interviewerName?: string;
  round_name?: string;
  roundName?: string;
  decision?: string;
  recommendation?: string;
  rating?: number;
  problem_solving_rating?: number;
  architecture_rating?: number;
  communication_rating?: number;
  strengths?: string;
  growth_areas?: string;
  weaknesses?: string;
  notes?: string;
  summaryNotes?: string;
  scores?: Array<{ name: string; score: number; notes?: string }>;
}

export const evaluationService = {
  submit: async (data: any): Promise<any> => {
    try {
      const payload = {
        interview_id: data.interview_id || data.interviewId || `int-${Date.now()}`,
        candidate_id: data.candidate_id || data.candidateId,
        candidate_name: data.candidate_name || data.candidateName || 'Candidate',
        interviewer_id: data.interviewer_id || data.interviewerId,
        interviewer_name: data.interviewer_name || data.interviewerName || 'Interviewer',
        round_name: data.round_name || data.roundName || 'Technical Round',
        decision: data.decision || data.recommendation || 'HIRE',
        rating: data.rating || 5,
        strengths: data.strengths || '',
        growth_areas: data.growth_areas || data.weaknesses || '',
        notes: data.notes || data.summaryNotes || ''
      };
      const res = await api.post('/evaluations', payload);
      return res.data;
    } catch {
      return {
        ...data,
        id: `eval-${Date.now()}`,
        submitted_at: new Date().toISOString(),
      };
    }
  },

  getAll: async (): Promise<any[]> => {
    try {
      const res = await api.get('/evaluations');
      return res.data;
    } catch {
      return [];
    }
  },

  getByCandidate: async (candName: string): Promise<any[]> => {
    try {
      const res = await api.get(`/evaluations/candidate/${encodeURIComponent(candName)}`);
      return res.data;
    } catch {
      return [];
    }
  }
};
