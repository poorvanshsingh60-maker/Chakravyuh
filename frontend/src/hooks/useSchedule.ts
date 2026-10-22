import { useState } from 'react';
import { scheduleService } from '../services/scheduleService';
import { ScheduleVersion } from '../types/schedule';
import { useNotificationContext } from '../context/NotificationContext';

export const useSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleVersion | null>(null);
  const { showNotification } = useNotificationContext();

  const runSolver = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const version = await scheduleService.triggerSolve(startDate, endDate);
      setSchedule(version);
      showNotification('CP-SAT Solver computed 100% collision-free schedule!', 'SUCCESS');
      return version;
    } catch {
      showNotification('Solver failed to find feasible schedule', 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  const publishSchedule = async (versionId: string) => {
    setLoading(true);
    try {
      await scheduleService.publish(versionId);
      showNotification('Schedule version published! Calendar invites sent.', 'SUCCESS');
    } catch {
      showNotification('Failed to publish schedule', 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  return { loading, schedule, runSolver, publishSchedule };
};
