import React, { useState } from 'react';
import { Task } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Send, 
  Check
} from 'lucide-react';

interface MyTasksViewProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({ tasks, onCompleteTask }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');
  const [activeScorecardTask, setActiveScorecardTask] = useState<Task | null>(null);
  
  // Scorecard modal state
  const [ratings, setRatings] = useState({ problemSolving: 5, technical: 4, culture: 5 });
  const [recommendation, setRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE'>('STRONG_HIRE');
  const [feedback, setFeedback] = useState('Candidate showed exceptional clarity in interaction design and product trade-offs.');
  const [submittedToast, setSubmittedToast] = useState(false);

  const filteredTasks = tasks.filter(t => {
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
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">My tasks</h1>
            <p className="text-xs text-[#667085] mt-1">
              Interviews requiring your scorecard submission, shadow evaluations, and availability sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#f2f4f7] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'PENDING' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                Pending ({tasks.filter(t => t.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setFilter('COMPLETED')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'COMPLETED' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                Completed ({tasks.filter(t => t.status === 'COMPLETED').length})
              </button>
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filter === 'ALL' ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-8 max-w-5xl space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-[#fafafa] rounded-xl border border-dashed border-[#d0d5dd]">
            <CheckCircle2 className="w-10 h-10 text-[#0b7c3e] mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-[#101828]">All clear!</h3>
            <p className="text-xs text-[#667085]">You have no tasks matching this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eaecf0] border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-2xs">
            {filteredTasks.map((task) => (
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

      {/* Interactive Scorecard Modal */}
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
                className="text-[#98a2b3] hover:text-[#101828] text-sm"
              >
                ✕
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
                        className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                          ratings.problemSolving === val 
                            ? 'bg-[#1668e8] text-white border-[#1668e8]' 
                            : 'bg-[#fafafa] text-[#344054] border-[#d0d5dd] hover:bg-[#f2f4f7]'
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
                    <span>Domain Mastery & Technical Depth</span>
                    <span className="text-[#1668e8] font-bold">{ratings.technical} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRatings({ ...ratings, technical: val })}
                        className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                          ratings.technical === val 
                            ? 'bg-[#1668e8] text-white border-[#1668e8]' 
                            : 'bg-[#fafafa] text-[#344054] border-[#d0d5dd] hover:bg-[#f2f4f7]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#344054] block">
                    Final Hiring Recommendation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NO_HIRE', 'HIRE', 'STRONG_HIRE'] as const).map((rec) => (
                      <button
                        type="button"
                        key={rec}
                        onClick={() => setRecommendation(rec)}
                        className={`py-2 text-center rounded-lg font-bold border transition-all ${
                          recommendation === rec 
                            ? rec === 'STRONG_HIRE' 
                              ? 'bg-[#0b7c3e] text-white border-[#0b7c3e]' 
                              : rec === 'HIRE' 
                              ? 'bg-[#1668e8] text-white border-[#1668e8]' 
                              : 'bg-[#d92d20] text-white border-[#d92d20]'
                            : 'bg-[#fafafa] text-[#344054] border-[#d0d5dd] hover:bg-[#f2f4f7]'
                        }`}
                      >
                        {rec.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#344054] block">Detailed Evaluation Notes</label>
                  <textarea 
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full border border-[#d0d5dd] rounded-lg p-2.5 text-xs text-[#344054] focus:outline-none focus:border-[#1668e8]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setActiveScorecardTask(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] font-medium hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Scorecard</span>
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
