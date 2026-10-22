import api from './api';
import { Candidate } from '../types/candidate';

export const candidateService = {
  getAll: async (): Promise<Candidate[]> => {
    try {
      const res = await api.get('/candidates');
      return res.data;
    } catch {
      return [];
    }
  },

  getById: async (id: string): Promise<Candidate | null> => {
    try {
      const res = await api.get(`/candidates/${id}`);
      return res.data;
    } catch {
      return null;
    }
  },

  create: async (data: Partial<Candidate>): Promise<Candidate> => {
    try {
      const res = await api.post('/candidates', data);
      return res.data;
    } catch {
      return {
        id: `cand-${Date.now()}`,
        name: data.name || 'Candidate',
        email: data.email || 'cand@example.com',
        role: 'CANDIDATE',
        targetRole: data.targetRole || 'Engineer',
        department: data.department || 'Engineering',
        status: 'SCREENING',
        appliedDate: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }
};
