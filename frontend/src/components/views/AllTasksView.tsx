import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { Search, CheckCircle2, Check, Calendar } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCoordination } from '../../context/CoordinationContext';

interface AllTasksViewProps {
  tasks: Task[];
  onCompleteTask?: (taskId: string) => void;
  onSelectTaskToSchedule?: () => void;
}

export const AllTasksView: React.FC<AllTasksViewProps> = ({ 
  tasks, 
  onCompleteTask, 
  onSelectTaskToSchedule 
}) => {
  const { nudgeInterviewer } = useCoordination();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const filtered = taskList.filter(t => {
    const matchesSearch = t.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.interviewerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSendReminder = (task: Task) => {
    nudgeInterviewer();
    setReminderToast(`Automated reminder & high-priority nudge dispatched to ${task.interviewerName} for ${task.roundName}!`);
    setTimeout(() => setReminderToast(null), 4000);
    setSelectedTask(null);
  };

  const handleMarkResolved = (taskId: string) => {
    const target = taskList.find(t => t.id === taskId);
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
    if (onCompleteTask) {
      onCompleteTask(taskId);
    }
    setReminderToast(`Task "${target?.title || 'Selected item'}" marked resolved!`);
    setTimeout(() => setReminderToast(null), 4000);
    setSelectedTask(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Header with Direct Link to Automate Schedule */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#101828]">Tasks & Approvals</h1>
          <p className="text-xs text-[#667085] mt-1">
            System-wide queue of coordinator actions, pending feedback loops, and scheduling conflicts.
          </p>
        </div>

        {onSelectTaskToSchedule && (
          <button
            onClick={onSelectTaskToSchedule}
            className="px-4 py-2 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Go to Automate Schedule →</span>
          </button>
        )}
      </div>

      {reminderToast && (
        <div className="mx-8 mt-4 p-3.5 rounded-2xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#0b7c3e]" />
          <span>{reminderToast}</span>
        </div>
      )}

      <div className="p-8 max-w-5xl space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#98a2b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by candidate, interviewer, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fa] hover:bg-[#f2f4f7] focus:bg-white border border-[#d0d5dd] focus:border-[#1668e8] rounded-full pl-9 pr-4 py-2 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium bg-[#f2f4f7] p-1 rounded-full">
            {['ALL', 'SCORECARD', 'SHADOW_REVIEW', 'RESCHEDULE'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  typeFilter === t ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="border border-[#eaecf0] rounded-2xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#eaecf0] text-[#475467] font-semibold">
                <th className="p-3.5 pl-6">Task Description</th>
                <th className="p-3.5">Candidate & Role</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5">Due Window</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {filtered.map((task) => (
                <tr key={task.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3.5 pl-6 font-semibold text-[#101828]">
                    {task.title}
                  </td>
                  <td className="p-3.5 text-[#475467]">
                    <div className="font-medium text-[#101828]">{task.candidateName}</div>
                    <div className="text-[11px] text-[#667085]">{task.role}</div>
                  </td>
                  <td className="p-3.5 text-[#344054] font-medium">
                    {task.interviewerName}
                  </td>
                  <td className="p-3.5 text-[#667085] font-medium">
                    {task.dueDate} {task.dueTime}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      task.status === 'COMPLETED'
                        ? 'bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6]'
                        : 'bg-[#fffaeb] text-[#b54708] border border-[#fedf89]'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-6 text-right space-x-2">
                    {task.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-3 py-1 rounded-full border border-[#abefc6]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        {onSelectTaskToSchedule && (
                          <button 
                            onClick={onSelectTaskToSchedule}
                            className="px-3.5 py-1.5 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold text-xs shadow-2xs transition-colors inline-flex items-center gap-1"
                          >
                            <span>Go to Automate Schedule →</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedTask(task)}
                          className="px-3 py-1.5 rounded-full border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-medium text-xs shadow-2xs transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Task Inspection Dialog */}
      {selectedTask && (
        <Dialog
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={`Task: ${selectedTask.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#f9fafb] rounded-xl border border-[#eaecf0] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#101828]">{selectedTask.candidateName}</h3>
                  <p className="text-xs text-[#667085]">{selectedTask.role}</p>
                </div>
                <Badge variant={selectedTask.priority === 'HIGH' ? 'warning' : 'neutral'}>
                  {selectedTask.priority} Priority
                </Badge>
              </div>

              <div className="pt-2 border-t border-[#eaecf0] space-y-1 text-[#344054]">
                <p><strong>Associated Round:</strong> {selectedTask.roundName}</p>
                <p><strong>Assigned Evaluator:</strong> {selectedTask.interviewerName}</p>
                <p><strong>Due Window:</strong> {selectedTask.dueDate} at {selectedTask.dueTime}</p>
                <p><strong>Current Status:</strong> {selectedTask.status}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="primary"
                onClick={() => handleSendReminder(selectedTask)}
                className="flex items-center gap-1.5 font-bold"
              >
                <span>Send Slack / Email Ping</span>
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
                {selectedTask.status !== 'COMPLETED' && onSelectTaskToSchedule && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedTask(null);
                      onSelectTaskToSchedule();
                    }}
                    className="bg-[#1668e8] hover:bg-[#145ac7] text-white font-bold flex items-center gap-1.5"
                  >
                    <span>Go to Automate Schedule →</span>
                  </Button>
                )}
                {selectedTask.status !== 'COMPLETED' && (
                  <Button
                    variant="primary"
                    onClick={() => handleMarkResolved(selectedTask.id)}
                    className="bg-[#0b7c3e] hover:bg-[#096a34] text-white font-bold"
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}

    </div>
  );
};
