import api from './api';
import { Evaluation } from '../types/evaluation';

export const evaluationService = {
  submit: async (data: Omit<Evaluation, 'id' | 'submittedAt'>): Promise<Evaluation> => {
    try {
      const res = await api.post('/evaluations', data);
      return res.data;
    } catch {
      return {
        ...data,
        id: `eval-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
    }
  },

  getByInterview: async (interviewId: string): Promise<Evaluation | null> => {
    try {
      const res = await api.get(`/evaluations/interview/${interviewId}`);
      return res.data;
    } catch {
      return null;
    }
  }
};
