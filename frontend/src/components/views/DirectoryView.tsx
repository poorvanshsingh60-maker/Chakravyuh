import React, { useState } from 'react';
import { InterviewerDirectoryItem } from '../../types';
import { Search, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { AvatarBadge } from '../common/AvatarBadge';


interface DirectoryViewProps {
  interviewers: InterviewerDirectoryItem[];
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ interviewers }) => {
  const [directoryList, setDirectoryList] = useState<InterviewerDirectoryItem[]>(interviewers);
  const [search, setSearch] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState<InterviewerDirectoryItem | null>(null);
  const [addInterviewerModalOpen, setAddInterviewerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Interviewer Form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Senior Software Engineer');
  const [newTeam, setNewTeam] = useState('Core Experience');
  const [newSkills, setNewSkills] = useState('System Design, Python, Algorithms');
  const [newCapacity, setNewCapacity] = useState('6');

  const filtered = directoryList.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase()) ||
    i.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateInterviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: InterviewerDirectoryItem = {
      id: `int-${Date.now()}`,
      name: newName,
      avatar: '',
      role: newRole,
      team: newTeam,
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      weeklyCapacity: parseInt(newCapacity, 10) || 6,
      scheduledThisWeek: 0,
      trainingLevel: 'Level 1 (Qualified)',
      status: 'ACTIVE'
    };

    setDirectoryList([newItem, ...directoryList]);
    setAddInterviewerModalOpen(false);
    setNewName('');
    setToastMessage(`Interviewer ${newItem.name} onboarded into active CP-SAT pool!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#eaecf0] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">Interviewer Directory</h1>
            <p className="text-xs text-[#667085] mt-1">
              Calibrated interviewer pool, qualified competencies, and weekly capacity thresholds.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setAddInterviewerModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Interviewer</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="mx-8 mt-4 p-3.5 rounded-xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#0b7c3e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-6 max-w-6xl w-full space-y-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none focus:border-[#1668e8]"
          />
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedInterviewer(item)}
              className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4 hover:border-[#1668e8]/50 hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={item.name} size="md" />
                  <div>
                    <h3 className="font-bold text-sm text-[#101828]">{item.name}</h3>
                    <p className="text-xs text-[#475467]">{item.role}</p>
                    <p className="text-[11px] text-[#667085]">{item.team}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border inline-block ${
                    item.status === 'ACTIVE' 
                      ? 'bg-[#ecfdf3] text-[#0b7c3e] border-[#abefc6]' 
                      : 'bg-[#fffaeb] text-[#b54708] border-[#fedf89]'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-[#667085] block font-medium">
                    {item.trainingLevel}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#98a2b3] tracking-wider block">
                  Calibrated Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f7] text-[#344054] font-medium border border-[#eaecf0]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="pt-2 border-t border-[#f2f4f7] space-y-1">
                <div className="flex justify-between text-xs text-[#475467] font-medium">
                  <span>Weekly Interview Load</span>
                  <span>{item.scheduledThisWeek} of {item.weeklyCapacity} slots</span>
                </div>
                <div className="w-full bg-[#f2f4f7] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#1668e8] h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (item.scheduledThisWeek / item.weeklyCapacity) * 100)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Modal: Interviewer Profile Inspection */}
      {selectedInterviewer && (
        <Dialog
          isOpen={!!selectedInterviewer}
          onClose={() => setSelectedInterviewer(null)}
          title={`Interviewer Profile: ${selectedInterviewer.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#eaecf0] space-y-3">
              <div className="flex items-center gap-3">
                <AvatarBadge name={selectedInterviewer.name} size="lg" />
                <div>
                  <h3 className="font-bold text-sm text-[#101828]">{selectedInterviewer.name}</h3>
                  <p className="text-xs text-[#667085]">{selectedInterviewer.role} • {selectedInterviewer.team}</p>
                  <span className="text-[11px] font-mono font-semibold text-[#1668e8]">
                    {selectedInterviewer.trainingLevel}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eaecf0] space-y-2 text-[#344054]">
                <div className="flex justify-between">
                  <span className="font-semibold">Weekly Burnout Threshold:</span>
                  <span className="font-mono">{selectedInterviewer.scheduledThisWeek} / {selectedInterviewer.weeklyCapacity} sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Calendar Sync:</span>
                  <span className="text-[#0b7c3e] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Google Calendar Live Sync OK
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#101828]">Qualified Skills & Rubric Modules</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedInterviewer.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#e7f2fe] text-[#1668e8] font-medium border border-[#bcd7fd]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedInterviewer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal: Add Interviewer */}
      {addInterviewerModalOpen && (
        <Dialog
          isOpen={addInterviewerModalOpen}
          onClose={() => setAddInterviewerModalOpen(false)}
          title="Onboard Interviewer into Pool"
        >
          <form onSubmit={handleCreateInterviewer} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Elena Rostova"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Engineering Role</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Team / Department</label>
              <select
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828]"
              >
                <option>Core Experience</option>
                <option>Storage Infrastructure</option>
                <option>Platform Reliability</option>
                <option>Growth & Monetization</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Calibrated Skills (Comma separated)</label>
              <input
                type="text"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Weekly Capacity Cap (Sessions)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setAddInterviewerModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Add to Pool
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};
