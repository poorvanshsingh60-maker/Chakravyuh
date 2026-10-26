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
  },

  updateAvailability: async (id: string, availableSlots: Record<string, boolean>): Promise<any> => {
    try {
      const res = await api.patch(`/interviewers/${id}/availability`, { available_slots: availableSlots });
      return res.data;
    } catch {
      return null;
    }
  }
};
