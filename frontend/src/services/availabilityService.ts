import api from './api';
import { Availability, TimeSlot } from '../types/availability';

export const availabilityService = {
  getMyAvailability: async (): Promise<Availability[]> => {
    try {
      const res = await api.get('/availability/me');
      return res.data;
    } catch {
      return [];
    }
  },

  submitSlots: async (slots: TimeSlot[]): Promise<void> => {
    await api.post('/availability/me', { slots }).catch(() => {});
  }
};
