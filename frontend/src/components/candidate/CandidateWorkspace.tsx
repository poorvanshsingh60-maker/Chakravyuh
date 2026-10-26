import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Video, 
  Download, 
  MapPin, 
  RotateCcw, 
  Check,
  Send,
  MessageSquare,
  MailCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { useTimezone } from '../../context/TimezoneContext';
import { AvatarBadge } from '../common/AvatarBadge';
import { useCoordination } from '../../context/CoordinationContext';

interface ConfirmedRound {
  id: string;
  roundName: string;
  order: number;
  duration: number;
  date: string;
  pstTimeSlot: string;
  interviewerName: string;
  interviewerRole: string;
  location: string;
  meetingLink: string;
  status: 'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED';
}

const DEFAULT_CONFIRMED_ROUNDS: ConfirmedRound[] = [
  {
    id: 'round-1',
    roundName: 'Round 1: Problem Solving & DSA Screen',
    order: 1,
    duration: 60,
    date: 'Monday, Oct 26, 2026',
    pstTimeSlot: '10:00 AM – 11:00 AM PST',
    interviewerName: 'Dr. Sarah Chen',
    interviewerRole: 'Staff Distributed Systems Engineer (Google)',
    location: 'Virtual Pod Alpha (Room 12)',
    meetingLink: 'https://meet.google.com/chk-dist-sys',
    status: 'CONFIRMED'
  },
  {
    id: 'round-2',
    roundName: 'Round 2: Distributed Systems Architecture',
    order: 2,
    duration: 60,
    date: 'Tuesday, Oct 27, 2026',
    pstTimeSlot: '2:00 PM – 3:00 PM PST',
    interviewerName: 'Phil Dunphy',
    interviewerRole: 'Principal Architect (Atlassian Panel)',
    location: 'Virtual Pod Beta (Room 08)',
    meetingLink: 'https://meet.google.com/chk-raft-cons',
    status: 'CONFIRMED'
  },
  {
    id: 'round-3',
    roundName: 'Round 3: Engineering Culture & Values',
    order: 3,
    duration: 45,
    date: 'Friday, Oct 30, 2026',
    pstTimeSlot: '2:00 PM – 2:45 PM PST',
    interviewerName: 'Claire Pritchett',
    interviewerRole: 'VP of Engineering (Talent Lead)',
    location: 'Executive Boardroom 02',
    meetingLink: 'https://meet.google.com/chk-values-eval',
    status: 'CONFIRMED'
  }
];

export const CandidateWorkspace: React.FC = () => {
  const { convertTime, currentTimezone } = useTimezone();
  const { 
    candidateName, 
    candidateReg, 
    driveName, 
    isInviteAccepted, 
    acceptInvite, 
    confirmSlots, 
    isScorecardSubmitted,
    scheduleState,
    requestReschedule,
    messages,
    markMessageAsRead,
    isDemoMode
  } = useCoordination();

  const [activeTab, setActiveTab] = useState<'schedule' | 'messages' | 'slot-selection'>('schedule');
  const [rescheduledRoundIds, setRescheduledRoundIds] = useState<Record<string, boolean>>({});

  // Dynamic syncing of confirmed rounds with schedule state
  const hasActiveReschedule = useMemo(() => {
    return messages.some(m => m.type === 'RESCHEDULE_REQUEST');
  }, [messages]);

  const confirmedRounds: ConfirmedRound[] = useMemo(() => {
    if (scheduleState?.scheduleApplied && scheduleState.activeSessions && scheduleState.activeSessions.length > 0) {
      return scheduleState.activeSessions.map((sess, idx) => ({
        id: sess.id,
        roundName: sess.title,
        order: idx + 1,
        duration: sess.durationMins,
        date: sess.pstTimeSlot.includes('Tuesday') ? 'Tuesday, Oct 27, 2026' : 'Saturday, May 18, 2024',
        pstTimeSlot: sess.pstTimeSlot,
        interviewerName: sess.interviewer,
        interviewerRole: sess.interviewerRole,
        location: sess.room,
        meetingLink: `https://meet.google.com/chk-${sess.room.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        status: (hasActiveReschedule && rescheduledRoundIds[sess.id] ? 'RESCHEDULE_REQUESTED' : 'CONFIRMED') as 'RESCHEDULE_REQUESTED' | 'CONFIRMED'
      }));
    }

    if (!isDemoMode) {
      return [];
    }

    return DEFAULT_CONFIRMED_ROUNDS.map(r => ({
      ...r,
      status: (hasActiveReschedule && rescheduledRoundIds[r.id] ? 'RESCHEDULE_REQUESTED' : r.status) as any
    }));
  }, [scheduleState?.scheduleApplied, scheduleState?.activeSessions, rescheduledRoundIds, hasActiveReschedule, isDemoMode]);

  // Messages directed to Candidate
  const candidateMessages = useMemo(() => {
    return messages.filter(
      m => m.recipientRole === 'CANDIDATE' || 
           m.recipientRole === 'ALL' || 
           (isDemoMode ? m.recipientName.toLowerCase().includes('marcus') : m.recipientName.toLowerCase().includes(candidateName.toLowerCase()))
    );
  }, [messages, isDemoMode, candidateName]);

  const unreadCount = candidateMessages.filter(m => !m.isRead).length;

  // Reschedule Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string>('round-1');
  const [rescheduleReason, setRescheduleReason] = useState('Conflict with university examination schedule.');
  const [rescheduleSentBanner, setRescheduleSentBanner] = useState(false);

  // Slot Selection
  const days = ['Monday, Nov 2', 'Tuesday, Nov 3', 'Wednesday, Nov 4', 'Thursday, Nov 5', 'Friday, Nov 6'];
  const baseSlots = [
    { label: 'Morning', pst: '9:00 AM – 11:00 AM PST' },
    { label: 'Mid-Day', pst: '11:30 AM – 1:30 PM PST' },
    { label: 'Afternoon', pst: '2:00 PM – 4:00 PM PST' },
    { label: 'Late Afternoon', pst: '4:00 PM – 5:30 PM PST' }
  ];

  const [preferredSlots, setPreferredSlots] = useState<Record<string, boolean>>({
    'Monday, Nov 2-Morning': true,
    'Tuesday, Nov 3-Afternoon': true,
    'Thursday, Nov 5-Morning': true,
  });
  const [slotsSavedBanner, setSlotsSavedBanner] = useState(false);

  const togglePreferredSlot = (day: string, slotLabel: string) => {
    const key = `${day}-${slotLabel}`;
    setPreferredSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmSlotsAction = () => {
    confirmSlots();
    setSlotsSavedBanner(true);
    setTimeout(() => setSlotsSavedBanner(false), 4000);
  };

  const handleSendReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRound = confirmedRounds.find(r => r.id === selectedRoundId);
    const roundTitle = targetRound?.roundName || 'Technical Interview Session';

    // Dispatches reschedule alert directly to Coordinator Emma Watson
    requestReschedule(candidateName, roundTitle, rescheduleReason);

    setRescheduledRoundIds(prev => ({ ...prev, [selectedRoundId]: true }));
    setRescheduleModalOpen(false);
    setRescheduleSentBanner(true);
    setTimeout(() => setRescheduleSentBanner(false), 6000);
  };

  const handleDownloadCalendarInvite = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chakravyuh//Scheduling Engine//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
${confirmedRounds.map((r) => `BEGIN:VEVENT
UID:chakravyuh-${r.id}@chakravyuh.ai
DTSTAMP:20261026T000000Z
DTSTART:20261026T170000Z
DTEND:20261026T180000Z
SUMMARY:${r.roundName}
DESCRIPTION:Interviewer: ${r.interviewerName}\\nMeeting Link: ${r.meetingLink}\\nLocation: ${r.location}
LOCATION:${r.location}
STATUS:CONFIRMED
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chakravyuh_Interview_Loop_${candidateName.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Top Header / Profile Banner */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-3.5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AvatarBadge name={candidateName} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff] uppercase tracking-wider">
                  Candidate Portal
                </span>
                <span className="font-bold text-sm text-[#101828]">{candidateName}</span>
                <span className="text-xs text-[#667085]">• {candidateReg}</span>
              </div>
              <p className="text-xs text-[#475467] mt-0.5">
                {driveName} • Direct Placement Pipeline
              </p>
            </div>
          </div>

          {/* Quick Actions (Apple HIG Pills) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCalendarInvite}
              className="px-3.5 py-1.5 rounded-full border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .ics</span>
            </button>

            <button
              onClick={() => {
                setSelectedRoundId(confirmedRounds[0]?.id || 'round-1');
                setRescheduleModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Reschedule</span>
            </button>
          </div>
        </div>

        {/* Coordination Banner: Candidate Placement Invite Status */}
        {isDemoMode ? (
          !isInviteAccepted ? (
            <div className="mt-3 p-3.5 rounded-2xl bg-[#eff8ff] border border-[#b2ddff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1668e8] text-white flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs text-[#101828] block">
                    New Interview Loop Invitation: Google SDE Campus Drive
                  </strong>
                  <span className="text-[11px] text-[#475467]">
                    Coordinator Emma Watson has invited you to 3 evaluation rounds. Confirm to lock in calendar holds.
                  </span>
                </div>
              </div>

              <button
                onClick={acceptInvite}
                className="px-4 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Invite & Confirm Slots</span>
              </button>
            </div>
          ) : (
            <div className="mt-2.5 p-2.5 rounded-2xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
                <span className="font-semibold text-[11px]">
                  Placement Loop Accepted • Real-Time Synced with Coordinator & Panel Desks
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#a6f4c5]">
                CONFIRMED
              </span>
            </div>
          )
        ) : scheduleState?.activeSessions && scheduleState.activeSessions.length > 0 ? (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold text-[11px]">
                Interview Schedule Synchronized • Your upcoming rounds are locked in the master calendar
              </span>
            </div>
            <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#a6f4c5]">
              ACTIVE
            </span>
          </div>
        ) : null}

        {rescheduleSentBanner && (
          <div className="mt-2.5 p-3 rounded-2xl bg-[#fffaeb] border border-[#fedf89] flex items-center justify-between text-xs text-[#b54708] shadow-2xs animate-in fade-in">
            <span>Reschedule request dispatched to Coordinator Emma Watson! CP-SAT engine will re-solve with minimal churn.</span>
            <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#fedf89]">
              DISPATCHED
            </span>
          </div>
        )}

        {/* Sub-tabs header (Apple HIG Pills) */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f2f4f7]">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Assigned Sessions ({confirmedRounds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Coordinator Notices & Messages</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('slot-selection')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'slot-selection'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Preferred Time Windows</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-7xl w-full mx-auto space-y-4">
        
        {/* VIEW 1: CONFIRMED ROUNDS */}
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#101828] uppercase tracking-wider">
                Assigned Interview Sessions (Conference Rooms & Virtual Pods)
              </span>
              <span className="text-[11px] text-[#667085]">
                Times displayed in {currentTimezone.label}
              </span>
            </div>

            <div className="space-y-2.5">
              {confirmedRounds.length === 0 ? (
                <div className="bg-white border border-[#eaecf0] rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f2f4f7] flex items-center justify-center mx-auto text-[#667085]">
                    <Clock className="w-6 h-6 text-[#667085]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#101828]">No Assigned Interview Sessions</h3>
                    <p className="text-xs text-[#667085] max-w-sm mx-auto">
                      Your interview loops have not been scheduled yet. Once your coordinator dispatches your rounds, your schedule and video links will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                confirmedRounds.map((round) => (
                  <div 
                    key={round.id}
                    className="bg-white rounded-2xl border border-[#eaecf0] shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#1668e8]/30 transition-all"
                  >
                    {/* Left Column: Round Details */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#eff8ff] border border-[#b2ddff] text-[#175cd3] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                        0{round.order}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-[#101828]">{round.roundName}</span>
                          <Badge variant="info">{round.duration} mins</Badge>
                          {round.status === 'RESCHEDULE_REQUESTED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Reschedule Pending
                            </span>
                          )}
                          {round.id === 'round-1' && isScorecardSubmitted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Evaluated (Strong Hire)
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#475467] pt-0.5">
                          <span className="flex items-center gap-1 font-semibold text-[#101828]">
                            <Clock className="w-3.5 h-3.5 text-[#1668e8]" />
                            {round.date} • {convertTime(round.pstTimeSlot)}
                          </span>
                          <span className="flex items-center gap-1 text-[#667085]">
                            <MapPin className="w-3.5 h-3.5 text-[#98a2b3]" />
                            {round.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Interviewer & Join CTA */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#f2f4f7]">
                      <div className="flex items-center gap-2.5 w-56 sm:w-64 shrink-0">
                        <AvatarBadge name={round.interviewerName} size="sm" />
                        <div className="text-left text-xs min-w-0 flex-1">
                          <span className="font-semibold text-[#101828] block truncate leading-tight">
                            {round.interviewerName}
                          </span>
                          <span className="text-[10px] text-[#667085] block truncate leading-tight">
                            {round.interviewerRole}
                          </span>
                        </div>
                      </div>

                      <a
                        href={round.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Preparation Notes Box */}
            <div className="p-4 bg-white rounded-2xl border border-[#eaecf0] shadow-2xs space-y-1.5 text-xs">
              <span className="font-bold text-[#101828] block">Candidate Interview Guidelines:</span>
              <ul className="list-disc pl-5 text-[#475467] space-y-1 text-[11px]">
                <li>Join the call or report to your assigned room 10 minutes prior to scheduled start time.</li>
                <li>Ensure you have a stable network connection and a functioning webcam and microphone.</li>
                <li>Need technical accommodations or reschedule assistance? Click "Request Reschedule" above to notify the Coordinator.</li>
              </ul>
            </div>
          </div>
        )}

        {/* VIEW 2: COORDINATOR NOTICES & MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#101828] uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1668e8]" />
                Coordinator Communications & Official Notices
              </span>
              <span className="text-[11px] text-[#667085]">
                {candidateMessages.length} Messages
              </span>
            </div>

            {candidateMessages.length > 0 ? (
              <div className="space-y-2.5">
                {candidateMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`rounded-2xl p-4.5 border transition-all shadow-2xs ${
                      !msg.isRead 
                        ? 'bg-[#eff8ff]/50 border-[#b2ddff]' 
                        : 'bg-white border-[#eaecf0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
                            {msg.senderName} ({msg.senderRole})
                          </span>
                          <span className="text-[11px] text-[#667085]">• {msg.timestamp}</span>
                          {!msg.isRead && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                              NEW
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#101828] mt-1">
                          {msg.subject}
                        </h3>
                        <p className="text-xs text-[#344054] leading-relaxed whitespace-pre-line mt-1">
                          {msg.body}
                        </p>
                      </div>

                      {!msg.isRead && (
                        <button
                          onClick={() => markMessageAsRead(msg.id)}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-2xs"
                        >
                          <MailCheck className="w-3.5 h-3.5 text-[#1668e8]" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-[#eaecf0] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-[#101828]">Inbox Up to Date</h3>
                <p className="text-xs text-[#667085]">No pending notices from the Talent Coordinator.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SLOT SELECTION */}
        {activeTab === 'slot-selection' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[#eaecf0] p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-bold text-[#101828] uppercase tracking-wider">Preferred Time Windows</h2>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Select available blocks in {currentTimezone.label}. The CP-SAT engine prioritizes your chosen windows.
                </p>
              </div>

              <button
                onClick={handleConfirmSlotsAction}
                className="px-4 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Preferred Windows</span>
              </button>
            </div>

            {slotsSavedBanner && (
              <div className="p-3 rounded-2xl bg-[#ecfdf3] border border-[#a6f4c5] text-xs text-[#027a48] flex items-center gap-2 shadow-2xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
                <span>Preferred windows saved and synced to the CP-SAT minimal-churn solver!</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#eaecf0] shadow-2xs p-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {days.map((day) => (
                  <div key={day} className="space-y-1.5">
                    <div className="p-2 bg-[#f9fafb] rounded-xl border border-[#eaecf0] font-bold text-[11px] text-[#101828] text-center">
                      {day}
                    </div>

                    <div className="space-y-1.5">
                      {baseSlots.map((slot) => {
                        const isSelected = preferredSlots[`${day}-${slot.label}`];

                        return (
                          <button
                            key={slot.label}
                            type="button"
                            onClick={() => togglePreferredSlot(day, slot.label)}
                            className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-[#eff8ff] border-[#b2ddff] text-[#175cd3] font-bold'
                                : 'bg-white border-[#eaecf0] text-[#475467] hover:bg-[#f9fafb]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px]">{slot.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-[#1668e8]" />}
                            </div>
                            <span className="text-[10px] text-[#667085] block mt-0.5">
                              {slot.pst.split('–')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reschedule Request Modal */}
      {rescheduleModalOpen && (
        <Dialog 
          isOpen={rescheduleModalOpen} 
          onClose={() => setRescheduleModalOpen(false)} 
          title="Submit Session Reschedule Request"
        >
          <form onSubmit={handleSendReschedule} className="space-y-3.5 text-xs">
            <p className="text-[#667085]">
              Coordinator Emma Watson will receive your request immediately and run the CP-SAT minimal-churn solver to find an optimal zero-conflict replacement slot.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054] block">Select Interview Round</label>
              <select
                value={selectedRoundId}
                onChange={(e) => setSelectedRoundId(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#1668e8]"
              >
                {confirmedRounds.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roundName} ({r.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054] block">Reason for Rescheduling</label>
              <textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                rows={3}
                className="w-full border border-[#d0d5dd] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#1668e8]"
                placeholder="Describe reason for conflict..."
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#eaecf0]">
              <Button variant="secondary" onClick={() => setRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Request to Coordinator
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};
