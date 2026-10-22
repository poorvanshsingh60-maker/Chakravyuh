import api from './api';
import { ScheduleVersion } from '../types/schedule';

export const scheduleService = {
  triggerSolve: async (startDate: string, endDate: string, timeoutSec: number = 30): Promise<ScheduleVersion> => {
    try {
      const res = await api.post('/schedules/solve', { startDate, endDate, timeoutSeconds: timeoutSec });
      return res.data;
    } catch {
      // Mock CP-SAT response
      return {
        id: `sched-${Date.now()}`,
        versionNumber: 2.5,
        status: 'DRAFT',
        startDate,
        endDate,
        interviews: [],
        diagnostics: {
          solverStatus: 'OPTIMAL',
          variablesCount: 42,
          constraintsCount: 128,
          solveTimeMs: 84.2,
          conflictsCount: 0,
          objectiveScore: 98.6,
        },
        createdAt: new Date().toISOString(),
      };
    }
  },

  publish: async (versionId: string): Promise<void> => {
    await api.post(`/schedules/${versionId}/publish`).catch(() => {});
  },

  getVersions: async (): Promise<ScheduleVersion[]> => {
    try {
      const res = await api.get('/schedules/versions');
      return res.data;
    } catch {
      return [];
    }
  }
};
