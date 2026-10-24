import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Video, 
  FileText, 
  Check, 
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { useTimezone } from '../../context/TimezoneContext';
import { AvatarBadge } from '../common/AvatarBadge';
import { useCoordination } from '../../context/CoordinationContext';

interface AssignedInterview {
  id: string;
  candidateName: string;
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
  const { convertTime, currentTimezone } = useTimezone();
  const { 
    isInviteAccepted, 
    isScorecardSubmitted, 
    submitScorecard, 
    interviewerDecision, 
    interviewerRating,
    isNudged 
  } = useCoordination();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'availability'>('dashboard');

  // Assigned Interviews
  const [interviews, setInterviews] = useState<AssignedInterview[]>([
    {
      id: 'inv-101',
      candidateName: 'Marcus Vance',
      role: 'B.Tech CSE (Reg: 20214012)',
      roundName: 'Distributed Systems & Architecture',
      duration: 60,
      date: 'Today, Oct 26',
      pstTimeSlot: '10:00 AM – 11:00 AM IST',
      meetingLink: 'https://meet.google.com/chk-dist-sys',
      roomName: 'CCF Lab 1 (Terminal 12)',
      status: isScorecardSubmitted ? 'EVALUATED' : 'PENDING_EVALUATION',
      decision: isScorecardSubmitted ? (interviewerDecision as any) : undefined,
      rating: isScorecardSubmitted ? interviewerRating : undefined
    },
    {
      id: 'inv-102',
      candidateName: 'Priya Sharma',
      role: 'B.Tech IT (Reg: 20214088)',
      roundName: 'Distributed Storage & Raft Consensus',
      duration: 60,
      date: 'Tomorrow, Oct 27',
      pstTimeSlot: '2:00 PM – 3:00 PM IST',
      meetingLink: 'https://meet.google.com/chk-raft-cons',
      roomName: 'LHC Seminar Hall A',
      status: 'PENDING_EVALUATION'
    },
    {
      id: 'inv-103',
      candidateName: 'Rahul Verma',
      role: 'B.Tech ECE (Reg: 20215045)',
      roundName: 'Fault Tolerance & Core Algorithms',
      duration: 45,
      date: 'Thursday, Oct 29',
      pstTimeSlot: '11:00 AM – 11:45 AM IST',
      meetingLink: 'https://meet.google.com/chk-dr-eval',
      roomName: 'CCF Lab 2 (Terminal 08)',
      status: 'EVALUATED',
      decision: 'STRONG_HIRE',
      rating: 5,
      strengths: 'Outstanding grasp of distributed consensus and fault-tolerant algorithms.'
    }
  ]);

  // Scorecard Dialog Form State
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState<AssignedInterview | null>(null);
  const [problemSolvingRating, setProblemSolvingRating] = useState(5);
  const [architectureRating, setArchitectureRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [recommendation, setRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE'>('STRONG_HIRE');
  const [strengths, setStrengths] = useState('Superb explanation of leader election protocols and Byzantine fault tolerance.');
  const [evalSuccessBanner, setEvalSuccessBanner] = useState(false);

  // Availability Grid State
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const pstHours = [9, 10, 11, 13, 14, 15, 16];

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

  const toggleSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    setAvailableSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const openScorecard = (interview: AssignedInterview) => {
    setActiveInterview(interview);
    if (interview.status === 'EVALUATED') {
      setRecommendation(interview.decision || 'STRONG_HIRE');
      setProblemSolvingRating(interview.rating || 5);
      if (interview.strengths) setStrengths(interview.strengths);
    }
    setEvalDialogOpen(true);
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInterview) return;

    if (activeInterview.id === 'inv-101' || activeInterview.candidateName.includes('Marcus')) {
      submitScorecard(recommendation, problemSolvingRating);
    }

    setInterviews(interviews.map(i => 
      i.id === activeInterview.id 
        ? {
            ...i,
            status: 'EVALUATED',
            decision: recommendation,
            rating: problemSolvingRating,
            strengths
          }
        : i
    ));

    setEvalDialogOpen(false);
    setEvalSuccessBanner(true);
    setTimeout(() => setEvalSuccessBanner(false), 4000);
  };

  const handleSaveAvailability = () => {
    setAvailabilitySaved(true);
    setTimeout(() => setAvailabilitySaved(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Top Interviewer Header & Load Bar */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-3.5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AvatarBadge name="Dr. Sarah Chen" size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5] uppercase tracking-wider">
                  Interviewer Workspace
                </span>
                <span className="font-bold text-sm text-[#101828]">Dr. Sarah Chen</span>
                <span className="text-xs text-[#667085]">• Google Panel Lead</span>
              </div>
              <p className="text-xs text-[#475467] mt-0.5">
                Google Engineering Panel • Staff Distributed Systems Engineer
              </p>
            </div>
          </div>

          {/* Workload Fatigue Meter */}
          <div className="flex items-center gap-3">

            <div className="bg-[#f8f9fa] px-3 py-1.5 rounded-xl border border-[#eaecf0] space-y-1">
              <div className="flex justify-between text-[11px] font-semibold gap-3">
                <span className="text-[#344054]">Weekly Load</span>
                <span className="text-[#1668e8] font-bold font-mono">3 / 6 sessions</span>
              </div>
              <div className="w-28 bg-[#eaecf0] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1668e8] h-full rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Mode Sub-Tabs */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f2f4f7]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assigned Candidate Sessions ({interviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'availability'
                ? 'bg-[#1668e8] text-white shadow-xs'
                : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>My Availability Matrix</span>
          </button>
        </div>

        {evalSuccessBanner && (
          <div className="mt-2.5 p-2 rounded-lg bg-[#ecfdf3] border border-[#a6f4c5] flex items-center justify-between text-xs text-[#027a48]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
              <span className="font-semibold text-[11px]">
                Scorecard successfully submitted to Central Coordination Engine!
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#a6f4c5]">
              SYNCED
            </span>
          </div>
        )}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-7xl w-full mx-auto space-y-4">
        
        {/* VIEW 1: ASSIGNED INTERVIEWS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3">
            
            {/* Urgent Nudge Alert from Coordinator */}
            {isNudged && !isScorecardSubmitted && (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                        Urgent Coordinator Nudge
                      </span>
                      <span className="text-xs text-red-800 font-semibold">From Coordinator Emma Watson</span>
                    </div>
                    <h3 className="text-sm font-bold text-red-950 mt-1">
                      Immediate Scorecard Evaluation Required for Marcus Vance
                    </h3>
                    <p className="text-xs text-red-700 mt-0.5">
                      Coordinator Emma Watson requested your scorecard for Round 1 to unblock candidate advancement to Round 2.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const targetInv = interviews.find(i => i.id === 'inv-101') || interviews[0];
                    openScorecard(targetInv);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Fill Scorecard Now</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#101828]">
                Assigned Candidate Loops (Google SDE Drive)
              </span>
              <span className="text-[11px] text-[#667085]">
                Times displayed in {currentTimezone.label}
              </span>
            </div>

            <div className="space-y-2.5">
              {interviews.map((inv) => {
                const isTarget = inv.id === 'inv-101';
                const isConfirmed = isTarget ? isInviteAccepted : true;
                const isEvaluated = isTarget ? (isScorecardSubmitted || inv.status === 'EVALUATED') : inv.status === 'EVALUATED';
                const isItemNudged = isTarget && isNudged && !isEvaluated;

                return (
                  <div 
                    key={inv.id}
                    className={`rounded-xl shadow-2xs p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                      isItemNudged
                        ? 'bg-red-50/20 border-2 border-red-500 shadow-md ring-2 ring-red-200'
                        : 'bg-white border border-[#eaecf0] hover:border-[#1668e8]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AvatarBadge name={inv.candidateName} size="md" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#101828]">{inv.candidateName}</span>
                          <span className="text-[11px] text-[#667085]">• {inv.role}</span>
                          
                          {isEvaluated ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5]">
                              Evaluated ({inv.decision || 'STRONG_HIRE'})
                            </span>
                          ) : isItemNudged ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                              URGENT: NUDGED BY COORDINATOR
                            </span>
                          ) : isConfirmed ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
                              Confirmed & Ready
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Invite Sent (Pending)
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#475467]">
                          <span className="font-semibold text-[#101828]">{inv.roundName}</span>
                          <span className="flex items-center gap-1 text-[#1668e8]">
                            <Clock className="w-3 h-3" />
                            {inv.date} • {convertTime(inv.pstTimeSlot)}
                          </span>
                          <span className="flex items-center gap-1 text-[#667085]">
                            <MapPin className="w-3 h-3 text-[#98a2b3]" />
                            {inv.roomName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#f2f4f7]">
                      <a
                        href={inv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-[#1668e8]" />
                        <span>Google Meet</span>
                      </a>

                      <button
                        onClick={() => openScorecard(inv)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                          isEvaluated
                            ? 'bg-[#f2f4f7] text-[#344054] hover:bg-[#eaecf0]'
                            : 'bg-[#1668e8] hover:bg-[#145ac7] text-white'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isEvaluated ? 'Review Scorecard' : 'Submit Scorecard'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Context Tip */}
            <div className="p-3 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-1 text-xs">
              <span className="font-bold text-[#101828] block">Interviewer Calibration Guidelines:</span>
              <p className="text-[11px] text-[#475467]">
                Submitting a scorecard immediately marks the candidate’s round complete in the coordinator's master schedule and unlocks the next sequence round in the CP-SAT engine.
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: AVAILABILITY MATRIX */}
        {activeTab === 'availability' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-[#eaecf0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-bold text-[#101828]">My Weekly Availability Matrix</h2>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Toggle slots when you are available to interview candidates in {currentTimezone.label}.
                </p>
              </div>

              <button
                onClick={handleSaveAvailability}
                className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Availability</span>
              </button>
            </div>

            {availabilitySaved && (
              <div className="p-2.5 rounded-lg bg-[#ecfdf3] border border-[#a6f4c5] text-xs text-[#027a48] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#12b76a]" />
                <span>Availability saved! The CP-SAT engine will enforce your burnout limits and time preferences.</span>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-3">
              <div className="grid grid-cols-5 gap-2.5">
                {daysOfWeek.map((day) => (
                  <div key={day} className="space-y-1.5">
                    <div className="p-1.5 bg-[#f9fafb] rounded border border-[#eaecf0] font-bold text-[11px] text-[#101828] text-center">
                      {day}
                    </div>

                    <div className="space-y-1">
                      {pstHours.map((hour) => {
                        const isAvailable = availableSlots[`${day}-${hour}`];

                        return (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => toggleSlot(day, hour)}
                            className={`w-full p-2 rounded-lg border text-left text-xs transition-all ${
                              isAvailable
                                ? 'bg-[#ecfdf3] border-[#a6f4c5] text-[#027a48] font-bold'
                                : 'bg-white border-[#eaecf0] text-[#98a2b3] hover:bg-[#f9fafb]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px]">{hour}:00</span>
                              {isAvailable && <Check className="w-3 h-3 text-[#12b76a]" />}
                            </div>
                            <span className="text-[9px] block">
                              {isAvailable ? 'Available' : 'Busy'}
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

      {/* Scorecard Dialog */}
      {evalDialogOpen && activeInterview && (
        <Dialog 
          isOpen={evalDialogOpen} 
          onClose={() => setEvalDialogOpen(false)} 
          title={`Interviewer Scorecard: ${activeInterview.candidateName}`}
        >
          <form onSubmit={handleScorecardSubmit} className="space-y-3.5 text-xs">
            <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#eaecf0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#101828] block">{activeInterview.candidateName}</span>
                <span className="text-[#667085]">{activeInterview.roundName}</span>
              </div>
              <Badge variant="info">{activeInterview.roomName}</Badge>
            </div>

            <div>
              <label className="font-semibold text-[#344054] block mb-1">Overall Recommendation</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['STRONG_HIRE', 'HIRE', 'NO_HIRE', 'STRONG_NO_HIRE'] as const).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRecommendation(rec)}
                    className={`py-1.5 px-2 rounded-md border text-[10px] font-bold text-center transition-all ${
                      recommendation === rec
                        ? rec.includes('HIRE') && !rec.includes('NO')
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-red-600 bg-red-50 text-red-800'
                        : 'border-[#dadce0] text-[#444746] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {rec.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-[#444746] block mb-1">DSA / Problem Solving</label>
                <select
                  value={problemSolvingRating}
                  onChange={(e) => setProblemSolvingRating(Number(e.target.value))}
                  className="w-full border border-[#d0d5dd] rounded-lg p-1.5 text-xs"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Adequate</option>
                  <option value={2}>2 - Weak</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#444746] block mb-1">System Architecture</label>
                <select
                  value={architectureRating}
                  onChange={(e) => setArchitectureRating(Number(e.target.value))}
                  className="w-full border border-[#d0d5dd] rounded-lg p-1.5 text-xs"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Adequate</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#444746] block mb-1">Communication</label>
                <select
                  value={communicationRating}
                  onChange={(e) => setCommunicationRating(Number(e.target.value))}
                  className="w-full border border-[#d0d5dd] rounded-lg p-1.5 text-xs"
                >
                  <option value={5}>5 - Clear & Concise</option>
                  <option value={4}>4 - Effective</option>
                  <option value={3}>3 - Needs Prompting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#344054] block mb-1">Key Strengths & Observations</label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={2}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
              <Button variant="secondary" onClick={() => setEvalDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Evaluation
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};
