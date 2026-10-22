import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Menu, 
  Maximize2, 
  Minimize2,
  Check, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { TimezoneSelector } from '../common/TimezoneSelector';
import { useTimezone } from '../../context/TimezoneContext';

interface AutomateSchedulingViewProps {
  onGoToCommunications: () => void;
  candidateName?: string;
  roleName?: string;
}

interface InterviewSession {
  id: string;
  title: string;
  interviewer: string;
  interviewerAvatar: string;
  interviewerRole: string;
  pstTimeSlot: string; // Base PST time slot
  pstRowHour: number; // Row hour in PST (e.g. 9 for 9 am, 10 for 10 am, 13 for 1 pm)
  durationMins: number;
  room: string;
  type: 'design' | 'values' | 'presentation' | 'bar_raiser';
}

export const AutomateSchedulingView: React.FC<AutomateSchedulingViewProps> = ({ 
  onGoToCommunications,
  candidateName = 'Zach Buechler',
  roleName = 'Product Design Onsite'
}) => {
  const { convertTime, convertHourLabel, currentTimezone } = useTimezone();

  // State
  const [scheduleApplied, setScheduleApplied] = useState(false);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C'>('A');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeInterviewerModal, setActiveInterviewerModal] = useState<any | null>(null);

  // Available dates for navigation
  const availableDates = [
    { label: 'May 18, 2024', dayName: 'Saturday' },
    { label: 'May 19, 2024', dayName: 'Sunday' },
    { label: 'May 20, 2024', dayName: 'Monday' },
    { label: 'May 21, 2024', dayName: 'Tuesday' }
  ];

  const currentDate = availableDates[currentDateIndex];

  // Schedule datasets per Option
  const optionSessions: Record<'A' | 'B' | 'C', InterviewSession[]> = {
    A: [
      {
        id: 'sess-1',
        title: 'Design Exercise 1',
        interviewer: 'Claire Pritchett',
        interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Principal Designer & Bar Raiser',
        pstTimeSlot: '9-9:30 am PST',
        pstRowHour: 9,
        durationMins: 30,
        room: 'Virtual Pod Alpha',
        type: 'design'
      },
      {
        id: 'sess-2',
        title: 'Company Values',
        interviewer: 'Phil Dunphy',
        interviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Senior Product Manager',
        pstTimeSlot: '9:30-10 am PST',
        pstRowHour: 9,
        durationMins: 30,
        room: 'Virtual Pod Gamma',
        type: 'values'
      },
      {
        id: 'sess-3',
        title: 'Design Presentation',
        interviewer: 'Manny Delgado',
        interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Staff Systems Architect',
        pstTimeSlot: '10-11 am PST',
        pstRowHour: 10,
        durationMins: 60,
        room: 'Conference Suite 402',
        type: 'presentation'
      }
    ],
    B: [
      {
        id: 'sess-b1',
        title: 'Design Exercise 1',
        interviewer: 'Claire Pritchett',
        interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Principal Designer & Bar Raiser',
        pstTimeSlot: '1-1:45 pm PST',
        pstRowHour: 13,
        durationMins: 45,
        room: 'Virtual Pod Alpha',
        type: 'design'
      },
      {
        id: 'sess-b2',
        title: 'Executive Calibration',
        interviewer: 'Phil Dunphy',
        interviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Director of Engineering',
        pstTimeSlot: '1:45-2:30 pm PST',
        pstRowHour: 13,
        durationMins: 45,
        room: 'Virtual Pod Gamma',
        type: 'values'
      },
      {
        id: 'sess-b3',
        title: 'Design Presentation',
        interviewer: 'Manny Delgado',
        interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Staff Systems Architect',
        pstTimeSlot: '2:30-3:30 pm PST',
        pstRowHour: 14,
        durationMins: 60,
        room: 'Executive Suite 402',
        type: 'presentation'
      }
    ],
    C: [
      {
        id: 'sess-c1',
        title: 'Design Exercise 1 & Values (Part 1)',
        interviewer: 'Claire Pritchett',
        interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Principal Designer',
        pstTimeSlot: '10-11 am PST',
        pstRowHour: 10,
        durationMins: 60,
        room: 'Virtual Pod Alpha',
        type: 'design'
      },
      {
        id: 'sess-c2',
        title: 'Portfolio & System Presentation (Part 2)',
        interviewer: 'Manny Delgado',
        interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        interviewerRole: 'Staff Architect',
        pstTimeSlot: '11 am-12 pm PST',
        pstRowHour: 11,
        durationMins: 60,
        room: 'Virtual Pod Gamma',
        type: 'presentation'
      }
    ]
  };

  const [activeSessions, setActiveSessions] = useState<InterviewSession[]>(optionSessions.A);

  // When selected option changes, update sessions
  const handleSelectOption = (opt: 'A' | 'B' | 'C') => {
    setSelectedOption(opt);
    setActiveSessions(optionSessions[opt]);
    setOptionsModalOpen(false);
    setScheduleApplied(true);
  };

  // Add interview modal state
  const [newTitle, setNewTitle] = useState('');
  const [newInterviewer, setNewInterviewer] = useState('Claire Pritchett');
  const [newHour, setNewHour] = useState('11');
  const [newDuration, setNewDuration] = useState('45');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const hourNum = parseInt(newHour, 10);
    const pstSlot = `${hourNum > 12 ? hourNum - 12 : hourNum}:00 ${hourNum >= 12 ? 'PM' : 'AM'} – ${hourNum > 12 ? hourNum - 11 : hourNum + 1}:00 ${hourNum >= 12 ? 'PM' : 'AM'} PST`;

    const newSess: InterviewSession = {
      id: `sess-${Date.now()}`,
      title: newTitle,
      interviewer: newInterviewer,
      interviewerAvatar: newInterviewer.includes('Claire') 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
        : newInterviewer.includes('Phil')
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      interviewerRole: 'Calibrated Interviewer',
      pstTimeSlot: pstSlot,
      pstRowHour: hourNum,
      durationMins: parseInt(newDuration, 10),
      room: 'Virtual Pod Alpha',
      type: 'bar_raiser'
    };

    setActiveSessions([...activeSessions, newSess]);
    setAddModalOpen(false);
    setNewTitle('');
    setScheduleApplied(true);
  };

  // Interviewers participating in this candidate loop
  const loopInterviewers = [
    {
      name: 'Claire Pritchett',
      role: 'Principal Designer & Bar Raiser',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      hoursBooked: '0.5h',
      feedbackCount: 2,
      pins: 2,
      skills: ['Figma', 'Interaction Design', 'Design Systems'],
      load: '4 / 8 slots this week'
    },
    {
      name: 'Phil Dunphy',
      role: 'Senior Product Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      hoursBooked: '0.5h',
      feedbackCount: 3,
      pins: 0,
      skills: ['Company Values', 'Product Execution', 'User Research'],
      load: '3 / 6 slots this week'
    },
    {
      name: 'Manny Delgado',
      role: 'Staff Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      hoursBooked: '1h',
      feedbackCount: 0,
      pins: 0,
      skills: ['Systems Architecture', 'High Scale', 'Latency Tradeoffs'],
      load: '2 / 5 slots this week'
    }
  ];

  // Base PST time rows (8 AM to 4 PM)
  const basePstHours = [8, 9, 10, 11, 13, 14, 15];

  return (
    <div className={`flex-1 flex flex-col min-h-screen bg-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="px-8 pt-6 pb-2 border-b border-[#eaecf0] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#e7f2fe] text-[#1668e8] border border-[#bcd7fd] uppercase">
                Active Optimization Loop
              </span>
              <span className="text-xs text-[#667085]">
                • Google OR-Tools CP-SAT Zero-Conflict Solver
              </span>
            </div>
            <h1 className="text-lg font-semibold text-[#101828] mt-1">
              Scheduled <span className="font-bold">{candidateName}</span> for <span className="font-bold">{roleName}</span>
            </h1>
          </div>

          {/* Timezone Selector Component */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#667085] hidden md:inline">Viewing in:</span>
            <TimezoneSelector />
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button className="flex items-center gap-1.5 pb-3 text-[#1668e8] border-b-2 border-[#1668e8] font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>Find a schedule</span>
            <span className="text-[#98a2b3] ml-1">&gt;</span>
          </button>
          <button 
            onClick={onGoToCommunications}
            className="flex items-center gap-1.5 pb-3 text-[#667085] hover:text-[#101828] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-8 py-3.5 flex items-center justify-between border-b border-[#f2f4f7] bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setOptionsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb] shadow-2xs transition-colors"
          >
            <Menu className="w-3.5 h-3.5 text-[#667085]" />
            <span>All schedule options</span>
            <span className="text-[10px] bg-[#e7f2fe] text-[#1668e8] px-1.5 py-0.2 rounded font-bold">
              Option {selectedOption} Active
            </span>
          </button>

          <span className="text-xs text-[#667085] hidden sm:inline">
            3 Zero-Conflict combinations computed
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb] transition-colors"
          >
            + Add interview
          </button>
          <button 
            onClick={() => setScheduleApplied(true)}
            className={`px-5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 ${
              scheduleApplied
                ? 'bg-[#0b7c3e] text-white hover:bg-[#096a34]'
                : 'bg-[#1668e8] hover:bg-[#145ac7] text-white'
            }`}
          >
            {scheduleApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Schedule Applied & Locked</span>
              </>
            ) : (
              <span>Use Schedule</span>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {scheduleApplied && (
        <div className="mx-8 mt-4 p-3.5 rounded-xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0b7c3e] shrink-0" />
            Schedule Option {selectedOption} locked into CP-SAT calendar for {candidateName} in {currentTimezone.shortName}!
          </span>
          <button 
            onClick={onGoToCommunications}
            className="underline hover:text-[#085a2d] font-bold shrink-0 text-left sm:text-right"
          >
            Proceed to Candidate Communications →
          </button>
        </div>
      )}

      {/* Date Bar & Fullscreen Switcher */}
      <div className="px-8 py-3 flex items-center justify-between border-b border-[#eaecf0] bg-[#fafafa]">
        <div className="flex items-center gap-3">
          {/* Day Navigation */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentDateIndex(Math.max(0, currentDateIndex - 1))}
              disabled={currentDateIndex === 0}
              className="p-1 rounded hover:bg-[#eaecf0] text-[#667085] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-[#101828] min-w-[130px] text-center">
              {currentDate.label}
            </span>
            <button 
              onClick={() => setCurrentDateIndex(Math.min(availableDates.length - 1, currentDateIndex + 1))}
              disabled={currentDateIndex === availableDates.length - 1}
              className="p-1 rounded hover:bg-[#eaecf0] text-[#667085] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option Indicator Badge */}
          {selectedOption === 'A' && (
            <span className="text-[11px] font-medium bg-[#ecfdf3] text-[#0b7c3e] px-2 py-0.5 rounded border border-[#abefc6]">
              Option A: Continuous Flow (Zero idle gaps)
            </span>
          )}
          {selectedOption === 'B' && (
            <span className="text-[11px] font-medium bg-[#e7f2fe] text-[#1668e8] px-2 py-0.5 rounded border border-[#bcd7fd]">
              Option B: Afternoon Block
            </span>
          )}
          {selectedOption === 'C' && (
            <span className="text-[11px] font-medium bg-[#f4ebff] text-[#6941c6] px-2 py-0.5 rounded border border-[#d6bbfb]">
              Option C: 2-Day Split
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#667085] font-mono">
            Timezone: <span className="font-bold text-[#101828]">{currentTimezone.shortName}</span>
          </span>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-[#eaecf0] hover:bg-white text-[#667085] hover:text-[#101828]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Matrix View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Calendar Matrix View */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[980px]">
          
          {/* Column Headers */}
          <div className="grid grid-cols-12 border-b border-[#eaecf0] bg-white sticky top-0 z-10 text-xs">
            
            {/* Candidate Schedule Column */}
            <div className="col-span-3 p-3.5 border-r border-[#eaecf0] flex items-center justify-between text-[#344054] font-medium bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#667085]" />
                <span className="font-semibold text-[13px] text-[#101828]">Candidate schedule</span>
              </div>
              <span className="text-[10px] font-mono text-[#667085] px-1.5 py-0.5 bg-white rounded border border-[#eaecf0]">
                {currentTimezone.shortName}
              </span>
            </div>

            {/* Loop Interviewers Columns */}
            {loopInterviewers.map((int, i) => (
              <div 
                key={int.name}
                onClick={() => setActiveInterviewerModal(int)}
                className={`col-span-3 p-3 cursor-pointer hover:bg-[#f9fafb] transition-colors ${
                  i < loopInterviewers.length - 1 ? 'border-r border-[#eaecf0]' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img 
                    src={int.avatar} 
                    alt={int.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#eaecf0]" 
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-[#101828] leading-tight truncate">{int.name}</h4>
                    <p className="text-[11px] text-[#667085] truncate">{int.role.split('&')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#475467] font-medium pt-1 border-t border-[#f2f4f7]">
                  <span>📅 {int.hoursBooked}</span>
                  <span>📋 {int.feedbackCount}</span>
                  <span className="text-[#1668e8] font-bold text-[10px] underline">Details</span>
                </div>
              </div>
            ))}

          </div>

          {/* Time Rows Grid */}
          <div className="relative text-xs select-none divide-y divide-[#eaecf0]">
            {basePstHours.map((pstHour) => {
              const convertedHour = convertHourLabel(pstHour);
              const matchingCandidateSessions = activeSessions.filter(s => s.pstRowHour === pstHour);

              return (
                <div key={pstHour} className="grid grid-cols-12 min-h-[90px]">
                  
                  {/* Candidate Column */}
                  <div className="col-span-3 p-2.5 border-r border-[#eaecf0] space-y-2 bg-[#fcfcfd]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101828] text-xs">
                        {convertedHour.full}
                      </span>
                      <span className="text-[10px] text-[#98a2b3] font-mono">
                        ({pstHour}:00 PT)
                      </span>
                    </div>

                    {matchingCandidateSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs space-y-1 hover:bg-[#145ac7] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-xs">{session.title}</p>
                          <span className="text-[10px] font-mono bg-white/20 px-1 rounded">
                            {session.durationMins}m
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">
                          {convertTime(session.pstTimeSlot)}
                        </p>
                        <div className="text-[10px] opacity-75 flex items-center gap-1 pt-0.5">
                          <User className="w-2.5 h-2.5" />
                          <span>{session.interviewer}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interviewer Columns */}
                  {loopInterviewers.map((int, i) => {
                    const matchingIntSessions = activeSessions.filter(
                      s => s.pstRowHour === pstHour && s.interviewer === int.name
                    );

                    return (
                      <div 
                        key={int.name}
                        className={`col-span-3 p-2.5 space-y-1.5 ${
                          i < loopInterviewers.length - 1 ? 'border-r border-[#eaecf0]' : ''
                        }`}
                      >
                        {matchingIntSessions.map((session) => (
                          <div 
                            key={session.id}
                            className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs space-y-1 hover:bg-[#145ac7] transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-xs">{session.title}</p>
                              <span className="text-[10px] font-mono bg-white/20 px-1 rounded">
                                {session.durationMins}m
                              </span>
                            </div>
                            <p className="text-[11px] opacity-90">
                              {convertTime(session.pstTimeSlot)}
                            </p>
                            <div className="text-[10px] opacity-75 flex items-center gap-1 pt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{session.room}</span>
                            </div>
                          </div>
                        ))}

                        {matchingIntSessions.length === 0 && (
                          <div className="w-full h-8 bg-[#f9fafb] rounded border border-dashed border-[#eaecf0] flex items-center justify-center text-[10px] text-[#98a2b3]">
                            Free / Unscheduled
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Modal: All Schedule Options */}
      {optionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1668e8]" />
                  <h3 className="text-base font-bold text-[#101828]">Engine Computed Schedule Options</h3>
                </div>
                <p className="text-xs text-[#667085] mt-0.5">
                  Google OR-Tools CP-SAT formulated 3 feasible, zero-conflict round assignments.
                </p>
              </div>
              <button onClick={() => setOptionsModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Option A */}
              <div 
                onClick={() => setSelectedOption('A')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'A' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option A (Recommended)</span>
                  <span className="text-[11px] font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-2 py-0.5 rounded border border-[#abefc6]">
                    Optimal • Zero Gaps
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">
                  May 18, 2024 • {convertTime('9:00 AM – 11:00 AM PST')} (Continuous)
                </p>
                <p className="text-[11px] text-[#667085] mt-1">
                  Panel: Claire Pritchett, Phil Dunphy, Manny Delgado
                </p>
              </div>

              {/* Option B */}
              <div 
                onClick={() => setSelectedOption('B')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'B' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option B</span>
                  <span className="text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2 py-0.5 rounded border border-[#bcd7fd]">
                    Afternoon Block
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">
                  May 18, 2024 • {convertTime('1:00 PM – 3:30 PM PST')}
                </p>
                <p className="text-[11px] text-[#667085] mt-1">
                  Panel: Claire Pritchett, Phil Dunphy, Manny Delgado
                </p>
              </div>

              {/* Option C */}
              <div 
                onClick={() => setSelectedOption('C')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'C' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option C</span>
                  <span className="text-[11px] font-semibold text-[#6941c6] bg-[#f4ebff] px-2 py-0.5 rounded border border-[#d6bbfb]">
                    2-Day Split
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">
                  May 18 (Part 1) + May 19 (Part 2) • {convertTime('10:00 AM – 12:00 PM PST')}
                </p>
                <p className="text-[11px] text-[#667085] mt-1">
                  Reduces candidate fatigue across two consecutive morning slots
                </p>
              </div>

            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
              <button 
                onClick={() => setOptionsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] text-xs font-medium hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSelectOption(selectedOption)}
                className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs"
              >
                Apply Option {selectedOption} to Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Interview Session */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <h3 className="text-base font-bold text-[#101828]">Add Interview Round</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">✕</button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Round Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Executive Bar Raiser"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Assigned Interviewer</label>
                <select 
                  value={newInterviewer}
                  onChange={(e) => setNewInterviewer(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] bg-white"
                >
                  <option>Claire Pritchett (Principal Designer & Bar Raiser)</option>
                  <option>Phil Dunphy (Senior Product Manager)</option>
                  <option>Manny Delgado (Staff Systems Architect)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Starting Hour (PT)</label>
                  <select 
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                    className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] bg-white"
                  >
                    <option value="8">8:00 AM PT</option>
                    <option value="9">9:00 AM PT</option>
                    <option value="10">10:00 AM PT</option>
                    <option value="11">11:00 AM PT</option>
                    <option value="13">1:00 PM PT</option>
                    <option value="14">2:00 PM PT</option>
                    <option value="15">3:00 PM PT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Duration</label>
                  <select 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] bg-white"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] font-medium hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs"
                >
                  Append to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interviewer Details */}
      {activeInterviewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-start justify-between border-b border-[#eaecf0] pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={activeInterviewerModal.avatar} 
                  alt={activeInterviewerModal.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1668e8]"
                />
                <div>
                  <h3 className="text-base font-bold text-[#101828]">{activeInterviewerModal.name}</h3>
                  <p className="text-xs text-[#667085]">{activeInterviewerModal.role}</p>
                </div>
              </div>
              <button onClick={() => setActiveInterviewerModal(null)} className="text-[#98a2b3] hover:text-[#101828]">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#eaecf0] space-y-1">
                <span className="font-semibold text-[#344054] block">Weekly Burnout Status</span>
                <p className="text-[#101828] font-bold">{activeInterviewerModal.load}</p>
                <span className="text-[11px] text-[#0b7c3e]">✓ Within safe CP-SAT fatigue threshold</span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#344054] block">Calibrated Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeInterviewerModal.skills.map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-[#f2f4f7] text-[#344054] border border-[#eaecf0] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInterviewerModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1668e8] text-white font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
