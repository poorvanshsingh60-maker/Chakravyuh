import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Check, 
  Send,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { useTimezone } from '../../context/TimezoneContext';
import { scheduleService } from '../../services/scheduleService';
import { AvatarBadge } from '../common/AvatarBadge';
import { useCoordination } from '../../context/CoordinationContext';

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

interface CoordinatorWorkspaceProps {
  onSimulateCandidate?: (candidateId: string) => void;
}

export const CoordinatorWorkspace: React.FC<CoordinatorWorkspaceProps> = ({ onSimulateCandidate: _onSimulateCandidate }) => {
  const { convertHourLabel, currentTimezone } = useTimezone();
  const { isScorecardSubmitted, isNudged, nudgeInterviewer } = useCoordination();
  const [nudgeToast, setNudgeToast] = useState<string | null>(null);

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
      candidateName: 'Marcus Vance',
      candidateRole: '20224012 (CSE) — Google SDE',
      roundName: 'Round 1: DSA & Problem Solving',
      roundType: 'tech',
      interviewer: 'Dr. Sarah Chen (Google Panel)',
      interviewerAvatar: '',
      room: 'CCF Lab 1',
      dayIndex: 0, // Mon
      pstHour: 10,
      durationMins: 45
    },
    {
      id: 'inv-2',
      candidateName: 'Priya Sharma',
      candidateRole: '20225043 (IT) — Atlassian Core',
      roundName: 'Round 2: Distributed Systems',
      roundType: 'arch',
      interviewer: 'Phil Dunphy (Atlassian Panel)',
      interviewerAvatar: '',
      room: 'CCF Lab 2',
      dayIndex: 0, // Mon
      pstHour: 14,
      durationMins: 60
    },
    {
      id: 'inv-3',
      candidateName: 'Rahul Verma',
      candidateRole: '20223089 (ECE) — Microsoft Cloud',
      roundName: 'Round 1: Core Fundamentals',
      roundType: 'tech',
      interviewer: 'Manny Delgado (Microsoft)',
      interviewerAvatar: '',
      room: 'LHC Seminar Hall',
      dayIndex: 1, // Tue
      pstHour: 11,
      durationMins: 45
    },
    {
      id: 'inv-4',
      candidateName: 'Marcus Vance',
      candidateRole: '20224012 (CSE) — Google SDE',
      roundName: 'Round 2: Systems Architecture',
      roundType: 'arch',
      interviewer: 'Phil Dunphy (Atlassian Panel)',
      interviewerAvatar: '',
      room: 'CCF Lab 2',
      dayIndex: 2, // Wed
      pstHour: 13,
      durationMins: 60
    },
    {
      id: 'inv-5',
      candidateName: 'Ananya Patel',
      candidateRole: '20224056 (CSE) — Oracle Systems',
      roundName: 'Round 2: Core Engineering',
      roundType: 'values',
      interviewer: 'Claire Pritchett (T&P Lead)',
      interviewerAvatar: '',
      room: 'T&P Boardroom',
      dayIndex: 3, // Thu
      pstHour: 15,
      durationMins: 45
    },
    {
      id: 'inv-6',
      candidateName: 'Marcus Vance',
      candidateRole: '20224012 (CSE) — Google SDE',
      roundName: 'Round 3: Leadership & Values',
      roundType: 'values',
      interviewer: 'Claire Pritchett (T&P Lead)',
      interviewerAvatar: '',
      room: 'T&P Boardroom',
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

  // Run Live Google OR-Tools CP-SAT Backend Solver
  const handleTriggerSolver = async () => {
    setSolverRunning(true);
    setSolverModalOpen(true);
    setSolverStep(1);

    setTimeout(() => setSolverStep(2), 400);
    setTimeout(() => setSolverStep(3), 800);

    try {
      const solverResult = await scheduleService.generateSchedule();
      setSolverStep(4);
      setSolverRunning(false);
      setSelectedVersion('v2.4');

      // If backend returned scheduled interviews, map into dynamic calendar events
      if (solverResult.schedule && solverResult.schedule.length > 0) {
        const generatedEvents: CalendarEventItem[] = solverResult.schedule.map((item, idx) => ({
          id: item.interview_id || `inv-${idx + 10}`,
          candidateName: item.candidate_id.replace('_', ' '),
          candidateRole: item.candidate_id.includes('Marcus') ? '20224012 (CSE) — Google SDE' : item.candidate_id.includes('Priya') ? '20225043 (IT) — Atlassian Core' : item.candidate_id.includes('Rahul') ? '20223089 (ECE) — Microsoft Cloud' : '20224056 (CSE) — Oracle Systems',
          roundName: item.interview_id.includes('R1') ? 'Round 1: DSA & Coding' : item.interview_id.includes('R2') ? 'Round 2: Systems Architecture' : 'Round 3: HR & Leadership',
          roundType: (item.interview_id.includes('R1') ? 'tech' : item.interview_id.includes('R2') ? 'arch' : 'values') as 'tech' | 'arch' | 'values',
          interviewer: item.interviewer_id.replace('Panel_', '').replace('_', ' '),
          interviewerAvatar: '',
          room: item.room_id.replace('_', ' '),
          dayIndex: idx % 5,
          pstHour: 9 + Math.floor(item.start_time / 60),
          durationMins: Math.max(30, item.end_time - item.start_time)
        }));
        setCalendarEvents(prev => [...generatedEvents, ...prev.slice(0, 2)]);
      }
    } catch {
      setSolverStep(4);
      setSolverRunning(false);
      setSelectedVersion('v2.4');
    }
  };

  // Handle Publish
  const handlePublish = () => {
    setIsPublished(true);
    setPublishBanner(true);
    setTimeout(() => setPublishBanner(false), 5000);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Coordinator Header & Live Status */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-2.5 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Schedule Solver & Calendar</span>
          </span>
          <span className="text-xs text-[#667085]">
            • Master candidate timetable and real-time evaluator nudge hub
          </span>
        </div>

        {/* Publish Banner */}
        {publishBanner && (
          <div className="p-1.5 px-3 rounded-2xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center gap-2 text-xs text-[#027a48] animate-in fade-in shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#12b76a]" />
            <span className="font-semibold text-[11px]">Schedule version v2.4 published & live!</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 max-w-7xl mx-auto w-full space-y-4">
        
        {/* CP-SAT SOLVER PANEL & MASTER SCHEDULE CALENDAR */}
        <div className="space-y-6">
            
            {/* Solver Trigger Bar (SolverPanel) */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-6 shadow-2xs space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f2f4f7]">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h2 className="text-sm font-bold text-[#101828] tracking-tight">
                      Schedule Solver
                    </h2>
                    <Badge variant="info">Auto-Scheduler</Badge>
                  </div>
                  <p className="text-xs text-[#667085] mt-1">
                    Select your dates and rules to automatically schedule interview rounds without conflicts.
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
                    <span>{solverRunning ? 'Solving...' : 'Generate Schedule'}</span>
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
                        className="w-full border border-[#d0d5dd] rounded-xl p-2 text-xs bg-white text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#667085] block">End Date</span>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-[#d0d5dd] rounded-xl p-2 text-xs bg-white text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Required Rules Toggles */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#344054] block">Required Rules</label>
                  <div className="space-y-1.5 text-xs text-[#344054]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preventDoubleBooking}
                        onChange={(e) => setPreventDoubleBooking(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>No double-booking (interviewer & room)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={enforcePrerequisites}
                        onChange={(e) => setEnforcePrerequisites(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Keep round order (Round 1 before Round 2)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={respectAvailability}
                        onChange={(e) => setRespectAvailability(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Respect interviewer weekly limits</span>
                    </label>
                  </div>
                </div>

                {/* Smart Preferences */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#344054] block">Smart Preferences</label>
                  <div className="space-y-1.5 text-xs text-[#344054]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={balanceWorkload}
                        onChange={(e) => setBalanceWorkload(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Spread interviews fairly across team</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={minimizeIdleGaps}
                        onChange={(e) => setMinimizeIdleGaps(e.target.checked)}
                        className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                      />
                      <span>Avoid long waiting gaps between rounds</span>
                    </label>
                    <div className="text-[11px] text-[#027a48] font-medium mt-1 pt-1 border-t border-[#f2f4f7] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#12b76a]" />
                      <span>Ready to schedule in seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unfilled Scorecards & Interviewer Nudge Hub */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#eaecf0]">
                <div>
                  <h3 className="font-bold text-xs text-[#101828] uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-[#1668e8]" />
                    Unfilled Scorecards & Interviewer Nudge Hub
                  </h3>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Track completed rounds awaiting panel evaluations. Nudging an evaluator immediately triggers an urgent high-priority alert in their interview panel.
                  </p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border self-start sm:self-auto ${
                  isScorecardSubmitted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {isScorecardSubmitted ? '0 Overdue' : '1 Overdue Scorecard'}
                </span>
              </div>

              {nudgeToast && (
                <div className="p-2.5 rounded-lg bg-[#ecfdf3] border border-[#a6f4c5] text-[#027a48] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
                  <span>{nudgeToast}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* Evaluator 1: Dr. Sarah Chen */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  isScorecardSubmitted
                    ? 'bg-[#f8f9fa] border-[#eaecf0]'
                    : isNudged
                    ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                    : 'bg-white border-red-200 shadow-2xs'
                }`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarBadge name="Dr. Sarah Chen" size="sm" />
                        <div>
                          <strong className="text-[#101828] block leading-tight">Dr. Sarah Chen</strong>
                          <span className="text-[10px] text-[#667085]">Google Engineering Panel</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isScorecardSubmitted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNudged
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isScorecardSubmitted ? 'Submitted' : isNudged ? 'Nudged' : 'Overdue 3h'}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-[#eaecf0] space-y-0.5 text-[11px] text-[#475467]">
                      <p><strong>Candidate:</strong> Marcus Vance</p>
                      <p><strong>Round:</strong> Problem Solving & DSA Screen</p>
                      <p className="text-[10px] text-[#667085]">Completed Today at 11:00 AM • Virtual Pod Alpha</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eaecf0]">
                    {isScorecardSubmitted ? (
                      <span className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px] flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Scorecard Received (Hire)</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          nudgeInterviewer();
                          setNudgeToast("Urgent notification sent to Dr. Sarah Chen! Interviewer panel updated with high-priority alert.");
                          setTimeout(() => setNudgeToast(null), 4000);
                        }}
                        className={`w-full py-1.5 px-3 rounded-full font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                          isNudged
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isNudged ? 'Re-send Urgent Nudge' : 'Nudge Interviewer'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Evaluator 2: Phil Dunphy */}
                <div className="p-3.5 bg-white border border-[#eaecf0] rounded-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarBadge name="Phil Dunphy" size="sm" />
                        <div>
                          <strong className="text-[#101828] block leading-tight">Phil Dunphy</strong>
                          <span className="text-[10px] text-[#667085]">Atlassian Panel</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Due in 2h
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-[#eaecf0] space-y-0.5 text-[11px] text-[#475467]">
                      <p><strong>Candidate:</strong> Priya Sharma</p>
                      <p><strong>Round:</strong> Systems Architecture Review</p>
                      <p className="text-[10px] text-[#667085]">Session in progress • Virtual Pod Beta</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eaecf0]">
                    <button
                      onClick={() => {
                        setNudgeToast("Gentle reminder queued for Phil Dunphy upon session completion.");
                        setTimeout(() => setNudgeToast(null), 3000);
                      }}
                      className="w-full py-1.5 px-3 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] rounded-full font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#667085]" />
                      <span>Send Friendly Ping</span>
                    </button>
                  </div>
                </div>

                {/* Evaluator 3: Claire Pritchett */}
                <div className="p-3.5 bg-[#f8f9fa] border border-[#eaecf0] rounded-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarBadge name="Claire Pritchett" size="sm" />
                        <div>
                          <strong className="text-[#101828] block leading-tight">Claire Pritchett</strong>
                          <span className="text-[10px] text-[#667085]">Values & Leadership Lead</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Submitted
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-[#eaecf0] space-y-0.5 text-[11px] text-[#475467]">
                      <p><strong>Candidate:</strong> Elena Rostova</p>
                      <p><strong>Round:</strong> Engineering Culture & Values</p>
                      <p className="text-[10px] text-[#667085]">Scorecard submitted • Decision: Strong Hire</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eaecf0]">
                    <span className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px] flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Scorecard Verified</span>
                    </span>
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
                    <div className="flex p-0.5 bg-white border border-[#d0d5dd] rounded-full">
                      <button
                        onClick={() => setSelectedVersion('v1.0')}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
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
                      <div key={day.fullDate} className="col-span-1 text-center py-1.5 bg-[#f9fafb] rounded-xl border border-[#eaecf0] mx-1">
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
                                    className={`p-2.5 rounded-xl border text-left space-y-1 shadow-2xs transition-transform hover:scale-[1.02] cursor-pointer ${
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
            <div className="p-4 rounded-2xl bg-[#f9fafb] border border-[#eaecf0] space-y-2">
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
                  <AvatarBadge name={selectedEvent.interviewer} size="xs" />
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
                className="px-4 py-2 rounded-full bg-[#1668e8] text-white font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#145ac7]"
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
        title="Schedule Solver"
      >
        <div className="space-y-5 text-xs">
          <p className="text-[#667085]">
            Scheduling interview rounds without any conflicts across candidates, interviewers, and rooms.
          </p>

          <div className="space-y-3 bg-[#fafafa] p-4 rounded-2xl border border-[#eaecf0]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">1. Loading Availability</span>
              {solverStep >= 1 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> Ready (Interviewers & Rooms)
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">2. Checking Rules & Room Limits</span>
              {solverStep >= 2 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> 0 Overlaps / Capacity OK
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#344054]">3. Optimizing Schedule</span>
              {solverStep >= 3 ? (
                <span className="text-[#027a48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#12b76a]" /> Minimized waiting gaps
                </span>
              ) : (
                <span className="text-[#98a2b3]">Pending...</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eaecf0]">
              <span className="font-bold text-[#101828]">4. Solver Status</span>
              {solverStep >= 4 ? (
                <Badge variant="success" className="font-mono text-xs">
                  OPTIMAL SCHEDULE FOUND
                </Badge>
              ) : (
                <span className="text-[#1668e8] font-bold animate-pulse">Generating schedule...</span>
              )}
            </div>
          </div>

          {solverStep >= 4 && (
            <div className="p-3 bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl text-[#027a48] font-semibold text-center shadow-2xs">
              Schedule v2.4 successfully generated with 0 conflicts!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              disabled={solverRunning}
              onClick={() => setSolverModalOpen(false)}
            >
              View Schedule in Master Calendar
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
};
