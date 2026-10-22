import { useState } from 'react';
import { TimeSlot } from '../types/availability';

export const useCalendar = (initialDate: string = '2024-05-18') => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const toggleSlot = (startTime: string, endTime: string) => {
    const existingIndex = selectedSlots.findIndex(s => s.startTime === startTime);
    if (existingIndex >= 0) {
      setSelectedSlots(selectedSlots.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedSlots([...selectedSlots, { startTime, endTime, type: 'AVAILABLE' }]);
    }
  };

  return { selectedDate, setSelectedDate, selectedSlots, toggleSlot };
};
