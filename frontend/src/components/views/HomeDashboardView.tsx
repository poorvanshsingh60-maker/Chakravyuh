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
  X
} from 'lucide-react';
import { UserRole } from '../../types/user';
import { NavTab, Task, CandidateItem } from '../../types';
import { useTimezone } from '../../context/TimezoneContext';
import { useCoordination } from '../../context/CoordinationContext';

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
    isScorecardSubmitted, 
    interviewerDecision,
    isNudged,
    nudgeInterviewer,
    submitScorecard
  } = useCoordination();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Home scorecard modal state
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [scoreProblemSolving, setScoreProblemSolving] = useState(5);
  const [scoreArchitecture, setScoreArchitecture] = useState(4);
  const [scoreRecommendation, setScoreRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE'>('STRONG_HIRE');
  const [scoreFeedback, setScoreFeedback] = useState('Excellent problem decomposition, clean graph traversal implementation, and optimal time complexity analysis.');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitScorecard(scoreRecommendation, scoreProblemSolving);
    setEvalModalOpen(false);
    showToast('Scorecard submitted for Marcus Vance! Hiring decision updated and unfilled scorecards cleared.');
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-y-auto font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Strip (Clean Standard SaaS Demo - No duplicate title or timezone) */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff] uppercase tracking-wider">
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
            <button
              onClick={() => onNavigate(currentUser.role === 'COORDINATOR' ? 'scheduling' : 'flowchart')}
              className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {currentUser.role === 'COORDINATOR' ? 'Automate Schedule' : currentUser.role === 'INTERVIEWER' ? 'My Interview Loops' : 'View Schedule & Slots'}
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
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  2 Items Require Action
                </span>
              </div>

              {/* Task 1: Overdue Scorecard Reminder */}
              <div className="bg-white border border-[#eaecf0] rounded-xl p-4 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                        Overdue Scorecard
                      </span>
                      <span className="text-[11px] text-[#667085]">Google SDE Panel</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#101828]">
                      Nudge Dr. Sarah Chen for Marcus Vance's Round 1 Evaluation
                    </h3>
                    <p className="text-[11px] text-[#475467]">
                      DSA Screen ended 3 hours ago. Scorecard needed to unlock Round 2 Systems slot.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      nudgeInterviewer();
                      showToast('Urgent reminder dispatched to Dr. Sarah Chen! Interviewer panel updated with high-priority alert.');
                    }}
                    className={`px-3 py-1.5 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 shadow-xs transition-all ${
                      isNudged
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-[#1668e8] hover:bg-[#145ac7]'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    <span>{isNudged ? 'Nudged (Re-send)' : 'Nudge Panel'}</span>
                  </button>
                </div>
              </div>

              {/* Task 2: Unconfirmed Candidate Invite */}
              <div className="bg-white border border-[#eaecf0] rounded-xl p-4 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
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
                    className="px-3 py-1.5 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold rounded-lg shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Task 3: Quick CP-SAT Optimization Nudge */}
              <div className="bg-[#f0f9ff] border border-[#b9e6fe] rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <div>
                    <strong className="text-[#0369a1] block">CP-SAT Engine Ready</strong>
                    <span className="text-[11px] text-[#0284c7]">Zero resource overlaps detected across 14 scheduled rounds.</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('scheduling')}
                  className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shrink-0 text-[11px]"
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
                  className="text-xs text-[#1668e8] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Automate Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white border border-[#eaecf0] rounded-xl divide-y divide-[#f2f4f7] shadow-2xs text-xs">
                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[11px] font-bold text-[#1668e8]">{convertTime('10:00 AM – 10:45 AM')}</span>
                    <h4 className="font-bold text-[#101828]">Marcus Vance • Round 1 (Coding)</h4>
                    <span className="text-[11px] text-[#667085]">Interviewer: Dr. Sarah Chen</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Terminal 12
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[11px] font-bold text-[#1668e8]">{convertTime('1:00 PM – 2:00 PM')}</span>
                    <h4 className="font-bold text-[#101828]">Priya Sharma • System Design</h4>
                    <span className="text-[11px] text-[#667085]">Interviewer: Phil Dunphy</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Terminal 08
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[11px] font-bold text-[#1668e8]">{convertTime('3:00 PM – 3:45 PM')}</span>
                    <h4 className="font-bold text-[#101828]">Elena Rostova • Values & Leadership</h4>
                    <span className="text-[11px] text-[#667085]">Interviewer: Claire Pritchett</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Suite 402
                  </span>
                </div>
              </div>

              {/* Metric Snapshot */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white border border-[#eaecf0] rounded-xl text-center">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Shortlisted</span>
                  <span className="text-xl font-bold text-[#101828]">5 Candidates</span>
                </div>
                <div className="p-3 bg-white border border-[#eaecf0] rounded-xl text-center">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Solver Horizon</span>
                  <span className="text-xl font-bold text-emerald-600">0 Overlaps</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* ROLE 2: INTERVIEWER HOME DASHBOARD */}
        {/* ========================================================================= */}
        {currentUser.role === 'INTERVIEWER' && (
          <div className="space-y-6">
            
            {/* Urgent Pings & Coordinator Nudges Hero Strip (Soft light-red breathing tint, Apple rounded-2xl, no red border, no warning sign) */}
            {!isScorecardSubmitted ? (
              <div className="bg-rose-50/70 animate-pulse border border-rose-200/50 rounded-2xl p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>{isNudged ? 'Evaluation Requested' : 'Coordinator Ping'}</span>
                    </span>
                    <span className="text-xs text-rose-900/70 font-medium">• From Coordinator Emma Watson</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Overdue 3h
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#101828] mt-1.5">
                    Marcus Vance — Round 1: Problem Solving & DSA Screen
                  </h3>
                  <p className="text-xs text-[#475467] mt-0.5 leading-relaxed">
                    Emma Watson requested Marcus Vance's scorecard. Candidate finished live coding session in Virtual Pod Alpha. Round 2 Systems schedule is currently frozen pending your evaluation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEvalModalOpen(true)}
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
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#027a48]">All Coordinator Pings & Nudges Resolved!</h3>
                    <p className="text-[11px] text-[#05603a]">
                      Marcus Vance evaluated as {interviewerDecision.replace('_', ' ')}. Zero pending bottlenecks across candidate loops.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-white text-[10px] font-bold rounded-full border border-[#a6f4c5] uppercase">
                  Zero Pending Loops
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (7 cols): Candidates Left to Score & Urgent Overdue */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-[#1668e8]" />
                    Candidates Left to Score
                  </h2>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    isScorecardSubmitted 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {isScorecardSubmitted ? '0 Pending' : '1 Pending Evaluation'}
                  </span>
                </div>

              {!isScorecardSubmitted ? (
                <div className={`rounded-2xl p-4 shadow-2xs space-y-3 transition-all ${
                  isNudged 
                    ? 'bg-rose-50/40 animate-pulse border border-rose-200/60' 
                    : 'bg-white border border-[#eaecf0]'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isNudged 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200/60' 
                            : 'text-amber-700 bg-amber-50 border border-amber-200'
                        }`}>
                          {isNudged ? 'Nudged by Coordinator' : 'Scorecard Due Today'}
                        </span>
                        <span className="text-[11px] text-[#667085]">Completed {convertTime('11:00 AM')}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#101828]">
                        Marcus Vance — Round 1: Problem Solving & DSA Screen
                      </h3>
                      <p className="text-xs text-[#475467]">
                        Candidate completed live coding session in Virtual Pod Alpha. Rate technical competencies and submit recommendation to advance candidate loop.
                      </p>
                    </div>

                    <button
                      onClick={() => setEvalModalOpen(true)}
                      className="px-4 py-2 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Score Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-xl p-4 text-xs text-[#027a48] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#12b76a]" />
                    <div>
                      <strong className="block text-sm">All Scorecards Submitted!</strong>
                      <span className="text-[11px]">Marcus Vance evaluated as {interviewerDecision.replace('_', ' ')}. Good job keeping loops zero-churn.</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-[10px] font-bold rounded border border-[#a6f4c5]">
                    COMPLETED
                  </span>
                </div>
              )}

              {/* Calibrated Guidelines */}
              <div className="bg-white border border-[#eaecf0] rounded-xl p-4 shadow-2xs space-y-2 text-xs">
                <h4 className="font-bold text-[#101828]">Bar-Raiser Rubric Reminder</h4>
                <p className="text-[#475467] text-[11px] leading-relaxed">
                  Focus on algorithmic clarity, handling corner cases in distributed partitions, and clear technical communication.
                </p>
              </div>
            </div>

            {/* Right Column (5 cols): Upcoming Sessions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1668e8]" />
                  My Scheduled Rounds
                </h2>
                <button
                  onClick={() => onNavigate('flowchart')}
                  className="text-xs text-[#1668e8] hover:underline font-semibold"
                >
                  Manage Availability
                </button>
              </div>

              <div className="bg-white border border-[#eaecf0] rounded-xl p-4 shadow-2xs space-y-3 text-xs">
                <div className="p-3 bg-[#f8f9fa] border border-[#eaecf0] rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#101828]">Round 1: DSA Screen</span>
                    <span className="text-[10px] font-mono text-[#667085]">Today, {convertTime('10:00 AM')}</span>
                  </div>
                  <p className="text-[#475467] text-[11px]">Candidate: Marcus Vance (Google SDE)</p>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#eaecf0]">
                    <a
                      href="https://meet.google.com/chk-dist-sys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1668e8] font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Google Meet</span>
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-[#f8f9fa] border border-[#eaecf0] rounded-lg space-y-1.5 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#101828]">Round 2: Architecture Review</span>
                    <span className="text-[10px] font-mono text-[#667085]">Tomorrow, {convertTime('2:00 PM')}</span>
                  </div>
                  <p className="text-[#475467] text-[11px]">Candidate: Elena Rostova (Staff Loop)</p>
                </div>
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

              {!isInviteAccepted ? (
                <div className="bg-[#eff8ff] border border-[#b2ddff] rounded-xl p-5 shadow-xs space-y-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1668e8] text-white uppercase tracking-wider">
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
                      className="w-full py-2.5 px-4 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Invite & Confirm Slots</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#ecfdf3] border border-[#a6f4c5] rounded-xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold">Interview Schedule Confirmed</h3>
                  </div>
                  <p className="text-xs text-[#027a48] leading-relaxed">
                    Your 3 interview rounds have been locked in the master calendar. Review your meeting links on the right before each round.
                  </p>
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

              <div className="bg-white border border-[#eaecf0] rounded-xl divide-y divide-[#f2f4f7] shadow-2xs text-xs">
                {/* Round 1 */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#1668e8] uppercase">Round 1 (60 min)</span>
                      <h4 className="text-xs font-bold text-[#101828]">Problem Solving & DSA Screen</h4>
                      <p className="text-[11px] text-[#667085]">Interviewer: Dr. Sarah Chen (Google)</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      Mon Oct 26 • {convertTime('10:00 AM')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <a
                      href="https://meet.google.com/chk-dist-sys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1668e8] font-bold flex items-center gap-1 hover:underline"
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Fri Oct 30 • {convertTime('2:00 PM')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Evaluation Scorecard Modal for Interviewer */}
      {evalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#1668e8] bg-[#eff8ff] px-2 py-0.5 rounded border border-[#b2ddff] uppercase">
                  Submit Candidate Scorecard
                </span>
                <h3 className="text-base font-bold text-[#101828] mt-1">
                  Marcus Vance — Round 1: DSA Screen
                </h3>
              </div>
              <button 
                onClick={() => setEvalModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
              {/* Problem Solving Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#344054]">
                  <span>Problem Solving & Data Structures</span>
                  <span className="text-[#1668e8] font-bold">{scoreProblemSolving} / 5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreProblemSolving(val)}
                      className={`flex-1 py-1.5 rounded-lg border font-bold transition-all ${
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
                      className={`flex-1 py-1.5 rounded-lg border font-bold transition-all ${
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
                      className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                        scoreRecommendation === rec
                          ? rec === 'NO_HIRE'
                            ? 'bg-red-600 border-red-600 text-white'
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
                  className="w-full bg-white border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#344054] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setEvalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-bold shadow-2xs"
                >
                  Submit Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
