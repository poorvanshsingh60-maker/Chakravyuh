import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Users, 
  Video, 
  ChevronRight,
  Send,
  CalendarCheck,
  Info,
  X
} from 'lucide-react';
import { UserRole } from '../../types/user';
import { NavTab, Task, CandidateItem } from '../../types';
import { useTimezone } from '../../context/TimezoneContext';

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
  tasks,
  candidates,
  onNavigate,
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828] tracking-tight">
              Welcome back, {currentUser.full_name}
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              {currentUser.role === 'COORDINATOR' && 'Recruiting Operations & Interview Scheduling'}
              {currentUser.role === 'INTERVIEWER' && 'Interviewer Portal & Scorecard Queue'}
              {currentUser.role === 'CANDIDATE' && 'Interview Schedule & Preparation Hub'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#475467] bg-[#f2f4f7] border border-[#eaecf0] px-3 py-1 rounded-full capitalize">
              {currentUser.role.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">

        {/* ============================================================== */}
        {/* CLEAN ACTION ITEMS / URGENT ALERTS                             */}
        {/* ============================================================== */}
        <section aria-label="Action Items" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#475467] uppercase tracking-wider">
                Action Required
              </h2>
            </div>
            <span className="text-xs text-[#667085]">
              {currentUser.role === 'COORDINATOR' ? '2 items require attention' : '1 item pending'}
            </span>
          </div>

          {/* ----------------- COORDINATOR URGENT ITEMS ----------------- */}
          {currentUser.role === 'COORDINATOR' && (
            <div className="space-y-3">
              {/* Item 1: Overdue Scorecard (Way too late -> fast heartbeat beating animation) */}
              {!isAlertDismissed('coord-urgent-1') && (
                <div className="bg-white border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      {/* Fast Beating Red Indicator for severely overdue items (>24h) */}
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 duration-700"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="animate-[pulse_0.75s_ease-in-out_infinite]">Overdue (24h+ SLA)</span>
                      </span>
                      <span className="text-xs text-[#98a2b3]">•</span>
                      <span className="text-xs text-[#667085]">Due yesterday at 5:00 PM</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#101828]">
                      2 Scorecards pending for Alex Mercer (Distributed Systems Loop)
                    </h3>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      Dr. Sarah Chen and Marcus Vance have not submitted rubrics. Debrief meeting is scheduled for tomorrow morning.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => {
                        showToast('Reminder sent to assigned interviewers.');
                        dismissAlert('coord-urgent-1');
                      }}
                      className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#1253b8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reminder</span>
                    </button>
                    <button 
                      onClick={() => onNavigate('my-tasks')}
                      className="px-3 py-1.5 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Task
                    </button>
                  </div>
                </div>
              )}

              {/* Item 2: Room Collision (Standard urgent -> gentle fade in/out animation) */}
              {!isAlertDismissed('coord-urgent-2') && (
                <div className="bg-white border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      {/* Gentle fade-in/fade-out red pulse for standard urgency */}
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
                        <span className="animate-[pulse_2s_ease-in-out_infinite]">Schedule Conflict</span>
                      </span>
                      <span className="text-xs text-[#98a2b3]">•</span>
                      <span className="text-xs text-[#667085]">Scheduled Today at {convertHourLabel(14).full}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#101828]">
                      Room collision detected: Turing Hall A double-booked
                    </h3>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      Executive Review for Priya Patel overlaps with Systems Arch round. Lovelace Conference Lab is currently available as an alternate.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('scheduling')}
                      className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#1253b8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Resolve Conflict</span>
                    </button>
                    <button 
                      onClick={() => dismissAlert('coord-urgent-2')}
                      className="p-1.5 text-[#98a2b3] hover:text-[#344054] rounded-lg hover:bg-[#f2f4f7]"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------- INTERVIEWER URGENT ITEMS ----------------- */}
          {currentUser.role === 'INTERVIEWER' && (
            <div className="space-y-3">
              {!isAlertDismissed('int-urgent-1') && (
                <div className="bg-white border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 duration-700"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="animate-[pulse_0.75s_ease-in-out_infinite]">Overdue (18 hours)</span>
                      </span>
                      <span className="text-xs text-[#98a2b3]">•</span>
                      <span className="text-xs text-[#667085]">Alex Mercer — Systems Architecture</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#101828]">
                      Complete candidate evaluation and scorecard
                    </h3>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      Please submit your ratings and written feedback to unblock the candidate's hiring decision.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#1253b8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Fill Scorecard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {!isAlertDismissed('int-urgent-2') && (
                <div className="bg-white border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite]" />
                        <span className="animate-[pulse_2s_ease-in-out_infinite]">Action required</span>
                      </span>
                      <span className="text-xs text-[#98a2b3]">•</span>
                      <span className="text-xs text-[#667085]">Due today by 5:00 PM</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#101828]">
                      Confirm upcoming availability for next week
                    </h3>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      Please confirm your interview availability slots so upcoming loops can be locked into the schedule.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#1668e8]" />
                      <span>Confirm Slots</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------- CANDIDATE URGENT ITEMS ----------------- */}
          {currentUser.role === 'CANDIDATE' && (
            <div className="space-y-3">
              {!isAlertDismissed('cand-urgent-1') && (
                <div className="bg-white border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
                        <span className="animate-[pulse_2s_ease-in-out_infinite]">Closes in 24 hours</span>
                      </span>
                      <span className="text-xs text-[#98a2b3]">•</span>
                      <span className="text-xs text-[#667085]">Friday 6:00 PM</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#101828]">
                      Select your preferred interview time slots
                    </h3>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      Please select 3 or more available windows for your Technical Loop. Timestamps will be calculated in <strong>{currentTimezone.label}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onNavigate('flowchart')}
                      className="px-3.5 py-1.5 bg-[#1668e8] hover:bg-[#1253b8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Select Slots</span>
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
                  {currentUser.role === 'COORDINATOR' ? '+14% this month' : currentUser.role === 'INTERVIEWER' ? 'Target: 14' : 'Stage 2 Active'}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                {currentUser.role === 'COORDINATOR' ? 'Across active job openings' : currentUser.role === 'INTERVIEWER' ? 'This quarter' : 'Staff Systems Role'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl border border-[#eaecf0] shadow-2xs hover:border-[#1668e8] transition-all">
              <div className="flex items-center justify-between text-[#667085]">
                <span className="text-xs font-medium">Schedule Accuracy</span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#101828]">100%</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  0 Overlaps
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                Automated conflict prevention active
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
                <span className="text-2xl font-bold text-[#101828]">Healthy</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  Balanced
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1.5">
                No interviewer exceeding workload limits
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
                  <h3 className="font-bold text-sm text-[#101828]">Today's Scheduled Interviews</h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Times displayed in {currentTimezone.label}
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
                    <div className="w-16 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-semibold shrink-0 text-xs px-1 text-center">
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
                        <span>Turing Hall A</span>
                        <span>•</span>
                        <span>Dr. Sarah Chen</span>
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
                    <div className="w-16 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-semibold shrink-0 text-xs px-1 text-center">
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
                        <span>Lovelace Conf Lab</span>
                        <span>•</span>
                        <span>David Kim</span>
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
                    <div className="w-16 h-10 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex flex-col items-center justify-center font-semibold shrink-0 text-xs px-1 text-center">
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
                        <span>Video Conference</span>
                        <span>•</span>
                        <span>Michael Scott</span>
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
                <h3 className="font-bold text-sm text-[#101828]">Candidate Pipeline Overview</h3>
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

          {/* Right Col: Quick Actions & Operations Diagnostic */}
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
                    <span>Run Auto-Scheduler</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </button>

                <button
                  onClick={() => onNavigate('flowchart')}
                  className="w-full p-2.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1668e8]" />
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
                    <span>Add Candidate</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#98a2b3]" />
                </button>

                <button
                  onClick={() => onNavigate('communications')}
                  className="w-full p-2.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#344054] text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#667085]" />
                    <span>Send Invitations</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#98a2b3]" />
                </button>
              </div>
            </div>

            {/* Automation Health Card */}
            <div className="bg-[#f0f9ff] rounded-xl border border-[#b9e6fe] p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#026aa2]">
                <Cpu className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wide">
                  Scheduling Engine
                </span>
              </div>
              <p className="text-[11px] text-[#026aa2] leading-relaxed">
                Automated constraint verification active. All room capacities, interviewer qualifications, and interview prerequisites are satisfied.
              </p>
              <div className="space-y-1.5 pt-1 text-[11px] text-[#026aa2]">
                <div className="flex justify-between">
                  <span>Engine Status:</span>
                  <span className="font-bold text-emerald-700">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Automated Pass:</span>
                  <span className="font-mono">14 mins ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Calibrated Interviewers:</span>
                  <span className="font-mono">18 available</span>
                </div>
              </div>
            </div>

            {/* Support / Quick Help */}
            <div className="bg-white rounded-xl border border-[#eaecf0] p-4 text-xs text-[#667085] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#98a2b3]" />
                <span>Need assistance?</span>
              </div>
              <button 
                onClick={() => onNavigate('help')}
                className="font-semibold text-[#1668e8] hover:underline"
              >
                Documentation
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
