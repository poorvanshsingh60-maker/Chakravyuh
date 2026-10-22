import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Video, 
  Star, 
  FileText, 
  Check, 
  Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { TimezoneSelector } from '../common/TimezoneSelector';
import { useTimezone } from '../../context/TimezoneContext';

interface AssignedInterview {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  roundName: string;
  duration: number;
  date: string;
  pstTimeSlot: string;
  meetingLink: string;
  roomName: string;
  status: 'PENDING_EVALUATION' | 'EVALUATED';
  decision?: 'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE';
  rating?: number;
  strengths?: string;
  growthAreas?: string;
}

export const InterviewerWorkspace: React.FC = () => {
  const { convertTime, convertHourLabel, currentTimezone } = useTimezone();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'availability'>('dashboard');

  // --- Assigned Interviews State ---
  const [interviews, setInterviews] = useState<AssignedInterview[]>([
    {
      id: 'inv-101',
      candidateName: 'Alex Mercer',
      candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Staff Distributed Systems Engineer',
      roundName: 'Distributed Systems & Architecture',
      duration: 60,
      date: 'Today, Oct 26',
      pstTimeSlot: '10:00 AM – 11:00 AM PST',
      meetingLink: 'https://meet.google.com/chk-dist-sys',
      roomName: 'Virtual Pod Alpha',
      status: 'PENDING_EVALUATION'
    },
    {
      id: 'inv-102',
      candidateName: 'Elena Rostova',
      candidateAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
      role: 'Senior Backend Platform Engineer',
      roundName: 'Distributed Storage & Raft Consensus',
      duration: 60,
      date: 'Tomorrow, Oct 27',
      pstTimeSlot: '2:00 PM – 3:00 PM PST',
      meetingLink: 'https://meet.google.com/chk-raft-cons',
      roomName: 'Turing Suite 402',
      status: 'PENDING_EVALUATION'
    },
    {
      id: 'inv-103',
      candidateName: 'Marcus Vance',
      candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Site Reliability Engineering Lead',
      roundName: 'Fault Tolerance & Disaster Recovery',
      duration: 45,
      date: 'Thursday, Oct 29',
      pstTimeSlot: '11:00 AM – 11:45 AM PST',
      meetingLink: 'https://meet.google.com/chk-dr-eval',
      roomName: 'Virtual Pod Alpha',
      status: 'EVALUATED',
      decision: 'STRONG_HIRE',
      rating: 5,
      strengths: 'Outstanding grasp of distributed consensus and failure zones.'
    }
  ]);

  // --- Scorecard / Evaluation Dialog Form State ---
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState<AssignedInterview | null>(null);
  const [problemSolvingRating, setProblemSolvingRating] = useState(5);
  const [architectureRating, setArchitectureRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [recommendation, setRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE'>('STRONG_HIRE');
  const [strengths, setStrengths] = useState('Superb explanation of leader election protocols and Byzantine fault tolerance.');
  const [growthAreas, setGrowthAreas] = useState('Could elaborate more on observability metrics and tracing telemetry.');
  const [summaryNotes, setSummaryNotes] = useState('Highly recommended for Staff-level architecture ownership.');
  const [evalSuccessBanner, setEvalSuccessBanner] = useState(false);

  // --- Availability Grid State ---
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const pstHours = [9, 10, 11, 13, 14, 15, 16];

  // Map of `day-pstHour` -> boolean (available or busy)
  const [availableSlots, setAvailableSlots] = useState<Record<string, boolean>>({
    'Monday-10': true,
    'Monday-11': true,
    'Tuesday-9': true,
    'Tuesday-10': true,
    'Tuesday-13': true,
    'Wednesday-14': true,
    'Wednesday-15': true,
    'Thursday-10': true,
    'Thursday-11': true,
    'Friday-13': true,
    'Friday-14': true,
  });

  const [availabilitySaved, setAvailabilitySaved] = useState(false);

  // Toggle slot availability
  const toggleSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    setAvailableSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Quick preset: Morning 9-1
  const applyMorningPreset = () => {
    const next = { ...availableSlots };
    daysOfWeek.forEach(day => {
      next[`${day}-9`] = true;
      next[`${day}-10`] = true;
      next[`${day}-11`] = true;
    });
    setAvailableSlots(next);
  };

  // Quick preset: Afternoon 1-5
  const applyAfternoonPreset = () => {
    const next = { ...availableSlots };
    daysOfWeek.forEach(day => {
      next[`${day}-13`] = true;
      next[`${day}-14`] = true;
      next[`${day}-15`] = true;
      next[`${day}-16`] = true;
    });
    setAvailableSlots(next);
  };

  // Clear all
  const clearAllSlots = () => {
    setAvailableSlots({});
  };

  // Open Scorecard Modal
  const openScorecard = (interview: AssignedInterview) => {
    setActiveInterview(interview);
    if (interview.status === 'EVALUATED') {
      setRecommendation(interview.decision || 'STRONG_HIRE');
      setProblemSolvingRating(interview.rating || 5);
      if (interview.strengths) setStrengths(interview.strengths);
    }
    setEvalDialogOpen(true);
  };

  // Submit Scorecard
  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInterview) return;

    setInterviews(interviews.map(inv => 
      inv.id === activeInterview.id 
        ? { 
            ...inv, 
            status: 'EVALUATED', 
            decision: recommendation, 
            rating: problemSolvingRating,
            strengths,
            growthAreas
          } 
        : inv
    ));

    setEvalDialogOpen(false);
    setEvalSuccessBanner(true);
    setTimeout(() => setEvalSuccessBanner(false), 4000);
  };

  const handleSaveAvailability = () => {
    setAvailabilitySaved(true);
    setTimeout(() => setAvailabilitySaved(false), 3000);
  };

  const totalAvailableCount = Object.values(availableSlots).filter(Boolean).length;

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col min-h-screen">
      
      {/* Top Interviewer Header & Load Bar */}
      <div className="bg-white border-b border-[#eaecf0] px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
              alt="Dr. Sarah Chen"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1668e8] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5] uppercase tracking-wider">
                  💼 Interviewer Workspace
                </span>
                <span className="font-bold text-sm text-[#101828]">Dr. Sarah Chen</span>
                <span className="text-xs text-[#667085]">• Staff Distributed Systems</span>
              </div>
              <h1 className="text-xl font-bold text-[#101828] mt-1 tracking-tight">
                Interviewer Scorecards & Availability Matrix
              </h1>
            </div>
          </div>

          {/* Timezone & Workload Fatigue Meter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <TimezoneSelector />

            <div className="w-full sm:w-64 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaecf0] space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#344054]">Weekly Interview Load</span>
                <span className="text-[#1668e8] font-bold font-mono">3 / 6 sessions</span>
              </div>
              <div className="w-full bg-[#eaecf0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1668e8] h-full rounded-full transition-all" style={{ width: '50%' }}></div>
              </div>
              <span className="text-[10px] text-[#667085] block font-mono">Optimal workload • No burnout risk</span>
            </div>
          </div>
        </div>

        {/* Workspace Mode Sub-Tabs */}
        <div className="flex items-center gap-3 mt-4 border-t border-[#f2f4f7] pt-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assigned Interviews Dashboard ({interviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'availability'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>My Availability Grid (FullCalendar Week)</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#ecfdf3] text-[#027a48] text-[10px] font-bold rounded-full">
              {totalAvailableCount} free slots
            </span>
          </button>
        </div>

        {/* Success Banner */}
        {evalSuccessBanner && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold">
                Scorecard successfully recorded into the hiring committee ledger! Candidate progress updated.
              </span>
            </div>
            <Badge variant="success">CALIBRATED</Badge>
          </div>
        )}

        {availabilitySaved && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold">
                Availability preferences saved and synchronized with CP-SAT solver batch horizon in {currentTimezone.label}!
              </span>
            </div>
            <Badge variant="success">SYNCED</Badge>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* ============================================================== */}
        {/* VIEW 1: ASSIGNED INTERVIEWS DASHBOARD & EVALUATION DIALOG */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-[#101828]">Upcoming Assigned Loop Interviews</h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Times shown in <strong className="text-[#101828]">{currentTimezone.label}</strong>. Complete scorecards promptly within 24 hours.
                </p>
              </div>
              <span className="text-xs font-mono text-[#667085]">
                Pending Feedback: {interviews.filter(i => i.status === 'PENDING_EVALUATION').length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {interviews.map((inv) => (
                <div key={inv.id} className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-5 flex flex-col justify-between space-y-4 hover:border-[#1668e8]/40 transition-all">
                  
                  {/* Top Candidate Profile & Status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={inv.candidateAvatar} 
                          alt={inv.candidateName} 
                          className="w-10 h-10 rounded-full object-cover border border-[#eaecf0]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#101828] block">{inv.candidateName}</span>
                          <span className="text-[11px] text-[#667085]">{inv.role}</span>
                        </div>
                      </div>

                      {inv.status === 'EVALUATED' ? (
                        <Badge variant="success">Evaluated</Badge>
                      ) : (
                        <Badge variant="warning">Pending Scorecard</Badge>
                      )}
                    </div>

                    {/* Round Details */}
                    <div className="p-3 bg-[#f9fafb] rounded-lg border border-[#eaecf0] space-y-1.5 text-xs">
                      <div className="font-semibold text-[#101828] flex items-center justify-between">
                        <span>{inv.roundName}</span>
                        <span className="text-[11px] font-mono text-[#667085]">{inv.duration}m</span>
                      </div>
                      <div className="text-[#475467] flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#1668e8]" />
                        <span className="font-medium text-[#101828]">{inv.date} • {convertTime(inv.pstTimeSlot)}</span>
                      </div>
                      <div className="text-[#475467] flex items-center gap-1.5 text-[11px]">
                        <Video className="w-3.5 h-3.5 text-[#98a2b3]" />
                        <span>{inv.roomName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-[#f2f4f7]">
                    <div className="flex items-center gap-2">
                      <a
                        href={inv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-xs font-semibold text-[#344054] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-[#1668e8]" />
                        <span>Join Call</span>
                      </a>

                      <Button
                        variant={inv.status === 'EVALUATED' ? 'secondary' : 'primary'}
                        onClick={() => openScorecard(inv)}
                        className="flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{inv.status === 'EVALUATED' ? 'View Rubric' : 'Submit Scorecard'}</span>
                      </Button>
                    </div>

                    {inv.status === 'EVALUATED' && (
                      <div className="text-[11px] font-mono text-center text-[#027a48] font-bold">
                        Recommendation: {inv.decision} • Score: {inv.rating}/5
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: AVAILABILITY GRID (FullCalendar Week timeGrid) */}
        {/* ============================================================== */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            
            {/* Availability Controls Bar */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#101828]">Weekly Availability Matrix</h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Click or drag time slots to paint free hours for candidate interview matching in <strong className="text-[#101828]">{currentTimezone.label}</strong>.
                </p>
              </div>

              {/* Presets and Save */}
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" onClick={applyMorningPreset}>
                  + Set Morning Block
                </Button>
                <Button size="sm" variant="secondary" onClick={applyAfternoonPreset}>
                  + Set Afternoon Block
                </Button>
                <Button size="sm" variant="secondary" onClick={clearAllSlots}>
                  Clear All
                </Button>
                <Button size="sm" variant="primary" onClick={handleSaveAvailability} className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Availability</span>
                </Button>
              </div>
            </div>

            {/* TimeGrid Weekly Calendar */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
              <div className="p-4 bg-[#fafafa] border-b border-[#eaecf0] flex justify-between items-center text-xs">
                <span className="font-bold text-[#101828]">Week of October 26 – October 30, 2026 ({currentTimezone.shortName})</span>
                <span className="font-mono text-[#667085]">{totalAvailableCount} slots available</span>
              </div>

              <div className="p-4 overflow-x-auto">
                <div className="min-w-[700px]">
                  
                  {/* Days header */}
                  <div className="grid grid-cols-6 border-b border-[#eaecf0] pb-2 text-xs font-bold text-[#475467]">
                    <div className="col-span-1 text-center text-[#98a2b3]">Time Slot</div>
                    {daysOfWeek.map(day => (
                      <div key={day} className="col-span-1 text-center py-1.5 bg-[#f9fafb] rounded border border-[#eaecf0] mx-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Hourly Rows */}
                  <div className="divide-y divide-[#f2f4f7] text-xs">
                    {pstHours.map(hour => {
                      const conv = convertHourLabel(hour);

                      return (
                        <div key={hour} className="grid grid-cols-6 py-2.5 items-center">
                          <div className="col-span-1 text-center font-mono text-[11px] text-[#101828] font-semibold">
                            <span>{conv.full}</span>
                            <span className="text-[10px] text-[#98a2b3] block font-normal">
                              ({hour}:00 PT)
                            </span>
                          </div>

                          {daysOfWeek.map(day => {
                            const isFree = availableSlots[`${day}-${hour}`];
                            return (
                              <div key={day} className="col-span-1 px-1">
                                <button
                                  type="button"
                                  onClick={() => toggleSlot(day, hour)}
                                  className={`w-full py-2.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                                    isFree
                                      ? 'bg-[#ecfdf3] border-[#a6f4c5] text-[#027a48] shadow-2xs hover:bg-[#d1fadf]'
                                      : 'bg-white border-[#eaecf0] text-[#98a2b3] hover:border-[#1668e8]/50 hover:bg-[#f9fafb]'
                                  }`}
                                >
                                  {isFree ? '✓ Available' : 'Busy'}
                                </button>
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
              <div className="p-3 bg-[#fafafa] border-t border-[#eaecf0] flex items-center justify-between text-xs text-[#667085]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#ecfdf3] border border-[#a6f4c5]"></span>
                    <span className="font-medium text-[#027a48]">Marked Free for Interviews</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-[#eaecf0]"></span>
                    <span>Busy / Focus Time</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono">
                  Changes automatically feed into next OR-Tools solve run
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* EVALUATION DIALOG FORM MODAL (EvalDialog) */}
      {/* ============================================================== */}
      <Dialog
        isOpen={evalDialogOpen}
        onClose={() => setEvalDialogOpen(false)}
        title={activeInterview ? `Candidate Scorecard: ${activeInterview.candidateName}` : 'Submit Evaluation'}
      >
        {activeInterview && (
          <form onSubmit={handleSubmitEvaluation} className="space-y-5 text-xs">
            
            {/* Header info */}
            <div className="p-3 bg-[#f9fafb] rounded-lg border border-[#eaecf0] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#101828] block">{activeInterview.roundName}</span>
                <span className="text-[#667085]">{activeInterview.role}</span>
              </div>
              <Badge variant="info">Calibrated Rubric</Badge>
            </div>

            {/* Rubric Star Ratings (1-5) */}
            <div className="space-y-3">
              <span className="font-bold text-[#101828] uppercase text-[10px] tracking-wider block">
                Rubric Competencies (1 to 5 Stars)
              </span>

              {/* Competency 1 */}
              <div className="flex items-center justify-between p-2 rounded border border-[#eaecf0]">
                <div>
                  <span className="font-semibold text-[#344054] block">Technical Problem Solving</span>
                  <span className="text-[10px] text-[#667085]">Data structures, algorithmic efficiency, correctness</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setProblemSolvingRating(star)}
                      className={`p-1 ${problemSolvingRating >= star ? 'text-amber-400' : 'text-[#d0d5dd]'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Competency 2 */}
              <div className="flex items-center justify-between p-2 rounded border border-[#eaecf0]">
                <div>
                  <span className="font-semibold text-[#344054] block">System Architecture & Scale</span>
                  <span className="text-[10px] text-[#667085]">Failure modes, sharding, caching, latency tradeoffs</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setArchitectureRating(star)}
                      className={`p-1 ${architectureRating >= star ? 'text-amber-400' : 'text-[#d0d5dd]'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Competency 3 */}
              <div className="flex items-center justify-between p-2 rounded border border-[#eaecf0]">
                <div>
                  <span className="font-semibold text-[#344054] block">Communication & Calibration</span>
                  <span className="text-[10px] text-[#667085]">Clarity, structured thinking, receiving feedback</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setCommunicationRating(star)}
                      className={`p-1 ${communicationRating >= star ? 'text-amber-400' : 'text-[#d0d5dd]'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Segmented Buttons */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#101828] uppercase text-[10px] tracking-wider block">
                Hiring Recommendation
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['STRONG_NO_HIRE', 'NO_HIRE', 'HIRE', 'STRONG_HIRE'] as const).map(dec => (
                  <button
                    type="button"
                    key={dec}
                    onClick={() => setRecommendation(dec)}
                    className={`py-2 px-1 rounded-lg text-center font-bold text-[11px] border transition-all ${
                      recommendation === dec
                        ? dec.includes('STRONG_HIRE')
                          ? 'bg-[#027a48] text-white border-[#027a48]'
                          : dec === 'HIRE'
                          ? 'bg-[#1668e8] text-white border-[#1668e8]'
                          : 'bg-[#d92d20] text-white border-[#d92d20]'
                        : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {dec.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback textareas */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#344054]">Key Strengths & Evidence</label>
              <textarea
                value={strengths}
                onChange={e => setStrengths(e.target.value)}
                rows={2}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#344054]">Growth Areas / Concerns</label>
              <textarea
                value={growthAreas}
                onChange={e => setGrowthAreas(e.target.value)}
                rows={2}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#344054]">Summary Calibration Notes</label>
              <textarea
                value={summaryNotes}
                onChange={e => setSummaryNotes(e.target.value)}
                rows={2}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
              <Button type="button" variant="secondary" onClick={() => setEvalDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation</span>
              </Button>
            </div>

          </form>
        )}
      </Dialog>

    </div>
  );
};
