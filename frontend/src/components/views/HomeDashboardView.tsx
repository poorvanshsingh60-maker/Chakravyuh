import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Calendar,
  Check,
  AlertTriangle,
  FileEdit,
  Video,
  ChevronRight,
  Sparkles,
  X,
  Plus,
  UserCheck,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { UserRole } from '../../types/user';
import { NavTab, Task, CandidateItem } from '../../types';
import { useTimezone } from '../../context/TimezoneContext';
import { useCoordination, InterviewAssignment } from '../../context/CoordinationContext';

interface HomeDashboardViewProps {
  currentUser: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
  tasks: Task[];
  candidates: CandidateItem[];
  onNavigate: (tab: NavTab) => void;
  onCompleteTask?: (taskId: string) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  tasks: _tasks,
  candidates: _candidates,
  onNavigate,
  onCompleteTask: _onCompleteTask
}) => {
  const { convertTime } = useTimezone();
  const { 
    isInviteAccepted, 
    acceptInvite, 
    assignments,
    submitScorecardForAssignment,
    nudgeAssignment,
    createAndSendAssignment,
    messages,
    isDemoMode,
    scheduleState,
    resolveRescheduleRequest
  } = useCoordination();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Re-solve Matrix State for Candidate Reschedule Requests
  const [activeResolveReq, setActiveResolveReq] = useState<any | null>(null);
  const [isResolvingMatrix, setIsResolvingMatrix] = useState(false);

  // Scorecard modal state for interviewer
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [activeEvalAssignment, setActiveEvalAssignment] = useState<InterviewAssignment | null>(null);
  const [scoreProblemSolving, setScoreProblemSolving] = useState(5);
  const [scoreArchitecture, setScoreArchitecture] = useState(4);
  const [scoreRecommendation, setScoreRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE'>('STRONG_HIRE');
  const [scoreFeedback, setScoreFeedback] = useState('Excellent problem decomposition, clean graph traversal implementation, and optimal time complexity analysis.');

  // Create & Dispatch Evaluation Profile Modal (for Coordinator)
  const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandRole, setNewCandRole] = useState('Senior Distributed Systems Engineer');
  const [newRoundName, setNewRoundName] = useState('Round 2: Systems Architecture & Concurrency');
  const [newInterviewerName, setNewInterviewerName] = useState('Dr. Sarah Chen');
  const [newTimeSlot, setNewTimeSlot] = useState('3:30 PM – 4:15 PM PST');
  const [newRoomName, setNewRoomName] = useState('Virtual Pod Alpha');
  const [newNotes, setNewNotes] = useState('Evaluate fault tolerance, consensus tradeoffs, and distributed caching strategy.');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmResolveMatrix = () => {
    if (!activeResolveReq) return;
    setIsResolvingMatrix(true);

    setTimeout(() => {
      resolveRescheduleRequest(activeResolveReq.id, {
        candidateName: activeResolveReq.senderName,
        roundName: 'Design Exercise 1 & Domain Screen',
        newTimeSlot: 'Tuesday, Oct 27 • 2:00 PM – 2:45 PM PST',
        newRoom: 'Virtual Pod Alpha',
        newDayIndex: 1,
        newPstHour: 14
      });
      setIsResolvingMatrix(false);
      setActiveResolveReq(null);
      showToast(`✨ CP-SAT Solver Re-solved: ${activeResolveReq.senderName} rescheduled to Tuesday 2:00 PM PST with 0 conflicts!`);
    }, 600);
  };

  const handleOpenScoreModal = (assignment: InterviewAssignment) => {
    setActiveEvalAssignment(assignment);
    setEvalModalOpen(true);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = activeEvalAssignment || assignments.find(a => a.id === 'inv-101') || assignments[0];
    if (!target) return;

    submitScorecardForAssignment(
      target.id,
      scoreRecommendation,
      scoreProblemSolving,
      scoreFeedback,
      'Continuous focus on distributed systems fundamentals'
    );
    setEvalModalOpen(false);
    showToast(`Scorecard submitted for ${target.candidateName}! Hiring decision and coordinator page updated.`);
  };

  const handleCreateAndSendProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) return;

    createAndSendAssignment({
      candidateName: newCandName,
      role: newCandRole,
      roundName: newRoundName,
      interviewerName: newInterviewerName,
      pstTimeSlot: newTimeSlot,
      roomName: newRoomName,
      notes: newNotes
    });

    setCreateProfileModalOpen(false);
    showToast(`Evaluation profile for ${newCandName} dispatched to ${newInterviewerName} to score!`);
    setNewCandName('');
  };

  // Filter assignments
  const pendingScorecards = assignments.filter(a => a.status !== 'EVALUATED');
  const evaluatedScorecards = assignments.filter(a => a.status === 'EVALUATED');
  const rescheduleRequests = messages.filter(m => m.type === 'RESCHEDULE_REQUEST');
  const urgentCount = pendingScorecards.length + (isDemoMode && !isInviteAccepted ? 1 : 0) + rescheduleRequests.length;

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-y-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Strip */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff] uppercase tracking-wider">
                {currentUser.role === 'COORDINATOR' ? 'Scheduler Command' : currentUser.role === 'INTERVIEWER' ? 'Panelist Desk' : 'Student Placement'}
              </span>
              <span className="text-xs text-[#667085]">
                Chakravyuh Autonomous Scheduling
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#101828] mt-1 tracking-tight">
              Welcome back, {currentUser.full_name.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser.role === 'COORDINATOR' && (
              <button
                onClick={() => setCreateProfileModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Send Candidate to Score</span>
              </button>
            )}
            <button
              onClick={() => onNavigate(currentUser.role === 'COORDINATOR' ? 'scheduling' : 'flowchart')}
              className="px-3.5 py-1.5 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold rounded-full shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1668e8]" />
              <span>
                {currentUser.role === 'COORDINATOR' ? 'Master Schedule' : currentUser.role === 'INTERVIEWER' ? 'My Interview Loops' : 'View Schedule & Slots'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Area */}
      <div className="max-w-6xl mx-auto w-full p-6 space-y-6 flex-1 min-h-0">

        {/* ========================================================================= */}
        {/* ROLE 1: COORDINATOR HOME DASHBOARD */}
        {/* ========================================================================= */}
        {currentUser.role === 'COORDINATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (7 cols): Urgent Tasks & Actions */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Urgent Tasks & Bottlenecks
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    urgentCount > 0 
                      ? 'text-rose-700 bg-rose-50 border-rose-200' 
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    {urgentCount > 0 ? `${urgentCount} Items Require Action` : 'Zero Bottlenecks'}
                  </span>
                </div>
              </div>

              {/* Incoming Candidate Reschedule Requests */}
              {rescheduleRequests.map((req) => (
                <div key={req.id} className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                          Reschedule Requested
                        </span>
                        <span className="text-[11px] text-[#667085]">• From {req.senderName} ({req.timestamp})</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#101828]">
                        {req.subject}
                      </h3>
                      <p className="text-[11px] text-[#475467]">
                        {req.body}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveResolveReq(req)}
                      className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shrink-0 flex items-center gap-1 shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Re-solve Matrix</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Pending Scorecards List */}
              {pendingScorecards.length > 0 ? (
                pendingScorecards.map((sc) => (
                  <div key={sc.id} className="bg-white border border-[#eaecf0] rounded-2xl p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            Pending Scorecard
                          </span>
                          <span className="text-[11px] text-[#667085]">• Assigned to {sc.interviewerName}</span>
                        </div>
                        <h3 className="text-xs font-bold text-[#101828]">
                          {sc.candidateName} — {sc.roundName}
                        </h3>
                        <p className="text-[11px] text-[#475467]">
                          Interview completed in {sc.roomName}. Scorecard needed to evaluate candidate and unlock next stage.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          nudgeAssignment(sc.id);
                          showToast(`Urgent reminder dispatched to ${sc.interviewerName} for ${sc.candidateName}!`);
                        }}
                        className="px-3.5 py-1.5 text-white text-xs font-semibold rounded-full shrink-0 flex items-center gap-1 shadow-xs transition-all bg-[#1668e8] hover:bg-[#145ac7]"
                      >
                        <Send className="w-3 h-3" />
                        <span>Nudge Panel</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl p-4 shadow-2xs flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#027a48]">All Assigned Scorecards Completed!</h3>
                      <p className="text-[11px] text-[#05603a]">
                        All interviewers have submitted evaluations. Candidate pipelines are currently clear of score bottlenecks.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCreateProfileModalOpen(true)}
                    className="px-3 py-1 bg-white text-emerald-800 text-[10px] font-bold rounded-full border border-[#a6f4c5] hover:bg-emerald-50 shrink-0"
                  >
                    + New Evaluation
                  </button>
                </div>
              )}

              {/* Real-Time Evaluated Scorecards Feed (Updates when interviewer scores someone) */}
              {evaluatedScorecards.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed Scorecards & Decisions ({evaluatedScorecards.length})</span>
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Live Synced
                    </span>
                  </div>

                  {evaluatedScorecards.map((sc) => (
                    <div key={sc.id} className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-4 shadow-2xs space-y-2 animate-in fade-in">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              ✓ Scorecard Received
                            </span>
                            <span className="text-xs text-emerald-900 font-semibold">• Evaluated by {sc.interviewerName}</span>
                            <span className="text-[11px] text-[#667085]">{sc.submittedAt || 'Today'}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#101828]">
                            {sc.candidateName} — {sc.roundName}
                          </h4>
                          <p className="text-xs text-[#475467] leading-relaxed">
                            Recommendation: <strong className="text-emerald-700">{sc.decision?.replace('_', ' ') || 'STRONG HIRE'}</strong> • Technical Rating: <strong>{sc.rating || 5}/5.0</strong>
                            {sc.strengths && ` • "${sc.strengths}"`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-white text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-2xs shrink-0">
                          {sc.rating || 5}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Task 2: Unconfirmed Candidate Invite (Demo Mode Only) */}
              {isDemoMode && !isInviteAccepted && (
                <div className="bg-white border border-[#eaecf0] rounded-2xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Invite Pending
                        </span>
                        <span className="text-[11px] text-[#667085]">Microsoft Cloud</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#101828]">
                        Rahul Verma has not confirmed slot selections for Round 2
                      </h3>
                      <p className="text-[11px] text-[#475467]">
                        Invite link dispatched. CP-SAT engine reserved temporary buffer in Virtual Pod Alpha.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + '/?invite=msft-rahul');
                        showToast('Invite link copied for Rahul Verma!');
                      }}
                      className="px-3.5 py-1.5 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold rounded-full shrink-0 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}

              {/* Task 3: Quick Optimization Nudge */}
              <div className="bg-[#f0f9ff] border border-[#b9e6fe] rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <div>
                    <strong className="text-[#0369a1] block">Automated Schedule Engine Active</strong>
                    <span className="text-[11px] text-[#0284c7]">Zero resource overlaps detected across {scheduleState.activeSessions?.length || (isDemoMode ? 14 : 0)} scheduled rounds.</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('scheduling')}
                  className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold rounded-full shrink-0 text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Inspect Matrix
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Small Summary of Schedule */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1668e8]" />
                  Today's Schedule Summary
                </h2>
                <button 
                  onClick={() => onNavigate('scheduling')}
                  className="text-xs text-[#1668e8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Automate Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {isDemoMode ? (
                <div className="bg-white border border-[#eaecf0] rounded-2xl divide-y divide-[#f2f4f7] shadow-2xs text-xs overflow-hidden">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-[#1668e8]">{convertTime('10:00 AM – 10:45 AM')}</span>
                      <h4 className="font-bold text-[#101828]">Marcus Vance • Round 1 (Coding)</h4>
                      <span className="text-[11px] text-[#667085]">Interviewer: Dr. Sarah Chen</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Terminal 12
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-[#1668e8]">{convertTime('1:00 PM – 2:00 PM')}</span>
                      <h4 className="font-bold text-[#101828]">Priya Sharma • System Design</h4>
                      <span className="text-[11px] text-[#667085]">Interviewer: Phil Dunphy</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Terminal 08
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-[#1668e8]">{convertTime('3:00 PM – 3:45 PM')}</span>
                      <h4 className="font-bold text-[#101828]">Elena Rostova • Values & Leadership</h4>
                      <span className="text-[11px] text-[#667085]">Interviewer: Claire Pritchett</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Suite 402
                    </span>
                  </div>
                </div>
              ) : scheduleState.activeSessions && scheduleState.activeSessions.length > 0 ? (
                <div className="bg-white border border-[#eaecf0] rounded-2xl divide-y divide-[#f2f4f7] shadow-2xs text-xs overflow-hidden">
                  {scheduleState.activeSessions.slice(0, 4).map((sess) => (
                    <div key={sess.id} className="p-3.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-[#1668e8]">{sess.pstTimeSlot}</span>
                        <h4 className="font-bold text-[#101828]">{sess.title}</h4>
                        <span className="text-[11px] text-[#667085]">Interviewer: {sess.interviewer}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {sess.room}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#eaecf0] rounded-2xl p-8 shadow-2xs text-center text-xs text-[#667085]">
                  <Calendar className="w-8 h-8 text-[#98a2b3] mx-auto mb-2 stroke-[1.5]" />
                  <p className="font-semibold text-[#101828]">No sessions scheduled today</p>
                  <p className="text-[11px] mt-0.5">Use Automate Scheduling to solve and publish your timetable.</p>
                </div>
              )}

              {/* Metric Snapshot */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-white border border-[#eaecf0] rounded-2xl text-center shadow-2xs">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Active Loops</span>
                  <span className="text-xl font-bold text-[#101828]">{assignments.length} Candidates</span>
                </div>
                <div className="p-3.5 bg-white border border-[#eaecf0] rounded-2xl text-center shadow-2xs">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Evaluations Done</span>
                  <span className="text-xl font-bold text-[#027a48]">{evaluatedScorecards.length} Scored</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: INTERVIEWER HOME DASHBOARD */}
        {/* ========================================================================= */}
        {currentUser.role === 'INTERVIEWER' && (
          <div className="space-y-6">
            
            {/* Urgent Nudge Banner */}
            {pendingScorecards.some(sc => sc.isNudged) ? (
              <div className="bg-rose-50/70 animate-pulse border border-rose-200/50 rounded-2xl p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                      <span>Scorecard Evaluation Requested</span>
                    </span>
                    <span className="text-xs text-rose-900/70 font-medium">Coordinator Emma Watson</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#101828] mt-1.5">
                    {pendingScorecards[0]?.candidateName} — {pendingScorecards[0]?.roundName}
                  </h3>
                  <p className="text-xs text-[#475467] mt-0.5 leading-relaxed">
                    Emma Watson requested your scorecard to unblock the candidate's hiring decision and schedule the next technical round.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenScoreModal(pendingScorecards[0])}
                    className="px-4 py-2 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Score Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl p-4 shadow-2xs flex items-center justify-between text-xs text-[#027a48] animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#027a48]">All Assigned Scorecards Up-to-Date!</h3>
                    <p className="text-[11px] text-[#05603a]">
                      Zero pending evaluations. All candidate loops are moving forward without delays.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-white text-[10px] font-bold rounded-full border border-[#a6f4c5] uppercase">
                  Zero Pending Loops
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (7 cols): Candidates Left to Score */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-[#1668e8]" />
                    Candidates Left to Score
                  </h2>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    pendingScorecards.length === 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {pendingScorecards.length === 0 ? '0 Pending' : `${pendingScorecards.length} Pending Evaluation`}
                  </span>
                </div>

                {pendingScorecards.length > 0 ? (
                  pendingScorecards.map((cand) => (
                    <div 
                      key={cand.id}
                      className={`rounded-2xl p-4 shadow-2xs space-y-3 transition-all ${
                        cand.isNudged 
                          ? 'bg-rose-50/40 animate-pulse border border-rose-200/60' 
                          : 'bg-white border border-[#eaecf0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                              cand.isNudged 
                                ? 'bg-rose-100 text-rose-800 border border-rose-200/60' 
                                : 'text-amber-700 bg-amber-50 border border-amber-200'
                            }`}>
                              {cand.isNudged ? 'Nudged by Coordinator' : 'Scorecard Due Today'}
                            </span>
                            <span className="text-[11px] text-[#667085]">{cand.pstTimeSlot}</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#101828]">
                            {cand.candidateName} — {cand.roundName}
                          </h3>
                          <p className="text-xs text-[#475467]">
                            Role: {cand.role} • Room: {cand.roomName}. Rate competencies and submit recommendation.
                          </p>
                        </div>

                        <button
                          onClick={() => handleOpenScoreModal(cand)}
                          className="px-4 py-2 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Score Now</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : assignments.length === 0 ? (
                  <div className="bg-[#f9fafb] border border-dashed border-[#eaecf0] rounded-2xl p-6 text-center text-xs text-[#667085] space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-[#98a2b3] mx-auto mb-1" />
                    <p className="font-semibold text-[#344054]">No evaluations assigned yet</p>
                    <p className="text-[11px]">When candidates are scheduled with your panel, pending scorecards will appear here.</p>
                  </div>
                ) : (
                  <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl p-4 text-xs text-[#027a48] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#12b76a]" />
                      <div>
                        <strong className="block text-sm">All Scorecards Submitted!</strong>
                        <span className="text-[11px]">All assigned candidates have been scored. Good job keeping interview loops smooth!</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-white text-[10px] font-bold rounded-full border border-[#a6f4c5]">
                      COMPLETED
                    </span>
                  </div>
                )}

                {/* Calibrated Guidelines */}
                <div className="bg-white border border-[#eaecf0] rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
                  <span className="font-bold text-[#101828] block">
                    {isDemoMode ? 'Google SDE Panel Calibration Rubric' : 'Interview Evaluation Calibration Rubric'}
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 bg-[#f9fafb] rounded-xl border border-[#eaecf0]">
                      <strong className="text-[#101828] block">Strong Hire (5)</strong>
                      <span className="text-[#667085]">Clean algorithm, optimal complexity, self-corrects edges.</span>
                    </div>
                    <div className="p-2.5 bg-[#f9fafb] rounded-xl border border-[#eaecf0]">
                      <strong className="text-[#101828] block">Hire (4)</strong>
                      <span className="text-[#667085]">Working solution with minimal prompts, good communication.</span>
                    </div>
                    <div className="p-2.5 bg-[#f9fafb] rounded-xl border border-[#eaecf0]">
                      <strong className="text-[#101828] block">No Hire (1-2)</strong>
                      <span className="text-[#667085]">Struggled with core structures or syntax barriers.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Upcoming Sessions */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1668e8]" />
                    Upcoming Today
                  </h2>
                  <button 
                    onClick={() => onNavigate('flowchart')}
                    className="text-xs text-[#1668e8] hover:underline font-semibold"
                  >
                    View All Loops →
                  </button>
                </div>

                <div className="bg-white border border-[#eaecf0] rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
                  {isDemoMode ? (
                    <>
                      <div className="p-3 bg-[#f8f9fa] border border-[#eaecf0] rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101828]">Round 1: DSA Screen</span>
                          <span className="text-[11px] font-semibold text-[#1668e8]">Today, {convertTime('10:00 AM')}</span>
                        </div>
                        <p className="text-[#475467] text-[11px]">Candidate: Marcus Vance (Google SDE)</p>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#eaecf0]">
                          <a
                            href="https://meet.google.com/chk-dist-sys"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1668e8] font-semibold text-[11px] flex items-center gap-1 hover:underline"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join Google Meet</span>
                          </a>
                        </div>
                      </div>

                      <div className="p-3 bg-[#f8f9fa] border border-[#eaecf0] rounded-xl space-y-1.5 opacity-75">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101828]">Round 2: Architecture Review</span>
                          <span className="text-[11px] font-semibold text-[#1668e8]">Tomorrow, {convertTime('2:00 PM')}</span>
                        </div>
                        <p className="text-[#475467] text-[11px]">Candidate: Elena Rostova (Staff Loop)</p>
                      </div>
                    </>
                  ) : assignments.length > 0 ? (
                    assignments.slice(0, 3).map((assign) => (
                      <div key={assign.id} className="p-3 bg-[#f8f9fa] border border-[#eaecf0] rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101828]">{assign.roundName}</span>
                          <span className="text-[11px] font-semibold text-[#1668e8]">{assign.pstTimeSlot}</span>
                        </div>
                        <p className="text-[#475467] text-[11px]">Candidate: {assign.candidateName} ({assign.role})</p>
                        {assign.meetingLink && (
                          <div className="flex items-center gap-2 pt-1 border-t border-[#eaecf0]">
                            <a
                              href={assign.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1668e8] font-semibold text-[11px] flex items-center gap-1 hover:underline"
                            >
                              <Video className="w-3 h-3" />
                              <span>Join Meeting</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-[#667085] space-y-1">
                      <Clock className="w-5 h-5 text-[#98a2b3] mx-auto mb-1" />
                      <p className="font-semibold text-xs text-[#344054]">No sessions scheduled today</p>
                      <p className="text-[11px]">When candidates are assigned to your panel, sessions will appear here.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: CANDIDATE HOME DASHBOARD */}
        {/* ========================================================================= */}
        {currentUser.role === 'CANDIDATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (6 cols): Placement Loop Invite & Actions */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#1668e8]" />
                  Loop Invitation & Status
                </h2>
              </div>

              {isDemoMode ? (
                !isInviteAccepted ? (
                  <div className="bg-[#eff8ff] border border-[#b2ddff] rounded-2xl p-5 shadow-xs space-y-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1668e8] text-white uppercase tracking-wider">
                        Action Required
                      </span>
                      <h3 className="text-base font-bold text-[#101828] mt-2">
                        Google SDE Campus Placement Loop
                      </h3>
                      <p className="text-xs text-[#344054] mt-1 leading-relaxed">
                        You have been invited to a 3-round evaluation loop (DSA Screen, Distributed Architecture, Values). Accept to confirm your schedule and lock your slots.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          acceptInvite();
                          showToast('Loop invitation accepted! Schedule confirmed.');
                        }}
                        className="w-full py-2.5 px-4 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shadow-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Invite & Confirm Slots</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl p-5 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold">Interview Schedule Confirmed</h3>
                    </div>
                    <p className="text-xs text-[#027a48] leading-relaxed">
                      Your 3 interview rounds have been locked in the master calendar. Review your meeting links on the right before each round.
                    </p>
                  </div>
                )
              ) : scheduleState?.activeSessions && scheduleState.activeSessions.length > 0 ? (
                <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold">Interview Schedule Active</h3>
                  </div>
                  <p className="text-xs text-[#027a48] leading-relaxed">
                    Your scheduled interview rounds have been synchronized. Review your upcoming meetings and video rooms on the right.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#eaecf0] rounded-2xl p-6 shadow-2xs text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center mx-auto text-[#667085]">
                    <Send className="w-5 h-5 text-[#667085]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#101828]">No Active Invitations</h3>
                    <p className="text-xs text-[#667085] leading-relaxed max-w-sm mx-auto">
                      You do not have any pending interview invitations. Once a coordinator schedules an interview loop for you, your invitation details and schedule confirmation will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (6 cols): Confirmed Interview Rounds */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1668e8]" />
                  My Confirmed Interviews
                </h2>
                <button
                  onClick={() => onNavigate('flowchart')}
                  className="text-xs text-[#1668e8] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Detailed View</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white border border-[#eaecf0] rounded-2xl divide-y divide-[#f2f4f7] shadow-2xs text-xs overflow-hidden">
                {isDemoMode ? (
                  <>
                    {/* Round 1 */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#1668e8] uppercase">Round 1 (60 min)</span>
                          <h4 className="text-xs font-bold text-[#101828]">Problem Solving & DSA Screen</h4>
                          <p className="text-[11px] text-[#667085]">Interviewer: Dr. Sarah Chen (Google)</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Mon Oct 26 • {convertTime('10:00 AM')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <a
                          href="https://meet.google.com/chk-dist-sys"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1668e8] font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Google Meet</span>
                        </a>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#6941c6] uppercase">Round 2 (60 min)</span>
                          <h4 className="text-xs font-bold text-[#101828]">Distributed Systems Architecture</h4>
                          <p className="text-[11px] text-[#667085]">Interviewer: Phil Dunphy (Atlassian)</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          Tue Oct 27 • {convertTime('2:00 PM')}
                        </span>
                      </div>
                    </div>

                    {/* Round 3 */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#027a48] uppercase">Round 3 (45 min)</span>
                          <h4 className="text-xs font-bold text-[#101828]">Engineering Culture & Values</h4>
                          <p className="text-[11px] text-[#667085]">Interviewer: Claire Pritchett (Lead)</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Fri Oct 30 • {convertTime('2:00 PM')}
                        </span>
                      </div>
                    </div>
                  </>
                ) : scheduleState?.activeSessions && scheduleState.activeSessions.length > 0 ? (
                  scheduleState.activeSessions.map((sess, idx) => (
                    <div key={sess.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#1668e8] uppercase">
                            Round {idx + 1} ({sess.durationMins} min)
                          </span>
                          <h4 className="text-xs font-bold text-[#101828]">{sess.title}</h4>
                          <p className="text-[11px] text-[#667085]">Interviewer: {sess.interviewer} ({sess.interviewerRole})</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {sess.pstTimeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <a
                          href={`https://meet.google.com/chk-${sess.room.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1668e8] font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Video Meeting ({sess.room})</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-[#667085] space-y-2">
                    <Calendar className="w-6 h-6 text-[#98a2b3] mx-auto" />
                    <p className="font-semibold text-xs text-[#344054]">No confirmed interview rounds</p>
                    <p className="text-[11px] max-w-xs mx-auto">
                      When your interview rounds are finalized, your time slots and meeting links will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: Evaluation Scorecard Modal for Interviewer */}
      {evalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#eaecf0] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#1668e8] bg-[#eff8ff] px-2.5 py-0.5 rounded-full border border-[#b2ddff] uppercase">
                  Candidate Evaluation Scorecard
                </span>
                <h3 className="text-base font-bold text-[#101828] mt-1">
                  {activeEvalAssignment?.candidateName || 'Marcus Vance'} — {activeEvalAssignment?.roundName || 'Round 1: DSA Screen'}
                </h3>
              </div>
              <button 
                onClick={() => setEvalModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
              {/* Problem Solving Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#344054]">
                  <span>Problem Solving & Technical Competence</span>
                  <span className="text-[#1668e8] font-bold">{scoreProblemSolving} / 5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreProblemSolving(val)}
                      className={`flex-1 py-1.5 rounded-full border font-bold transition-all ${
                        scoreProblemSolving === val
                          ? 'bg-[#1668e8] border-[#1668e8] text-white shadow-xs'
                          : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Systems Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#344054]">
                  <span>System Architecture & Algorithmic Clarity</span>
                  <span className="text-[#1668e8] font-bold">{scoreArchitecture} / 5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreArchitecture(val)}
                      className={`flex-1 py-1.5 rounded-full border font-bold transition-all ${
                        scoreArchitecture === val
                          ? 'bg-[#1668e8] border-[#1668e8] text-white shadow-xs'
                          : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#344054]">Hiring Recommendation</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STRONG_HIRE', 'HIRE', 'NO_HIRE'] as const).map((rec) => (
                    <button
                      type="button"
                      key={rec}
                      onClick={() => setScoreRecommendation(rec)}
                      className={`py-1.5 rounded-full border font-semibold text-center transition-all ${
                        scoreRecommendation === rec
                          ? rec === 'NO_HIRE'
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'bg-[#0b7c3e] border-[#0b7c3e] text-white'
                          : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {rec.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Notes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#344054]">Evaluation Notes & Feedback</label>
                <textarea
                  rows={3}
                  value={scoreFeedback}
                  onChange={(e) => setScoreFeedback(e.target.value)}
                  className="w-full bg-white border border-[#d0d5dd] rounded-xl p-2.5 text-xs text-[#344054] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setEvalModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs transition-colors"
                >
                  Submit Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create & Send New Profile to Interviewer (Coordinator Feature) */}
      {createProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#eaecf0] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#1668e8] bg-[#eff8ff] px-2.5 py-0.5 rounded-full border border-[#b2ddff] uppercase">
                  Coordinator Action
                </span>
                <h3 className="text-base font-bold text-[#101828] mt-1">
                  Create Candidate Profile to Score
                </h3>
              </div>
              <button 
                onClick={() => setCreateProfileModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAndSendProfile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Mehta"
                  value={newCandName}
                  onChange={(e) => setNewCandName(e.target.value)}
                  className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Target Role</label>
                  <input
                    type="text"
                    required
                    value={newCandRole}
                    onChange={(e) => setNewCandRole(e.target.value)}
                    className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Assigned Interviewer</label>
                  <select
                    value={newInterviewerName}
                    onChange={(e) => setNewInterviewerName(e.target.value)}
                    className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                  >
                    <option value="Dr. Sarah Chen">Dr. Sarah Chen (Google Lead)</option>
                    <option value="Phil Dunphy">Phil Dunphy (Atlassian)</option>
                    <option value="Claire Pritchett">Claire Pritchett (Principal)</option>
                    <option value="Manny Delgado">Manny Delgado (Architect)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Interview Round</label>
                <input
                  type="text"
                  required
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Time Window</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#344054]">Meeting Room</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-full px-3.5 py-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Focus Areas / Criteria</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#f8f9fa] focus:bg-white border border-[#d0d5dd] rounded-xl p-2.5 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setCreateProfileModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Interviewer Desk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Re-solve Matrix CP-SAT Solver Modal */}
      {activeResolveReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#eaecf0] shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1668e8]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">CP-SAT Matrix Re-Solver</h3>
                  <p className="text-xs text-[#667085]">Minimal-churn conflict resolution & zero-overlap slot reallocation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveResolveReq(null)}
                className="text-[#98a2b3] hover:text-[#344054] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reported Bottleneck Details */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Reported Bottleneck</span>
                <span className="text-[11px] text-amber-700 font-medium">Candidate Conflict</span>
              </div>
              <div className="text-xs font-bold text-[#101828]">{activeResolveReq.subject}</div>
              <div className="text-[11px] text-[#475467]">{activeResolveReq.body}</div>
            </div>

            {/* CP-SAT Optimal Proposed Slot */}
            <div className="bg-[#f8f9fa] border border-[#eaecf0] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#344054] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Computed Zero-Conflict Slot
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Stability: 99.4% Minimal Churn
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-[#eaecf0]">
                  <span className="text-[10px] text-[#667085] block font-medium">Proposed Date & Time</span>
                  <span className="font-bold text-[#101828]">Tuesday, Oct 27 • 2:00 PM – 2:45 PM PST</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#eaecf0]">
                  <span className="text-[10px] text-[#667085] block font-medium">Room & Evaluator</span>
                  <span className="font-bold text-[#101828]">Virtual Pod Alpha • Claire Pritchett</span>
                </div>
              </div>

              <div className="text-[11px] text-[#475467] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Validated against 14 panel constraints, 0 room overlaps, and evaluator availability.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f2f4f7]">
              <button
                type="button"
                onClick={() => setActiveResolveReq(null)}
                className="px-4 py-2 text-xs font-semibold text-[#344054] hover:bg-[#f2f4f7] rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResolvingMatrix}
                onClick={handleConfirmResolveMatrix}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1668e8] hover:bg-[#145ac7] rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {isResolvingMatrix ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Solving Constraints...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Re-solved Slot & Notify Parties</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
