import api from './api';

export interface WorkloadMetric {
  interviewerId: string;
  interviewerName: string;
  assignedHours: number;
  maxWeeklyCap: number;
  fatigueScore: number;
}

export interface RoomUtilizationMetric {
  roomId: string;
  roomName: string;
  utilizationPercentage: number;
  bookedSlotsCount: number;
}

export const analyticsService = {
  getWorkloadStats: async (): Promise<WorkloadMetric[]> => {
    try {
      const res = await api.get('/analytics/workload');
      return res.data;
    } catch {
      return [
        { interviewerId: 'int-1', interviewerName: 'Claire Pritchett', assignedHours: 4, maxWeeklyCap: 8, fatigueScore: 50 },
        { interviewerId: 'int-2', interviewerName: 'Phil Dunphy', assignedHours: 3, maxWeeklyCap: 6, fatigueScore: 50 },
        { interviewerId: 'int-3', interviewerName: 'Manny Delgado', assignedHours: 2, maxWeeklyCap: 5, fatigueScore: 40 },
      ];
    }
  },

  getRoomUtilization: async (): Promise<RoomUtilizationMetric[]> => {
    try {
      const res = await api.get('/analytics/rooms');
      return res.data;
    } catch {
      return [
        { roomId: 'r-1', roomName: 'Virtual Pod Alpha', utilizationPercentage: 85, bookedSlotsCount: 12 },
        { roomId: 'r-2', roomName: 'Virtual Pod Gamma', utilizationPercentage: 70, bookedSlotsCount: 9 },
      ];
    }
  },

  exportReport: async (format: 'pdf' | 'excel'): Promise<Blob> => {
    try {
      const res = await api.get(`/reports/${format}`, { responseType: 'blob' });
      return res.data;
    } catch {
      return new Blob(['Sample Report Content'], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' });
    }
  }
};
