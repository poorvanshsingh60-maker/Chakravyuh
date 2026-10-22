import React from 'react';
import { TimeSlot } from '../../types/availability';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
}

interface FullCalendarWrapperProps {
  events: CalendarEvent[];
  onSelectSlot?: (slot: TimeSlot) => void;
}

export const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({ events }) => {
  return (
    <div className="border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs">
      <div className="p-4 border-b border-[#f2f4f7] flex justify-between items-center bg-[#fafafa]">
        <span className="font-bold text-xs text-[#101828]">Weekly Schedule Timeline</span>
        <span className="text-[11px] text-[#667085]">PST (UTC-8)</span>
      </div>
      <div className="p-4 space-y-2">
        {events.length === 0 ? (
          <p className="text-xs text-[#667085] text-center py-6">No scheduled sessions</p>
        ) : (
          events.map((e) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-[#e7f2fe] border border-[#bcd7fd] text-xs">
              <span className="font-bold text-[#1668e8] block">{e.title}</span>
              <span className="text-[11px] text-[#475467]">{e.start} – {e.end}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
