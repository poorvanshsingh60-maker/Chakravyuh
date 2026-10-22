import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  UserRound 
} from 'lucide-react';

export const UpcomingEventsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');

  const events = [
    {
      id: 'ev-1',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Design Exercise 1',
      interviewer: 'Claire Pritchett',
      time: '9:00 AM – 9:30 AM PST',
      room: 'Virtual Pod Alpha (Google Meet)',
      type: 'VIRTUAL',
      date: 'May 18, 2024 (Today)'
    },
    {
      id: 'ev-2',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Company Values',
      interviewer: 'Phil Dunphy',
      time: '9:30 AM – 10:00 AM PST',
      room: 'Virtual Pod Gamma',
      type: 'VIRTUAL',
      date: 'May 18, 2024 (Today)'
    },
    {
      id: 'ev-3',
      candidate: 'Zach Buechler',
      role: 'Product Designer',
      round: 'Design Presentation',
      interviewer: 'Manny Delgado',
      time: '10:00 AM – 11:00 AM PST',
      room: 'Conference Suite 402',
      type: 'PHYSICAL',
      date: 'May 18, 2024 (Today)'
    },
    {
      id: 'ev-4',
      candidate: 'Alex Rivera',
      role: 'Staff Distributed Systems Engineer',
      round: 'System Architecture (Raft & Storage)',
      interviewer: 'Manny Delgado',
      time: '1:00 PM – 2:00 PM PST',
      room: 'Virtual Pod Alpha',
      type: 'VIRTUAL',
      date: 'May 19, 2024 (Tomorrow)'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">Upcoming events</h1>
            <p className="text-xs text-[#667085] mt-1">
              Confirmed candidate onsite loops, panel sessions, and room bookings.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f2f4f7] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTimeframe('TODAY')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'TODAY' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('WEEK')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'WEEK' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('MONTH')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'MONTH' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
              }`}
            >
              Month View
            </button>
          </div>
        </div>
      </div>

      {/* Events Agenda */}
      <div className="p-8 max-w-5xl space-y-4">
        <div className="border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs divide-y divide-[#eaecf0]">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#101828]">{ev.round}</span>
                    <span className="text-[11px] font-medium text-[#1668e8] bg-[#e7f2fe] px-2 py-0.2 rounded border border-[#bcd7fd]">
                      {ev.candidate}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#475467]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#98a2b3]" />
                      {ev.date} • {ev.time}
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
                <a 
                  href="https://meet.google.com" 
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

    </div>
  );
};
