import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  UserRound
} from 'lucide-react';
import { useTimezone } from '../../context/TimezoneContext';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';

export const UpcomingEventsView: React.FC = () => {
  const { convertTime } = useTimezone();
  const [timeframe, setTimeframe] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const allEvents = [
    {
      id: 'ev-1',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Design Exercise 1',
      interviewer: 'Claire Pritchett',
      interviewerAvatar: '',
      pstTime: '9:00 AM – 9:30 AM PST',
      room: 'Virtual Pod Alpha (Google Meet)',
      meetingUrl: 'https://meet.google.com/chk-design-ex1',
      type: 'VIRTUAL',
      date: 'May 18, 2024',
      isToday: true,
      isWeek: true
    },
    {
      id: 'ev-2',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Company Values',
      interviewer: 'Phil Dunphy',
      interviewerAvatar: '',
      pstTime: '9:30 AM – 10:00 AM PST',
      room: 'Virtual Pod Gamma',
      meetingUrl: 'https://meet.google.com/chk-values-eval',
      type: 'VIRTUAL',
      date: 'May 18, 2024',
      isToday: true,
      isWeek: true
    },
    {
      id: 'ev-3',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Design Presentation',
      interviewer: 'Manny Delgado',
      interviewerAvatar: '',
      pstTime: '10:00 AM – 11:00 AM PST',
      room: 'Conference Suite 402',
      meetingUrl: 'https://meet.google.com/chk-pres-suite',
      type: 'PHYSICAL',
      date: 'May 18, 2024',
      isToday: true,
      isWeek: true
    },
    {
      id: 'ev-4',
      candidate: 'Alex Rivera',
      role: 'Staff Distributed Systems Engineer',
      round: 'System Architecture (Raft & Storage)',
      interviewer: 'Manny Delgado',
      interviewerAvatar: '',
      pstTime: '1:00 PM – 2:00 PM PST',
      room: 'Virtual Pod Alpha',
      meetingUrl: 'https://meet.google.com/chk-raft-storage',
      type: 'VIRTUAL',
      date: 'May 19, 2024',
      isToday: false,
      isWeek: true
    },
    {
      id: 'ev-5',
      candidate: 'Maya Lin',
      role: 'Senior Frontend Engineer',
      round: 'Technical Screen (React & State)',
      interviewer: 'Claire Pritchett',
      interviewerAvatar: '',
      pstTime: '11:00 AM – 12:00 PM PST',
      room: 'Virtual Pod Gamma',
      meetingUrl: 'https://meet.google.com/chk-fe-screen',
      type: 'VIRTUAL',
      date: 'May 26, 2024',
      isToday: false,
      isWeek: false
    }
  ];

  const filteredEvents = allEvents.filter(ev => {
    if (timeframe === 'TODAY') return ev.isToday;
    if (timeframe === 'WEEK') return ev.isWeek;
    return true; // MONTH: all
  });

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Filter Bar */}
      <div className="px-6 py-3 border-b border-[#eaecf0] bg-[#fafbfc] shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#667085]">
            Confirmed candidate loops and room bookings across calendar slots.
          </p>

          <div className="flex items-center gap-1.5 bg-[#f2f4f7] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setTimeframe('TODAY')}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeframe === 'TODAY' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                Today ({allEvents.filter(e => e.isToday).length})
              </button>
              <button
                onClick={() => setTimeframe('WEEK')}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeframe === 'WEEK' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                This Week ({allEvents.filter(e => e.isWeek).length})
              </button>
              <button
                onClick={() => setTimeframe('MONTH')}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeframe === 'MONTH' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                All Events ({allEvents.length})
              </button>
            </div>
          </div>
        </div>

      {/* Events Agenda */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 max-w-5xl space-y-4">
        <div className="border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs divide-y divide-[#eaecf0]">
          {filteredEvents.map((ev) => (
            <div 
              key={ev.id} 
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f9fafb] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#e7f2fe] text-[#1668e8] shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#101828]">{ev.round}</span>
                    <span className="text-[11px] font-medium text-[#1668e8] bg-[#e7f2fe] px-2 py-0.2 rounded border border-[#bcd7fd]">
                      {ev.candidate} ({ev.role})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#475467]">
                    <span className="flex items-center gap-1 font-semibold text-[#101828]">
                      <Clock className="w-3.5 h-3.5 text-[#1668e8]" />
                      {ev.date} • {convertTime(ev.pstTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserRound className="w-3.5 h-3.5 text-[#98a2b3]" />
                      Interviewer: {ev.interviewer}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#98a2b3]" />
                      {ev.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(ev)}
                  className="px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-semibold text-[#344054] hover:bg-white"
                >
                  View Details
                </button>
                <a 
                  href={ev.meetingUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Room</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Session Details: ${selectedEvent.round}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-[#eaecf0] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#101828]">{selectedEvent.candidate}</h3>
                  <p className="text-xs text-[#667085]">{selectedEvent.role}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#d0d5dd] font-bold">
                  {selectedEvent.type}
                </span>
              </div>

              <div className="pt-2 border-t border-[#eaecf0] space-y-1 text-[#344054]">
                <p><strong>Scheduled Time:</strong> {selectedEvent.date} • {convertTime(selectedEvent.pstTime)}</p>
                <p><strong>Interviewer:</strong> {selectedEvent.interviewer}</p>
                <p><strong>Room Location:</strong> {selectedEvent.room}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedEvent.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-[#1668e8] text-white font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#145ac7]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Open Google Meet Video Call</span>
              </a>

              <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

    </div>
  );
};
