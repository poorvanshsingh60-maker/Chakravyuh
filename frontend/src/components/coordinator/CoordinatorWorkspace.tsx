import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Cpu, 
  CheckCircle2, 
  Plus, 
  Settings2, 
  Sparkles, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Check, 
  Send,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { RoundForm } from '../forms/RoundForm';
import { RoomForm } from '../forms/RoomForm';
import { InterviewRound } from '../../types/interviewRound';
import { Room } from '../../types/room';
import { TimezoneSelector } from '../common/TimezoneSelector';
import { useTimezone } from '../../context/TimezoneContext';

interface CalendarEventItem {
  id: string;
  candidateName: string;
  candidateRole: string;
  roundName: string;
  roundType: 'tech' | 'arch' | 'values';
  interviewer: string;
  interviewerAvatar: string;
  room: string;
  dayIndex: number; // 0 for Mon, 1 for Tue, etc.
  pstHour: number; // 9 for 9 am, 10 for 10 am, 14 for 2 pm PST
  durationMins: number;
}

export const CoordinatorWorkspace: React.FC = () => {
  const { convertHourLabel, currentTimezone } = useTimezone();
  const [activeTab, setActiveTab] = useState<'solver' | 'config'>('solver');
  const [configSubTab, setConfigSubTab] = useState<'rounds' | 'rooms'>('rounds');

  // --- Pipeline Configuration State ---
  const [rounds, setRounds] = useState<InterviewRound[]>([
    {
      id: 'round-1',
      name: 'Technical Screen (Coding)',
      sequenceOrder: 1,
      durationMinutes: 45,
      requiredSkillIds: ['Data Structures', 'Algorithms', 'Python'],
      prerequisiteRoundIds: [],
      interviewerCount: 1,
      description: 'First screening round'
    },
    {
      id: 'round-2',
      name: 'Distributed Systems & Architecture',
      sequenceOrder: 2,
      durationMinutes: 60,
      requiredSkillIds: ['System Design', 'Scalability', 'Microservices'],
      prerequisiteRoundIds: ['round-1'],
      interviewerCount: 2,
      description: 'Core onsite architectural loop'
    },
    {
      id: 'round-3',
      name: 'Engineering Values & Leadership',
      sequenceOrder: 3,
      durationMinutes: 45,
      requiredSkillIds: ['Collaboration', 'Leadership', 'Culture'],
      prerequisiteRoundIds: ['round-1'],
      interviewerCount: 1,
      description: 'Behavioral & leadership assessment'
    }
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room-1',
      name: 'Virtual Pod Alpha (Google Meet)',
      type: 'VIRTUAL',
      capacity: 6,
      location: 'Virtual Cloud Bridge',
      meetingUrl: 'https://meet.google.com/chk-pod-alpha',
      isActive: true,
      utilizationRate: 0.65
    },
    {
      id: 'room-2',
      name: 'Turing Conference Suite 402',
      type: 'PHYSICAL',
      capacity: 8,
      location: 'HQ West Campus (4th Floor)',
      isActive: true,
      utilizationRate: 0.8
    },
    {
      id: 'room-3',
      name: 'Lovelace Interview Pod 2B',
      type: 'PHYSICAL',
      capacity: 4,
      location: 'HQ West Campus (2nd Floor)',
      isActive: true,
      utilizationRate: 0.45
    }
  ]);

  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // --- Solver & Master Calendar State ---
  const [startDate, setStartDate] = useState('2026-10-26');
  const [endDate, setEndDate] = useState('2026-10-30');
  const [solverRunning, setSolverRunning] = useState(false);
  const [solverModalOpen, setSolverModalOpen] = useState(false);
  const [solverStep, setSolverStep] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState<'v1.0' | 'v2.4'>('v2.4');
  const [isPublished, setIsPublished] = useState(false);
  const [publishBanner, setPublishBanner] = useState(false);

  // Constraints options
  const [preventDoubleBooking, setPreventDoubleBooking] = useState(true);
  const [respectAvailability, setRespectAvailability] = useState(true);
  const [enforcePrerequisites, setEnforcePrerequisites] = useState(true);
  const [balanceWorkload, setBalanceWorkload] = useState(true);
  const [minimizeIdleGaps, setMinimizeIdleGaps] = useState(true);

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  // Master schedule calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([
    {
      id: 'inv-1',
      candidateName: 'Alex Mercer',
      candidateRole: 'Staff Distributed Systems',
      roundName: 'Technical Screen (Coding)',
      roundType: 'tech',
      interviewer: 'Dr. Sarah Chen',
      interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      room: 'Virtual Pod Alpha',
      dayIndex: 0, // Mon
      pstHour: 10,
      durationMins: 45
    },
    {
      id: 'inv-2',
      candidateName: 'Elena Rostova',
      candidateRole: 'Senior Backend Engineer',
      roundName: 'System Architecture',
      roundType: 'arch',
      interviewer: 'Phil Dunphy',
      interviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      room: 'Turing Suite 402',
      dayIndex: 0, // Mon
      pstHour: 14,
      durationMins: 60
    },
    {
      id: 'inv-3',
      candidateName: 'Marcus Vance',
      candidateRole: 'Platform Security Lead',
      roundName: 'Technical Screen (Coding)',
      roundType: 'tech',
      interviewer: 'Manny Delgado',
      interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      room: 'Virtual Pod Alpha',
      dayIndex: 1, // Tue
      pstHour: 11,
      durationMins: 45
    },
    {
      id: 'inv-4',
      candidateName: 'Alex Mercer',
      candidateRole: 'Staff Distributed Systems',
      roundName: 'Distributed Systems & Architecture',
      roundType: 'arch',
      interviewer: 'Phil Dunphy',
      interviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      room: 'Lovelace Pod 2B',
      dayIndex: 2, // Wed
      pstHour: 13,
      durationMins: 60
    },
    {
      id: 'inv-5',
      candidateName: 'Elena Rostova',
      candidateRole: 'Senior Backend Engineer',
      roundName: 'Engineering Values & Culture',
      roundType: 'values',
      interviewer: 'Claire Pritchett',
      interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      room: 'Virtual Pod Alpha',
      dayIndex: 3, // Thu
      pstHour: 15,
      durationMins: 45
    },
    {
      id: 'inv-6',
      candidateName: 'Alex Mercer',
      candidateRole: 'Staff Distributed Systems',
      roundName: 'Engineering Values & Leadership',
      roundType: 'values',
      interviewer: 'Claire Pritchett',
      interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      room: 'Turing Suite 402',
      dayIndex: 4, // Fri
      pstHour: 14,
      durationMins: 45
    }
  ]);

  // Compute dynamic day column headers based on startDate
  const getDaysForWeek = (startStr: string) => {
    try {
      const base = new Date(startStr);
      const days = [];
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      for (let i = 0; i < 5; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days.push({
          dayOfWeek: dayNames[i],
          formattedDate: `${dayNames[i]} ${dateStr}`,
          fullDate: d.toISOString().split('T')[0]
        });
      }
      return days;
    } catch {
      return [
        { dayOfWeek: 'Mon', formattedDate: 'Monday, Oct 26', fullDate: '2026-10-26' },
        { dayOfWeek: 'Tue', formattedDate: 'Tuesday, Oct 27', fullDate: '2026-10-27' },
        { dayOfWeek: 'Wed', formattedDate: 'Wednesday, Oct 28', fullDate: '2026-10-28' },
        { dayOfWeek: 'Thu', formattedDate: 'Thursday, Oct 29', fullDate: '2026-10-29' },
        { dayOfWeek: 'Fri', formattedDate: 'Friday, Oct 30', fullDate: '2026-10-30' }
      ];
    }
  };

  const weekDays = getDaysForWeek(startDate);

  // PST reference hours
  const pstHours = [9, 10, 11, 13, 14, 15, 16];

  // Handle Add Round
  const handleAddRound = (newRoundData: any) => {
    const roundItem: InterviewRound = {
      id: `round-${Date.now()}`,
      name: newRoundData.name || 'New Interview Round',
      sequenceOrder: newRoundData.sequenceOrder || rounds.length + 1,
      durationMinutes: newRoundData.durationMinutes || 60,
      requiredSkillIds: newRoundData.requiredSkillIds || ['General Technical'],
      prerequisiteRoundIds: newRoundData.prerequisiteRoundIds || [],
      interviewerCount: newRoundData.interviewerCount || 1,
      description: newRoundData.description || 'Configured via pipeline manager'
    };
    setRounds([...rounds, roundItem]);
    setRoundModalOpen(false);
  };

  // Handle Add Room
  const handleAddRoom = (newRoomData: any) => {
    const roomItem: Room = {
      id: `room-${Date.now()}`,
      name: newRoomData.name || 'Meeting Room',
      type: newRoomData.type || 'PHYSICAL',
      capacity: newRoomData.capacity || 4,
      location: newRoomData.location || 'HQ West Campus',
      isActive: true,
      meetingUrl: newRoomData.meetingUrl || 'https://meet.google.com/chk-new-pod'
    };
    setRooms([...rooms, roomItem]);
    setRoomModalOpen(false);
  };

  // Run Solver Simulation
  const handleTriggerSolver = () => {
    setSolverRunning(true);
    setSolverModalOpen(true);
    setSolverStep(1);

    setTimeout(() => setSolverStep(2), 600);
    setTimeout(() => setSolverStep(3), 1300);
    setTimeout(() => {
      setSolverStep(4);
      setSolverRunning(false);
      setSelectedVersion('v2.4');
    }, 2000);
  };

  // Handle Publish
  const handlePublish = () => {
    setIsPublished(true);
    setPublishBanner(true);
    setTimeout(() => setPublishBanner(false), 5000);
  };

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col min-h-screen">
      
      {/* Top Coordinator Sub-Header */}
      <div className="bg-white border-b border-[#eaecf0] px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e7f2fe] text-[#1668e8] border border-[#b2d5fe] uppercase tracking-wider">
                👑 Coordinator Workspace
              </span>
              <span className="text-xs text-[#667085]">
                • Combinatorial Constraint Optimization & Loop Orchestration
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#101828] mt-1 tracking-tight">
              Master Scheduling & Optimization Engine
            </h1>
          </div>

          {/* Timezone Selector & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <TimezoneSelector />

            <div className="flex items-center p-1 bg-[#f2f4f7] rounded-lg border border-[#eaecf0]">
              <button
                onClick={() => setActiveTab('solver')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'solver'
                    ? 'bg-white text-[#101828] shadow-2xs border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#1668e8]" />
                <span>CP-SAT Solver & Master Calendar</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'config'
                    ? 'bg-white text-[#101828] shadow-2xs border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-[#667085]" />
                <span>Pipeline Config View</span>
                <span className="ml-1 px-1.5 py-0.2 bg-[#e7f2fe] text-[#1668e8] text-[10px] font-bold rounded-full">
                  {rounds.length + rooms.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Publish Banner */}
        {publishBanner && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#12b76a]" />
              <div>
                <span className="font-bold block">
                  Schedule version v2.4 successfully published!
                </span>
                <span className="text-[11px] font-normal text-[#065f46]">
                  Calendar invites and meeting links dispatched to all candidates and interviewers in {currentTimezone.label}.
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded border border-[#a6f4c5]">
              PUBLISHED & LIVE
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* ============================================================== */}
        {/* VIEW 1: CP-SAT SOLVER PANEL & MASTER SCHEDULE CALENDAR */}
        {/* ============================================================== */}
        {activeTab === 'solver' && (
          <div className="space-y-6">
            
            {/* Solver Trigger Bar (SolverPanel) */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-6 shadow-2xs space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f2f4f7]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#12b76a] animate-pulse"></span>
                    <h2 className="text-sm font-bold text-[#101828] tracking-tight">
                      Google OR-Tools CP-SAT Optimization Engine
                    </h2>
                    <Badge variant="info">Batch Horizon Solver</Badge>
                  </div>
                  <p className="text-xs text-[#667085] mt-1">
                    Select target scheduling window and constraint parameters to automatically orchestrate candidate loops without resource conflicts.
                  </p>
                </div>

                {/* Primary Generate Schedule Action Button */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleTriggerSolver}
                    disabled={solverRunning}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-xs hover:shadow transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{solverRunning ? 'Solving Constraints...' : 'Generate Schedule'}</span>
                  </Button>
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Date Horizon Picker */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#344054] flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Scheduling Date Range</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#667085] block">Start Date</span>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#667085] block">End Date</span>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hard Constraints Toggles */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#344054] block">Hard Constraints (Non-Negotiable)</label>
                  <div className="space-y-1.5 text-xs text-[#344054]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preventDoubleBooking}
                        onChange={(e) => setPreventDoubleBooking(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Zero Overlaps (Candidate / Interviewer / Room)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={enforcePrerequisites}
                        onChange={(e) => setEnforcePrerequisites(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Round Prerequisites (Order 1 before Order 2)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={respectAvailability}
                        onChange={(e) => setRespectAvailability(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Interviewer Weekly Burnout Caps</span>
                    </label>
                  </div>
                </div>

                {/* Soft Objectives */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#344054] block">Soft Optimization Objectives</label>
                  <div className="space-y-1.5 text-xs text-[#344054]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={balanceWorkload}
                        onChange={(e) => setBalanceWorkload(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Balance Interviewer Workload Variance</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={minimizeIdleGaps}
                        onChange={(e) => setMinimizeIdleGaps(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Minimize Idle Gaps Between Rounds</span>
                    </label>
                    <div className="text-[11px] text-[#667085] font-mono mt-1 pt-1 border-t border-[#f2f4f7]">
                      Timeout limit: 30s • CP-SAT threads: 4
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Master Schedule Calendar & Version Bar */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
              
              {/* Calendar Action & Version Selector Header */}
              <div className="p-4 border-b border-[#eaecf0] bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-sm text-[#101828]">
                    Master Schedule Calendar
                  </span>

                  {/* Draft Version Selector */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className="text-[#667085]">Version:</span>
                    <div className="flex p-0.5 bg-white border border-[#d0d5dd] rounded-lg">
                      <button
                        onClick={() => setSelectedVersion('v1.0')}
                        className={`px-2.5 py-1 rounded text-xs transition-all ${
                          selectedVersion === 'v1.0'
                            ? 'bg-[#1668e8] text-white font-bold'
                            : 'text-[#667085] hover:text-[#101828]'
                        }`}
                      >
                        v1.0 (Draft)
                      </button>
                      <button
                        onClick={() => setSelectedVersion('v2.4')}
                        className={`px-2.5 py-1 rounded text-xs transition-all ${
                          selectedVersion === 'v2.4'
                            ? 'bg-[#1668e8] text-white font-bold'
                            : 'text-[#667085] hover:text-[#101828]'
                        }`}
                      >
                        v2.4 (CP-SAT Optimized)
                      </button>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#12b76a]" />
                    0 Conflicts Detected
                  </span>
                </div>

                {/* Publish Schedule Action Button (PublishBtn) */}
                <div className="flex items-center gap-2">
                  {isPublished ? (
                    <Badge variant="success" className="px-3 py-1.5 text-xs flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Published & Dispatched</span>
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handlePublish}
                      className="flex items-center gap-1.5 text-xs py-1.5 px-4 font-bold bg-[#12b76a] hover:bg-[#0e9f5d]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Schedule</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Master Calendar Matrix Grid */}
              <div className="p-4 overflow-x-auto">
                <div className="min-w-[840px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-6 border-b border-[#eaecf0] pb-2 text-xs font-bold text-[#475467]">
                    <div className="col-span-1 text-center text-[#98a2b3] flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Time ({currentTimezone.shortName})</span>
                    </div>
                    {weekDays.map((day) => (
                      <div key={day.fullDate} className="col-span-1 text-center py-1.5 bg-[#f9fafb] rounded-lg border border-[#eaecf0] mx-1">
                        <span className="block text-[11px] text-[#101828] font-bold">{day.formattedDate}</span>
                      </div>
                    ))}
                  </div>

                  {/* Grid Rows */}
                  <div className="divide-y divide-[#f2f4f7] text-xs">
                    {pstHours.map((pstH) => {
                      const convertedTime = convertHourLabel(pstH);

                      return (
                        <div key={pstH} className="grid grid-cols-6 py-3 items-center min-h-[76px]">
                          {/* Time Column Header */}
                          <div className="col-span-1 text-center font-mono text-[#101828] font-bold text-xs">
                            <span>{convertedTime.full}</span>
                            <span className="text-[10px] text-[#98a2b3] block font-normal">
                              ({pstH}:00 PT)
                            </span>
                          </div>

                          {/* 5 Day Slots */}
                          {weekDays.map((_, dayIdx) => {
                            const matchingEvents = calendarEvents.filter(
                              (e) => e.dayIndex === dayIdx && e.pstHour === pstH
                            );

                            return (
                              <div key={dayIdx} className="col-span-1 px-1 h-full flex flex-col justify-center">
                                {matchingEvents.map((evt) => (
                                  <div
                                    key={evt.id}
                                    onClick={() => setSelectedEvent(evt)}
                                    className={`p-2.5 rounded-lg border text-left space-y-1 shadow-2xs transition-transform hover:scale-[1.02] cursor-pointer ${
                                      evt.roundType === 'tech'
                                        ? 'bg-[#eff8ff] border-[#b2ddff] text-[#175cd3]'
                                        : evt.roundType === 'arch'
                                        ? 'bg-[#f9f5ff] border-[#e9d7fe] text-[#6941c6]'
                                        : 'bg-[#ecfdf3] border-[#a6f4c5] text-[#027a48]'
                                    }`}
                                  >
                                    <div className="font-bold text-[11px] truncate flex items-center justify-between">
                                      <span>{evt.candidateName}</span>
                                      <span className="text-[9px] uppercase px-1 rounded bg-white/70 font-bold">
                                        {evt.roundType}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-[#344054] font-medium truncate">
                                      {evt.roundName}
                                    </div>
                                    <div className="text-[9px] text-[#667085] flex items-center gap-1 truncate">
                                      <User className="w-2.5 h-2.5" />
                                      <span>{evt.interviewer}</span>
                                    </div>
                                    <div className="text-[9px] text-[#667085] flex items-center gap-1 truncate">
                                      <MapPin className="w-2.5 h-2.5" />
                                      <span>{evt.room}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend Footer */}
              <div className="p-3 bg-[#fafafa] border-t border-[#eaecf0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#667085]">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-semibold text-[#344054]">Round Types:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#eff8ff] border border-[#b2ddff]"></span>
                    <span>Technical Screen</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#f9f5ff] border border-[#e9d7fe]"></span>
                    <span>System Architecture</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#ecfdf3] border border-[#a6f4c5]"></span>
                    <span>Values & Leadership</span>
                  </div>
                </div>
                <span className="font-mono text-[11px]">
                  Total Scheduled: {calendarEvents.length} Sessions (Click any session to inspect)
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: PIPELINE CONFIG VIEW (ConfigTabs: RoundForm & RoomForm) */}
        {/* ============================================================== */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            
            {/* Sub-tabs header */}
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConfigSubTab('rounds')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    configSubTab === 'rounds'
                      ? 'bg-[#1668e8] text-white shadow-xs'
                      : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                  }`}
                >
                  Interview Rounds ({rounds.length})
                </button>

                <button
                  onClick={() => setConfigSubTab('rooms')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    configSubTab === 'rooms'
                      ? 'bg-[#1668e8] text-white shadow-xs'
                      : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                  }`}
                >
                  Meeting Rooms & Pods ({rooms.length})
                </button>
              </div>

              {configSubTab === 'rounds' ? (
                <Button 
                  variant="primary" 
                  onClick={() => setRoundModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Interview Round</span>
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => setRoomModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Meeting Room</span>
                </Button>
              )}
            </div>

            {/* Rounds DataTable */}
            {configSubTab === 'rounds' && (
              <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
                <div className="p-4 bg-[#fafafa] border-b border-[#eaecf0] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#101828]">Configured Pipeline Rounds</span>
                    <p className="text-[#667085] mt-0.5">Enforced sequentially by CP-SAT solver prerequisite constraints.</p>
                  </div>
                  <Badge variant="info">Prerequisite Aware</Badge>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#f9fafb] text-[#475467] font-semibold border-b border-[#eaecf0]">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Round Name</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Required Skills</th>
                      <th className="py-3 px-4">Prerequisites</th>
                      <th className="py-3 px-4">Panel Size</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecf0]">
                    {rounds.map((round) => (
                      <tr key={round.id} className="hover:bg-[#f9fafb]">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#101828]">
                          #{round.sequenceOrder}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#101828]">
                          {round.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#475467]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#98a2b3]" />
                            {round.durationMinutes} mins
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {round.requiredSkillIds.map((sk: string) => (
                              <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f2f4f7] text-[#344054]">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085] font-mono text-[11px]">
                          {round.prerequisiteRoundIds.length > 0 ? (
                            round.prerequisiteRoundIds.join(', ')
                          ) : (
                            <span className="text-[#98a2b3] italic">None (First round)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="neutral">
                            {round.interviewerCount} Interviewer{round.interviewerCount > 1 ? 's' : ''}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => setRounds(rounds.filter(r => r.id !== round.id))}
                            className="p-1 hover:text-red-600 text-[#98a2b3] transition-colors"
                            title="Delete round"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Rooms DataTable */}
            {configSubTab === 'rooms' && (
              <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
                <div className="p-4 bg-[#fafafa] border-b border-[#eaecf0] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#101828]">Available Rooms & Virtual Links</span>
                    <p className="text-[#667085] mt-0.5">Physical rooms and automated Google Meet bridges mapped to scheduled loops.</p>
                  </div>
                  <Badge variant="success">Capacity Verified</Badge>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#f9fafb] text-[#475467] font-semibold border-b border-[#eaecf0]">
                    <tr>
                      <th className="py-3 px-4">Room Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Max Capacity</th>
                      <th className="py-3 px-4">Video Link</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecf0]">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-[#f9fafb]">
                        <td className="py-3.5 px-4 font-semibold text-[#101828]">
                          {room.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={room.type === 'VIRTUAL' ? 'info' : 'neutral'}>
                            {room.type}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-[#475467]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#98a2b3]" />
                            {room.location}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#101828]">
                          {room.capacity} seats
                        </td>
                        <td className="py-3.5 px-4">
                          {room.meetingUrl ? (
                            <span className="flex items-center gap-1 text-[#027a48] font-semibold">
                              <Video className="w-3.5 h-3.5 text-[#12b76a]" />
                              Enabled
                            </span>
                          ) : (
                            <span className="text-[#98a2b3]">In-Person</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => setRooms(rooms.filter(rm => rm.id !== room.id))}
                            className="p-1 hover:text-red-600 text-[#98a2b3] transition-colors"
                            title="Delete room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: INTERVIEW SESSION INSPECTION */}
      {/* ============================================================== */}
      {selectedEvent && (
        <Dialog
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Session Details: ${selectedEvent.roundName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-[#f9fafb] border border-[#eaecf0] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#101828] text-sm block">{selectedEvent.candidateName}</span>
                  <span className="text-[#667085]">{selectedEvent.candidateRole}</span>
                </div>
                <Badge variant={selectedEvent.roundType === 'tech' ? 'info' : 'success'}>
                  {selectedEvent.durationMins} mins
                </Badge>
              </div>

              <div className="pt-2 border-t border-[#eaecf0] space-y-1 text-[#475467]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1668e8]" />
                  <span className="font-semibold text-[#101828]">
                    Time: {convertHourLabel(selectedEvent.pstHour).full} in {currentTimezone.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#667085]" />
                  <span>Interviewer: <strong>{selectedEvent.interviewer}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#667085]" />
                  <span>Assigned Location: <strong>{selectedEvent.room}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://meet.google.com/chk-dist-sys"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-[#1668e8] text-white font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#145ac7]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Google Meet Call</span>
              </a>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCalendarEvents(calendarEvents.filter(e => e.id !== selectedEvent.id));
                    setSelectedEvent(null);
                  }}
                  className="bg-[#d92d20] hover:bg-[#b42318] text-white"
                >
                  Cancel Session
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* ============================================================== */}
      {/* SOLVER PROGRESS & DIAGNOSTIC MODAL (SolverModal) */}
      {/* ============================================================== */}
      <Dialog 
        isOpen={solverModalOpen} 
        onClose={() => !solverRunning && setSolverModalOpen(false)} 
        title="Google OR-Tools CP-SAT Solver Execution"
      >
        <div className="space-y-5 text-xs">
          <p className="text-[#667085]">
            Evaluating combinatorial state space across candidates, interviewers, and room capacities.
          </p>

          <div className="space-y-3 bg-[#fafafa] p-4 rounded-lg border border-[#eaecf0]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">1. Decision Variable Generation</span>
              {solverStep >= 1 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> Complete (384 vars)
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">2. Hard Constraint Matrix Checking</span>
              {solverStep >= 2 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> 0 Overlaps / Capacities OK
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">3. Soft Objective Optimization</span>
              {solverStep >= 3 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> Minimized idle time & fatigue
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eaecf0]">
              <span className="font-bold text-[#101828]">4. Solver Status</span>
              {solverStep >= 4 ? (
                <Badge variant="success" className="font-mono text-xs">
                  OPTIMAL (Solve: 240ms)
                </Badge>
              ) : (
                <span className="text-[#1668e8] font-bold animate-pulse">Running CP-SAT...</span>
              )}
            </div>
          </div>

          {solverStep >= 4 && (
            <div className="p-3 bg-[#ecfdf3] border border-[#a6f4c5] rounded-lg text-[#027a48] font-semibold text-center">
              Feasible Schedule v2.4 successfully formulated without constraint violations!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              disabled={solverRunning}
              onClick={() => setSolverModalOpen(false)}
            >
              Load Solution into Master Calendar
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Add Round Modal Dialog */}
      <Dialog 
        isOpen={roundModalOpen} 
        onClose={() => setRoundModalOpen(false)} 
        title="Add Interview Round"
      >
        <RoundForm 
          onSubmit={handleAddRound}
          onCancel={() => setRoundModalOpen(false)}
        />
      </Dialog>

      {/* Add Room Modal Dialog */}
      <Dialog 
        isOpen={roomModalOpen} 
        onClose={() => setRoomModalOpen(false)} 
        title="Add Meeting Room or Pod"
      >
        <RoomForm 
          onSubmit={handleAddRoom}
          onCancel={() => setRoomModalOpen(false)}
        />
      </Dialog>

    </div>
  );
};
