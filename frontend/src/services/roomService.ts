import api from './api';
import { Room } from '../types/room';

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    try {
      const res = await api.get('/rooms');
      return res.data;
    } catch {
      return [
        { id: 'r-1', name: 'Virtual Pod Alpha', type: 'VIRTUAL', capacity: 10, location: 'Meet #891', isActive: true, utilizationRate: 85 },
        { id: 'r-2', name: 'Virtual Pod Gamma', type: 'VIRTUAL', capacity: 10, location: 'Meet #441', isActive: true, utilizationRate: 70 },
        { id: 'r-3', name: 'Executive Suite 402', type: 'PHYSICAL', capacity: 6, location: 'Floor 4', isActive: true, utilizationRate: 50 },
      ];
    }
  },

  create: async (data: Omit<Room, 'id'>): Promise<Room> => {
    try {
      const res = await api.post('/rooms', data);
      return res.data;
    } catch {
      return { ...data, id: `room-${Date.now()}` };
    }
  }
};
