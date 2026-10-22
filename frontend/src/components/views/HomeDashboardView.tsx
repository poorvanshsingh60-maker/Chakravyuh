import React, { useState } from 'react';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Users, 
  FileText, 
  Video, 
  ChevronRight,
  ShieldAlert,
  Send,
  UserCheck,
  CalendarCheck,
  Info
} from 'lucide-react';
import { UserRole } from '../../types/user';
import { NavTab, Task, CandidateItem } from '../../types';
import { useTimezone } from '../../context/TimezoneContext';
import { TimezoneSelector } from '../common/TimezoneSelector';
import { ChakravyuhLogo } from '../ChakravyuhLogo';

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
  onSwitchRole: (role: UserRole) => void;
  onCompleteTask?: (taskId: string) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  tasks,
  candidates,
  onNavigate,
  onSwitchRole,
  onCompleteTask: _onCompleteTask
}) => {
  const { currentTimezone, convertHourLabel } = useTimezone();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAlertDismissed = (id: string) => dismissedAlerts.includes(id);
  const dismissAlert = (id: string) => setDismissedAlerts([...dismissedAlerts, id]);

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const urgentTasks = pendingTasks.filter(t => t.priority === 'HIGH');

  return (
    <div className="flex-1 bg-[#f8f9fa] min-h-screen pb-16 overflow-y-auto font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Hero Header */}
      <div className="bg-white border-b border-[#eaecf0] px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <ChakravyuhLogo size={32} showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#101828] tracking-tight">
                  Welcome back, {currentUser.full_name}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  currentUser.role === 'COORDINATOR'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : currentUser.role === 'INTERVIEWER'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Chakravyuh Central Command • Google OR-Tools CP-SAT Labyrinth Scheduler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TimezoneSelector variant="compact" />
            <div className="flex items-center bg-[#f2f4f7] p-1 rounded-lg border border-[#eaecf0] text-xs font-semibold">
              <span className="text-[#667085] px-2 text-[11px]">View as:</span>
              <button
                onClick={() => onSwitchRole('COORDINATOR')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  currentUser.role === 'COORDINATOR'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                👑 Coordinator
              </button>
              <button
                onClick={() => onSwitchRole('INTERVIEWER')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  currentUser.role === 'INTERVIEWER'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                💼 Interviewer
              </button>
              <button
                onClick={() => onSwitchRole('CANDIDATE')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  currentUser.role === 'CANDIDATE'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                🎓 Candidate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">

        {/* ============================================================== */}
        {/* MOODLE-STYLE RED URGENT ALERT BANNER / ACTION CENTER           */}
        {/* ============================================================== */}
        <section aria-label="Urgent Alerts" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-sm font-bold text-[#b42318] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Urgent Action Required (Immediate Attention)
              </h2>
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
              SLA Impact High
            </span>
          </div>

          {/* ----------------- COORDINATOR URGENT ALERTS ----------------- */}
          {currentUser.role === 'COORDINATOR' && (
            <div className="space-y-2.5">
              {!isAlertDismissed('coord-urgent-1') && (
                <div className="bg-[#fef3f2] border-l-4 border-l-[#d92d20] border-y border-r border-[#fecdca] rounded-r-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wide">
                          CRITICAL OVERDUE
                        </span>
                        <h3 className="font-bold text-sm text-[#912018]">
                          2 Scorecards Overdue (&gt;24 Hours SLA Breach)
                        </h3>
                        <span className="text-xs text-red-600 font-medium">Due Yesterday 5:00 PM</span>
                      </div>
                      <p className="text-xs text-[#551613] mt-1 leading-relaxed">
                        Interviewer Dr. Sarah Chen and Marcus Vance have not submitted interview rubrics for <strong>Alex Mercer</strong> (Senior Distributed Systems Engineer loop). Debrief is currently blocked.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => {
                        showToast('Urgent Slack & Email reminder ping sent to interviewers!');
                        dismissAlert('coord-urgent-1');
                      }}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ping Interviewers</span>
                    </button>
                    <button 
                      onClick={() => onNavigate('my-tasks')}
                      className="px-3 py-1.5 bg-white border border-[#fecdca] hover:bg-red-50 text-red-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              )}

              {!isAlertDismissed('coord-urgent-2') && (
                <div className="bg-[#fef3f2] border-l-4 border-l-[#f04438] border-y border-r border-[#fecdca] rounded-r-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
                      <Cpu className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wide">
                          CONFLICT DETECTED
                        </span>
                        <h3 className="font-bold text-sm text-[#912018]">
                          Room Collision Alert: Turing Hall A Double-Booked
                        </h3>
                        <span className="text-xs text-red-600 font-medium">Scheduled Today at {convertHourLabel(14).full}</span>
                      </div>
                      <p className="text-xs text-[#551613] mt-1 leading-relaxed">
                        Executive Review for Candidate Priya Patel clashes with Systems Arch Round. Run CP-SAT solver to auto-reassign to Lovelace Conf Lab without interviewer rescheduling.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('scheduling')}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Fix in CP-SAT</span>
                    </button>
                    <button 
                      onClick={() => dismissAlert('coord-urgent-2')}
                      className="px-2.5 py-1.5 text-xs text-[#7a271a] hover:text-[#551613]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------- INTERVIEWER URGENT ALERTS ----------------- */}
          {currentUser.role === 'INTERVIEWER' && (
            <div className="space-y-2.5">
              {!isAlertDismissed('int-urgent-1') && (
                <div className="bg-[#fef3f2] border-l-4 border-l-[#d92d20] border-y border-r border-[#fecdca] rounded-r-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wide">
                          OVERDUE SCORECARD
                        </span>
                        <h3 className="font-bold text-sm text-[#912018]">
                          Submit Evaluation for Alex Mercer (Systems Architecture Round)
                        </h3>
                        <span className="text-xs text-red-600 font-medium font-mono">18h Past Deadline</span>
                      </div>
                      <p className="text-xs text-[#551613] mt-1 leading-relaxed">
                        Hiring Committee convenes tomorrow at 10:00 AM. Please grade technical competency, code modularity, and problem-solving rubric to unblock offer determination.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Grade Rubric Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {!isAlertDismissed('int-urgent-2') && (
                <div className="bg-[#fff6ed] border-l-4 border-l-[#f79009] border-y border-r border-[#fedf89] rounded-r-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-600 text-white tracking-wide">
                          ACTION REQUIRED
                        </span>
                        <h3 className="font-bold text-sm text-[#7a2e0e]">
                          Confirm Next Week Availability by 5:00 PM Today
                        </h3>
                      </div>
                      <p className="text-xs text-[#7a2e0e] mt-1 leading-relaxed">
                        Chakravyuh CP-SAT optimization requires your weekly availability windows to lock schedules for 4 Senior Backend Loops.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Confirm Slots</span>
                    </button>
                    <button 
                      onClick={() => dismissAlert('int-urgent-2')}
                      className="px-2.5 py-1.5 text-xs text-amber-800 hover:text-amber-950"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------- CANDIDATE URGENT ALERTS ----------------- */}
          {currentUser.role === 'CANDIDATE' && (
            <div className="space-y-2.5">
              {!isAlertDismissed('cand-urgent-1') && (
                <div className="bg-[#fef3f2] border-l-4 border-l-[#d92d20] border-y border-r border-[#fecdca] rounded-r-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wide">
                          DEADLINE: 24 HOURS
                        </span>
                        <h3 className="font-bold text-sm text-[#912018]">
                          Select Your Preferred Interview Slots for Technical Loop
                        </h3>
                        <span className="text-xs text-red-600 font-medium">Closes Friday 6:00 PM</span>
                      </div>
                      <p className="text-xs text-[#551613] mt-1 leading-relaxed">
                        Please choose at least 3 convenient time slots across Thursday or Friday. The Chakravyuh solver will match your availability with your interview panel in <strong>{currentTimezone.label}</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Pick Time Slots</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* KPI OVERVIEW CARDS                                             */}
        {/* ============================================================== */}
        <section aria-label="Key Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-xl border border-[#eaecf0] shadow-2xs hover:border-[#1668e8] transition-all">
              <div className="flex items-center justify-between text-[#667085]">
                <span className="text-xs font-medium">
                  {currentUser.role === 'COORDINATOR' ? 'Active Candidate Loops' : currentUser.role === 'INTERVIEWER' ? 'Interviews Conducted' : 'Completed Rounds'}
                </span>
                <Users className="w-4 h-4 text-[#1668e8]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#101828]">
                  {currentUser.role === 'COORDINATOR' ? candidates.length : currentUser.role === 'INTERVIEWER' ? '12' : '1 of 3'}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {currentUser.role === 'COORDINATOR' ? '+14% this month' : currentUser.role === 'INTERVIEWER' ? 'Top 10%' : 'Stage 2 Active'}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                {currentUser.role === 'COORDINATOR' ? 'Across 5 engineering roles' : currentUser.role === 'INTERVIEWER' ? 'Target: 14 per quarter' : 'Staff Systems Role'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl border border-[#eaecf0] shadow-2xs hover:border-[#1668e8] transition-all">
              <div className="flex items-center justify-between text-[#667085]">
                <span className="text-xs font-medium">CP-SAT Zero-Conflict Rate</span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#101828]">100%</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  0 Overlaps
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                Constraint satisfaction solver verified
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-xl border border-[#eaecf0] shadow-2xs hover:border-[#1668e8] transition-all">
              <div className="flex items-center justify-between text-[#667085]">
                <span className="text-xs font-medium">Pending Tasks</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#101828]">{pendingTasks.length}</span>
                {urgentTasks.length > 0 && (
                  <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                    {urgentTasks.length} urgent
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                {pendingTasks.length} action items require attention
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 rounded-xl border border-[#eaecf0] shadow-2xs hover:border-[#1668e8] transition-all">
              <div className="flex items-center justify-between text-[#667085]">
                <span className="text-xs font-medium">Panel Load Balance</span>
                <CheckCircle2 className="w-4 h-4 text-[#1668e8]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#101828]">Optimal</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  Gini: 0.08
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                No interviewer exceeding 4 hrs/wk
              </p>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* MAIN SPLIT: TODAY'S SCHEDULE & QUICK ACTIONS                   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Schedule / Active Pipelines */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Schedule Feed */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-[#eaecf0] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#101828]">Today's Scheduled Loops</h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Synchronized across Google Meet & In-Person Rooms ({currentTimezone.label})
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('upcoming')}
                  className="text-xs font-semibold text-[#1668e8] hover:underline flex items-center gap-1"
                >
                  <span>Full Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#f2f4f7]">
                
                {/* Event 1 */}
                <div className="p-4 hover:bg-[#fafafa] transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-bold shrink-0 text-[11px] px-1 text-center">
                      <span>{convertHourLabel(10).full}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#101828]">Alex Mercer</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          Technical Screen
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-2">
                        <span>Staff Distributed Systems Engineer</span>
                        <span>•</span>
                        <span>Room: Turing Hall A</span>
                        <span>•</span>
                        <span>Interviewer: Dr. Sarah Chen</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href="https://meet.google.com/abc-defg-hij"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg border border-[#eaecf0] text-xs font-semibold text-[#344054] hover:bg-[#f2f4f7] flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-[#1668e8]" />
                      <span>Meet</span>
                    </a>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="p-4 hover:bg-[#fafafa] transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-bold shrink-0 text-[11px] px-1 text-center">
                      <span>{convertHourLabel(14).full}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#101828]">Priya Patel</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                          System Design & Architecture
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-2">
                        <span>Lead Cloud Architect</span>
                        <span>•</span>
                        <span>Room: Lovelace Conf Lab</span>
                        <span>•</span>
                        <span>Interviewer: David Kim</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('flowchart')}
                      className="px-2.5 py-1.5 rounded-lg border border-[#eaecf0] text-xs font-semibold text-[#344054] hover:bg-[#f2f4f7] flex items-center gap-1"
                    >
                      <span>Prepare</span>
                    </button>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="p-4 hover:bg-[#fafafa] transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-bold shrink-0 text-[11px] px-1 text-center">
                      <span>{convertHourLabel(16).full}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#101828]">Elena Rostova</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Values & Leadership Fit
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-2">
                        <span>Engineering Director</span>
                        <span>•</span>
                        <span>Virtual Video</span>
                        <span>•</span>
                        <span>Interviewer: Michael Scott</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-medium text-[#667085]">Scheduled</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Candidate Pipeline Status */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-[#101828]">Active Candidate Pipeline</h3>
                <button 
                  onClick={() => onNavigate('candidates')}
                  className="text-xs font-semibold text-[#1668e8] hover:underline"
                >
                  View all ({candidates.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.slice(0, 4).map((cand) => (
                  <div 
                    key={cand.id} 
                    className="p-3 rounded-lg border border-[#eaecf0] hover:border-[#1668e8] transition-all bg-[#fafafa]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#101828]">{cand.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cand.status === 'SCHEDULED' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {cand.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1">{cand.role}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#98a2b3]">
                      <span>Stage: {cand.stage}</span>
                      <span>Recruiter: {cand.recruiter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Quick Actions & Solver Diagnostic */}
          <div className="space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs p-4 space-y-3">
              <h3 className="font-bold text-sm text-[#101828]">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('scheduling')}
                  className="w-full p-2.5 rounded-lg bg-[#1668e8] hover:bg-[#1253b8] text-white text-xs font-semibold flex items-center justify-between transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Run CP-SAT Solver</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </button>

                <button
                  onClick={() => onNavigate('flowchart')}
                  className="w-full p-2.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#1668e8]" />
                    <span>Open Flowmap Workspace</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#98a2b3]" />
                </button>

                <button
                  onClick={() => onNavigate('candidates')}
                  className="w-full p-2.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#667085]" />
                    <span>Add Candidate to Loop</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#98a2b3]" />
                </button>

                <button
                  onClick={() => onNavigate('communications')}
                  className="w-full p-2.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#667085]" />
                    <span>Send Batch Invitations</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#98a2b3]" />
                </button>
              </div>
            </div>

            {/* CP-SAT Solver Health Card */}
            <div className="bg-[#f0f9ff] rounded-xl border border-[#b9e6fe] p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#026aa2]">
                <Cpu className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wide">
                  Chakravyuh Optimization Engine
                </span>
              </div>
              <p className="text-[11px] text-[#026aa2] leading-relaxed">
                Operating under Google OR-Tools CP-SAT v9.8.3296. Hard constraints (room capacity, interviewer skills, candidate order) 100% satisfied.
              </p>
              <div className="space-y-1.5 pt-1 text-[11px] text-[#026aa2]">
                <div className="flex justify-between">
                  <span>Engine Status:</span>
                  <span className="font-bold text-emerald-700">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Solver Run:</span>
                  <span className="font-mono">14 mins ago (112ms)</span>
                </div>
                <div className="flex justify-between">
                  <span>Interviewer Pool:</span>
                  <span className="font-mono">18 calibrated</span>
                </div>
              </div>
            </div>

            {/* Support / Quick Help */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-4 text-xs text-[#667085] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#98a2b3]" />
                <span>Need help configuring rounds?</span>
              </div>
              <button 
                onClick={() => onNavigate('help')}
                className="font-semibold text-[#1668e8] hover:underline"
              >
                Help Docs
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
