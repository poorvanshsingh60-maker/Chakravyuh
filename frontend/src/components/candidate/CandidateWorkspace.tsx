import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Video, 
  Download, 
  ChevronRight, 
  MapPin, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';

interface ConfirmedRound {
  id: string;
  roundName: string;
  order: number;
  duration: number;
  date: string;
  timeSlot: string;
  interviewerName: string;
  interviewerRole: string;
  interviewerAvatar: string;
  location: string;
  meetingLink: string;
  status: 'CONFIRMED' | 'COMPLETED';
}

export const CandidateWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'slot-selection'>('schedule');

  // Candidate Data
  const candidate = {
    name: 'Alex Mercer',
    role: 'Staff Distributed Systems Engineer',
    department: 'Core Infrastructure & Storage',
    recruiter: 'Emma Watson',
    status: 'Onsite Loop Scheduled'
  };

  // --- Confirmed Schedule View State (CandSchedule) ---
  const [confirmedRounds] = useState<ConfirmedRound[]>([
    {
      id: 'round-1',
      roundName: 'Round 1: Distributed Systems Architecture',
      order: 1,
      duration: 60,
      date: 'Monday, Oct 26, 2026',
      timeSlot: '10:00 AM – 11:00 AM PST',
      interviewerName: 'Dr. Sarah Chen',
      interviewerRole: 'Staff Distributed Systems Engineer',
      interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
      location: 'Virtual Pod Alpha (Google Meet)',
      meetingLink: 'https://meet.google.com/chk-dist-sys',
      status: 'CONFIRMED'
    },
    {
      id: 'round-2',
      roundName: 'Round 2: Distributed Storage & Raft Consensus',
      order: 2,
      duration: 60,
      date: 'Tuesday, Oct 27, 2026',
      timeSlot: '2:00 PM – 3:00 PM PST',
      interviewerName: 'Phil Dunphy',
      interviewerRole: 'Principal Infrastructure Architect',
      interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      location: 'Virtual Pod Alpha (Google Meet)',
      meetingLink: 'https://meet.google.com/chk-raft-cons',
      status: 'CONFIRMED'
    },
    {
      id: 'round-3',
      roundName: 'Round 3: Engineering Culture & Values',
      order: 3,
      duration: 45,
      date: 'Friday, Oct 30, 2026',
      timeSlot: '2:00 PM – 2:45 PM PST',
      interviewerName: 'Claire Pritchett',
      interviewerRole: 'VP of Engineering',
      interviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
      location: 'Turing Suite 402 (HQ West Campus)',
      meetingLink: 'https://meet.google.com/chk-values-eval',
      status: 'CONFIRMED'
    }
  ]);

  // Reschedule Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedRoundToReschedule, setSelectedRoundToReschedule] = useState<ConfirmedRound | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('Conflict with unexpected production on-call shift.');
  const [rescheduleSentBanner, setRescheduleSentBanner] = useState(false);

  // --- Slot Selection Calendar State (CandAvail) ---
  const days = ['Monday, Nov 2', 'Tuesday, Nov 3', 'Wednesday, Nov 4', 'Thursday, Nov 5', 'Friday, Nov 6'];
  const slots = [
    'Morning: 9:00 AM – 11:00 AM PST',
    'Mid-Day: 11:30 AM – 1:30 PM PST',
    'Afternoon: 2:00 PM – 4:00 PM PST',
    'Late Afternoon: 4:00 PM – 5:30 PM PST'
  ];

  const [preferredSlots, setPreferredSlots] = useState<Record<string, boolean>>({
    'Monday, Nov 2-Morning: 9:00 AM – 11:00 AM PST': true,
    'Tuesday, Nov 3-Afternoon: 2:00 PM – 4:00 PM PST': true,
    'Thursday, Nov 5-Morning: 9:00 AM – 11:00 AM PST': true,
  });
  const [slotsSavedBanner, setSlotsSavedBanner] = useState(false);

  const togglePreferredSlot = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setPreferredSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmSlots = () => {
    setSlotsSavedBanner(true);
    setTimeout(() => setSlotsSavedBanner(false), 4000);
  };

  const handleSendReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleModalOpen(false);
    setRescheduleSentBanner(true);
    setTimeout(() => setRescheduleSentBanner(false), 4000);
  };

  const handleDownloadCalendarInvite = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Chakravyuh//Scheduling Engine//EN\nBEGIN:VEVENT\nSUMMARY:Distributed Systems Architecture Interview\nDESCRIPTION:Google Meet Link: https://meet.google.com/chk-dist-sys\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Chakravyuh_Interview_Loop.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col min-h-screen">
      
      {/* Top Welcome Banner */}
      <div className="bg-white border-b border-[#eaecf0] px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4ebff] text-[#6941c6] border border-[#d6bbfb] uppercase tracking-wider">
                🎓 Candidate Workspace
              </span>
              <span className="text-xs text-[#667085]">• Recruitment Orchestration</span>
            </div>
            <h1 className="text-2xl font-bold text-[#101828] tracking-tight">
              Welcome to your Interview Portal, {candidate.name}
            </h1>
            <p className="text-xs text-[#667085]">
              Applying for <span className="font-semibold text-[#101828]">{candidate.role}</span> • {candidate.department}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleDownloadCalendarInvite}
              className="flex items-center gap-1.5 text-xs py-2 px-3.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ics Calendar</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedRoundToReschedule(confirmedRounds[0]);
                setRescheduleModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs py-2 px-3.5 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Reschedule</span>
            </Button>
          </div>
        </div>

        {/* Progress Timeline Indicator */}
        <div className="mt-6 pt-4 border-t border-[#f2f4f7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#12b76a] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            <span className="font-semibold text-[#101828]">1. Resume Screen</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#d0d5dd]" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#12b76a] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            <span className="font-semibold text-[#101828]">2. Recruiter Chat</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#d0d5dd]" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#1668e8] text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span className="font-bold text-[#1668e8]">3. Technical Onsite Loop (Active)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#d0d5dd]" />
          <div className="flex items-center gap-2 text-[#98a2b3]">
            <span className="w-5 h-5 rounded-full bg-[#f2f4f7] text-[#98a2b3] flex items-center justify-center text-[10px] font-bold">4</span>
            <span>4. Hiring Committee Offer</span>
          </div>
        </div>

        {/* Workspace Mode Sub-Tabs */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Confirmed Schedule View ({confirmedRounds.length} Rounds)</span>
          </button>

          <button
            onClick={() => setActiveTab('slot-selection')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'slot-selection'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Slot Selection Calendar (Preferences)</span>
          </button>
        </div>

        {/* Reschedule Sent Toast */}
        {rescheduleSentBanner && (
          <div className="mt-4 p-3.5 rounded-lg bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold">
                Reschedule request submitted! Coordinator Emma Watson will re-run the CP-SAT solver for minimal churn reassignment.
              </span>
            </div>
            <Badge variant="success">SUBMITTED</Badge>
          </div>
        )}

        {/* Slots Saved Toast */}
        {slotsSavedBanner && (
          <div className="mt-4 p-3.5 rounded-lg bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold">
                Preferred interview windows saved! The scheduling coordinator will schedule your panel during these times.
              </span>
            </div>
            <Badge variant="success">CONFIRMED</Badge>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* ============================================================== */}
        {/* VIEW 1: CONFIRMED SCHEDULE VIEW (CandSchedule) */}
        {/* ============================================================== */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-[#101828]">Confirmed Interview Schedule</h2>
                <p className="text-xs text-[#667085] mt-0.5">Please test your microphone, camera, and join meeting links 5 minutes prior.</p>
              </div>
              <Badge variant="success">All Rounds Confirmed</Badge>
            </div>

            <div className="space-y-3">
              {confirmedRounds.map((round) => (
                <div 
                  key={round.id} 
                  className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#1668e8]/50 transition-all"
                >
                  {/* Left: Round & Timing */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#eff8ff] border border-[#b2ddff] text-[#175cd3] flex items-center justify-center font-bold text-sm font-mono shrink-0">
                      0{round.order}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#101828]">{round.roundName}</span>
                        <Badge variant="info">{round.duration} mins</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#475467]">
                        <span className="flex items-center gap-1 font-semibold text-[#101828]">
                          <Clock className="w-3.5 h-3.5 text-[#1668e8]" />
                          {round.date} • {round.timeSlot}
                        </span>
                        <span className="flex items-center gap-1 text-[#667085]">
                          <MapPin className="w-3.5 h-3.5 text-[#98a2b3]" />
                          {round.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Interviewer & Join CTA */}
                  <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#f2f4f7]">
                    {/* Interviewer badge */}
                    <div className="flex items-center gap-2 text-right">
                      <img 
                        src={round.interviewerAvatar} 
                        alt={round.interviewerName}
                        className="w-9 h-9 rounded-full object-cover border border-[#eaecf0]" 
                      />
                      <div className="text-left text-xs">
                        <span className="font-semibold text-[#101828] block leading-none">{round.interviewerName}</span>
                        <span className="text-[10px] text-[#667085] leading-tight">{round.interviewerRole}</span>
                      </div>
                    </div>

                    {/* Join Meeting Button */}
                    <a
                      href={round.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#1668e8] hover:bg-[#1253ba] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Preparation Notes Box */}
            <div className="p-4 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-2 text-xs">
              <span className="font-bold text-[#101828] block">💡 Candidate Preparation & Instructions:</span>
              <ul className="list-disc pl-5 text-[#475467] space-y-1">
                <li>System Architecture will use an interactive collaborative browser whiteboard (Excalidraw).</li>
                <li>No trick syntax questions: you may use your preferred language (Go, Python, Java, Rust, or C++).</li>
                <li>Need accommodations or emergency assistance? Contact your coordinator Emma Watson anytime.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: SLOT SELECTION CALENDAR (CandAvail) */}
        {/* ============================================================== */}
        {activeTab === 'slot-selection' && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#101828]">Select Preferred Interview Time Windows</h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Select at least 3 preferred blocks next week. The automated solver will guarantee panel availability during your choices.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleConfirmSlots}
                className="flex items-center gap-1.5 text-xs font-bold py-2 px-4"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Interview Preferences</span>
              </Button>
            </div>

            {/* Slot Matrix Selection */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
              <div className="p-4 bg-[#fafafa] border-b border-[#eaecf0] flex justify-between items-center text-xs">
                <span className="font-bold text-[#101828]">Available Window Horizon (Nov 2 – Nov 6, 2026)</span>
                <span className="text-xs font-mono text-[#667085]">
                  Selected: {Object.values(preferredSlots).filter(Boolean).length} Windows
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map((day) => (
                  <div key={day} className="space-y-2.5">
                    <div className="p-2 bg-[#f9fafb] rounded-lg border border-[#eaecf0] font-bold text-xs text-[#101828] text-center">
                      {day}
                    </div>

                    <div className="space-y-2">
                      {slots.map((slot) => {
                        const isSelected = preferredSlots[`${day}-${slot}`];
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => togglePreferredSlot(day, slot)}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-[#eff8ff] border-[#b2ddff] text-[#175cd3] font-bold shadow-2xs'
                                : 'bg-white border-[#eaecf0] text-[#475467] hover:border-[#1668e8]/40 hover:bg-[#f9fafb]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px]">{slot.split(':')[0]}</span>
                              {isSelected && <span className="text-[#1668e8]">✓</span>}
                            </div>
                            <span className="text-[10px] text-[#667085] font-normal block mt-0.5">
                              {slot.split(':')[1]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#fafafa] border-t border-[#eaecf0] text-xs text-[#667085] flex items-center justify-between">
                <span>Selected slots feed directly into Google OR-Tools CP-SAT scheduler context.</span>
                <span className="font-mono text-[11px] text-[#1668e8] font-bold">100% Feasibility Guarantee</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* REQUEST RESCHEDULE MODAL */}
      {/* ============================================================== */}
      <Dialog
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Request Schedule Revision"
      >
        <form onSubmit={handleSendReschedule} className="space-y-4 text-xs">
          <p className="text-[#667085]">
            Our scheduling engine uses minimal-churn delta solving to reschedule rounds with minimum disruption.
          </p>

          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">
              Round to Reschedule {selectedRoundToReschedule && `(${selectedRoundToReschedule.roundName})`}
            </label>
            <select className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828]">
              {confirmedRounds.map(r => (
                <option key={r.id} value={r.id}>{r.roundName} ({r.date})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">Reason for Reschedule</label>
            <textarea
              value={rescheduleReason}
              onChange={e => setRescheduleReason(e.target.value)}
              rows={3}
              className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
            <Button type="button" variant="secondary" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="font-bold">
              Submit Reschedule Request
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
};
