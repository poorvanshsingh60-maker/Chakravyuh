import api from './api';
import { Interviewer } from '../types/interviewer';

export const interviewerService = {
  getAll: async (): Promise<Interviewer[]> => {
    try {
      const res = await api.get('/interviewers');
      return res.data;
    } catch {
      return [];
    }
  },

  updateCapacity: async (id: string, maxWeekly: number): Promise<void> => {
    await api.put(`/interviewers/${id}/capacity`, { maxWeeklyInterviews: maxWeekly }).catch(() => {});
  }
};
