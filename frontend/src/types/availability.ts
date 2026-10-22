export type AvailabilityType = 'AVAILABLE' | 'BUSY' | 'PREFERRED';

export interface TimeSlot {
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  type?: AvailabilityType;
}

export interface Availability {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  isRecurring: boolean;
  dayOfWeek?: number; // 0-6
}
