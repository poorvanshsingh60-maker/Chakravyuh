import api from './api';
import { InterviewRound } from '../types/interviewRound';

export const roundService = {
  getAll: async (): Promise<InterviewRound[]> => {
    try {
      const res = await api.get('/rounds');
      return res.data;
    } catch {
      return [
        { id: 'rnd-1', name: 'Screening & Core Algorithms', sequenceOrder: 1, durationMinutes: 60, requiredSkillIds: ['sk-1'], prerequisiteRoundIds: [], interviewerCount: 1 },
        { id: 'rnd-2', name: 'Distributed Systems Architecture', sequenceOrder: 2, durationMinutes: 60, requiredSkillIds: ['sk-2'], prerequisiteRoundIds: ['rnd-1'], interviewerCount: 1 },
        { id: 'rnd-3', name: 'Resilience & Fault Tolerance', sequenceOrder: 3, durationMinutes: 60, requiredSkillIds: ['sk-3'], prerequisiteRoundIds: ['rnd-2'], interviewerCount: 1 },
      ];
    }
  },

  create: async (data: Omit<InterviewRound, 'id'>): Promise<InterviewRound> => {
    try {
      const res = await api.post('/rounds', data);
      return res.data;
    } catch {
      return { ...data, id: `round-${Date.now()}` };
    }
  }
};
