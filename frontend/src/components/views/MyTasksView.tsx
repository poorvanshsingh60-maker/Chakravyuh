import React, { useState } from 'react';
import { Task } from '../../types';
import { UserRole } from '../../types/user';
import { 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Check, 
  X,
  Laptop,
  Video,
  FileText
} from 'lucide-react';

interface MyTasksViewProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  currentUser?: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  } | null;
}

interface CandidateChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate: string;
  dueTime: string;
  actionLabel?: string;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({ tasks, onCompleteTask, currentUser }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [activeScorecardTask, setActiveScorecardTask] = useState<Task | null>(null);
  
  // Scorecard modal state (for interviewers)
  const [ratings, setRatings] = useState({ problemSolving: 5, technical: 4, culture: 5 });
  const [recommendation, setRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE'>('STRONG_HIRE');
  const [feedback, setFeedback] = useState('Candidate showed exceptional clarity in interaction design and product trade-offs.');
  const [submittedToast, setSubmittedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Candidate Preparation Tasks
  const [candidateTasks, setCandidateTasks] = useState<CandidateChecklistItem[]>([
    {
      id: 'cand-task-1',
      title: 'Technical Sandbox & Code Editor Setup',
      description: 'Pre-configure VS Code / preferred editor with compiler toolchains (C++, Python, Java) and verified terminal execution.',
      category: 'Environment',
      status: 'COMPLETED',
      dueDate: 'Today',
      dueTime: '9:30 AM'
    },
    {
      id: 'cand-task-2',
      title: 'Hardware & Peripheral Diagnostics',
      description: 'Confirm webcam, external microphone, and screen-sharing permissions are authorized in Google Chrome.',
      category: 'Equipment Check',
      status: 'PENDING',
      dueDate: 'Today',
      dueTime: '9:45 AM',
      actionLabel: 'Test Audio & Video'
    },
    {
      id: 'cand-task-3',
      title: 'Interview Loop Schedule & Timezone Sync',
      description: 'Confirmed 3-round interview loop (DSA Screen, Distributed Systems, Values) synced to your local timezone.',
      category: 'Schedule',
      status: 'COMPLETED',
      dueDate: 'Today',
      dueTime: '10:00 AM'
    },
    {
      id: 'cand-task-4',
      title: 'Upload Portfolio & Resume Artifacts',
      description: 'Verified Marcus_Vance_Resume.pdf and active GitHub project repositories are accessible to evaluating panel.',
      category: 'Documentation',
      status: 'COMPLETED',
      dueDate: 'Completed',
      dueTime: 'Yesterday'
    }
  ]);

  const isCandidate = currentUser?.role === 'CANDIDATE';

  const handleTestEquipment = (itemId: string) => {
    setCandidateTasks(prev => 
      prev.map(item => item.id === itemId ? { ...item, status: 'COMPLETED' } : item)
    );
    showToast('Camera and microphone diagnostic passed! Audio & video feeds verified.');
  };

  const filteredCandidateTasks = candidateTasks.filter(t => {
    if (filter === 'PENDING') return t.status === 'PENDING';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const filteredInterviewerTasks = tasks.filter(t => {
    if (filter === 'PENDING') return t.status === 'PENDING';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const handleSubmitScorecard = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeScorecardTask) {
      onCompleteTask(activeScorecardTask.id);
    }
    setSubmittedToast(true);
    setTimeout(() => {
      setSubmittedToast(false);
      setActiveScorecardTask(null);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">
              {isCandidate ? 'Interview Preparation Checklist' : 'My tasks'}
            </h1>
            <p className="text-xs text-[#667085] mt-1">
              {isCandidate 
                ? 'Complete mandatory technical readiness checks, peripheral testing, and documentation before your rounds.'
                : 'Interviews requiring your scorecard submission, shadow evaluations, and availability sign-offs.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#f2f4f7] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'ALL' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                All ({isCandidate ? candidateTasks.length : tasks.length})
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'PENDING' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                Pending ({isCandidate 
                  ? candidateTasks.filter(t => t.status === 'PENDING').length 
                  : tasks.filter(t => t.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setFilter('COMPLETED')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'COMPLETED' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                Completed ({isCandidate 
                  ? candidateTasks.filter(t => t.status === 'COMPLETED').length 
                  : tasks.filter(t => t.status === 'COMPLETED').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 max-w-5xl space-y-4">
        
        {/* ================================================================= */}
        {/* CANDIDATE CHECKLIST VIEW (STRICTLY NO SCORECARDS)                 */}
        {/* ================================================================= */}
        {isCandidate ? (
          <div className="divide-y divide-[#eaecf0] border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs">
            {filteredCandidateTasks.map((item) => (
              <div 
                key={item.id} 
                className="p-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === 'COMPLETED' 
                      ? 'bg-[#ecfdf3] text-[#0b7c3e]' 
                      : 'bg-[#eff8ff] text-[#175cd3]'
                  }`}>
                    {item.status === 'COMPLETED' ? (
                      <Check className="w-4 h-4" />
                    ) : item.category === 'Equipment Check' ? (
                      <Video className="w-4 h-4" />
                    ) : item.category === 'Environment' ? (
                      <Laptop className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#101828]">{item.title}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#f2f4f7] text-[#475467] border border-[#eaecf0]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#475467] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-[#667085] font-medium">
                    <span className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-[#98a2b3]" />
                      {item.dueDate} • {item.dueTime}
                    </span>
                  </div>

                  {item.status === 'PENDING' && item.actionLabel ? (
                    <button 
                      onClick={() => handleTestEquipment(item.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{item.actionLabel}</span>
                    </button>
                  ) : item.status === 'COMPLETED' ? (
                    <span className="text-xs font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-2.5 py-1 rounded-md border border-[#abefc6] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================================================================= */
          /* INTERVIEWER / COORDINATOR TASKS VIEW                              */
          /* ================================================================= */
          <div className="divide-y divide-[#eaecf0] border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs">
            {filteredInterviewerTasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    task.status === 'COMPLETED' 
                      ? 'bg-[#ecfdf3] text-[#0b7c3e]' 
                      : 'bg-[#e7f2fe] text-[#1668e8]'
                  }`}>
                    {task.status === 'COMPLETED' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <FileEdit className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#101828]">{task.title}</h4>
                      {task.priority === 'HIGH' && task.status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#fef3f2] text-[#d92d20] border border-[#fecdca]">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475467] mt-0.5">
                      Candidate: <span className="font-medium text-[#101828]">{task.candidateName}</span> ({task.role}) • {task.roundName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-[#667085] font-medium">
                    <span className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-[#98a2b3]" />
                      Due: {task.dueDate} {task.dueTime}
                    </span>
                  </div>

                  {task.status === 'PENDING' ? (
                    <button 
                      onClick={() => setActiveScorecardTask(task)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Fill Scorecard</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-2.5 py-1 rounded-md border border-[#abefc6]">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Scorecard Modal (Only for interviewers) */}
      {activeScorecardTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2 py-0.5 rounded border border-[#bcd7fd]">
                  EVALUATION SCORECARD
                </span>
                <h3 className="text-base font-bold text-[#101828] mt-1">
                  {activeScorecardTask.candidateName} — {activeScorecardTask.roundName}
                </h3>
              </div>
              <button 
                onClick={() => setActiveScorecardTask(null)}
                className="text-[#98a2b3] hover:text-[#101828]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedToast ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#0b7c3e] mx-auto" />
                <h4 className="text-base font-bold text-[#101828]">Scorecard Recorded!</h4>
                <p className="text-xs text-[#475467]">
                  Your recommendation has been submitted to the candidate loop ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitScorecard} className="space-y-4 text-xs">
                {/* Rating 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#344054]">
                    <span>Problem Solving & Execution</span>
                    <span className="text-[#1668e8] font-bold">{ratings.problemSolving} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRatings({ ...ratings, problemSolving: val })}
                        className={`flex-1 py-1.5 rounded-lg border font-bold transition-all ${
                          ratings.problemSolving === val
                            ? 'bg-[#1668e8] border-[#1668e8] text-white shadow-xs'
                            : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#344054]">
                    <span>Systems Architecture & Scalability</span>
                    <span className="text-[#1668e8] font-bold">{ratings.technical} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRatings({ ...ratings, technical: val })}
                        className={`flex-1 py-1.5 rounded-lg border font-bold transition-all ${
                          ratings.technical === val
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
                        onClick={() => setRecommendation(rec)}
                        className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                          recommendation === rec
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

                {/* Qualitative Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#344054]">Evaluation Notes & Feedback</label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-white border border-[#d0d5dd] rounded-lg p-2.5 text-xs text-[#344054] focus:outline-none focus:border-[#1668e8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
                  <button
                    type="button"
                    onClick={() => setActiveScorecardTask(null)}
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
            )}
          </div>
        </div>
      )}

    </div>
  );
};
