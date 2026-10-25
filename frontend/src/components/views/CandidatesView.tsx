import React, { useState } from 'react';
import { CandidateItem } from '../../types';
import { 
  Search, 
  Plus, 
  CheckCircle2,
  X 
} from 'lucide-react';
import { AvatarBadge } from '../common/AvatarBadge';

import { useCoordination } from '../../context/CoordinationContext';

interface CandidatesViewProps {
  candidates: CandidateItem[];
  onScheduleCandidate: (candidate: CandidateItem) => void;
  onAddCandidate: (newCandidate: CandidateItem) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({ 
  candidates, 
  onScheduleCandidate,
  onAddCandidate 
}) => {
  const { createAndSendAssignment } = useCoordination();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New candidate form
  const [name, setName] = useState('');
  const [role, setRole] = useState('Product Designer');
  const [email, setEmail] = useState('');

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.role.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === 'ALL' || c.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCandidate({
      id: `cand-${Date.now()}`,
      name,
      role,
      stage: 'Technical Loop',
      appliedDate: 'Just now',
      recruiter: 'Sarah Jenkins',
      status: 'NEEDS_SCHEDULING'
    });

    createAndSendAssignment({
      candidateName: name,
      role,
      roundName: 'Round 1: Problem Solving & DSA Screen',
      interviewerName: 'Dr. Sarah Chen',
      pstTimeSlot: '11:00 AM – 11:45 AM PST',
      roomName: 'Virtual Pod Alpha',
      notes: 'Evaluate coding, algorithmic complexity, and communication'
    });

    setName('');
    setEmail('');
    setModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#eaecf0] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#101828]">Candidates</h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Active candidate pipeline across technical loops, portfolio screens, and executive calibrators.
            </p>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 max-w-6xl w-full space-y-4">
        
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-[#98a2b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search candidates or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f8f9fa] hover:bg-[#f2f4f7] focus:bg-white border border-[#d0d5dd] focus:border-[#1668e8] rounded-full pl-9 pr-4 py-2 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center bg-[#f2f4f7] p-1 rounded-full text-xs font-medium">
              {['ALL', 'Technical Loop', 'Recruiter Screen', 'Executive Review'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className={`px-3.5 py-1 rounded-full transition-all ${
                    filterStage === s ? 'bg-white text-[#101828] shadow-2xs font-semibold' : 'text-[#667085]'
                  }`}
                >
                  {s === 'ALL' ? 'All Stages' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#eaecf0] rounded-2xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#eaecf0] text-[#475467] font-semibold">
                <th className="p-3.5 pl-6">Candidate</th>
                <th className="p-3.5">Target Role</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Lead Recruiter</th>
                <th className="p-3.5">Schedule Status</th>
                <th className="p-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {filtered.map((cand) => (
                <tr key={cand.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      <AvatarBadge name={cand.name} size="sm" />
                      <div>
                        <span className="font-semibold text-sm text-[#101828] block">{cand.name}</span>
                        <span className="text-[11px] text-[#667085]">Applied {cand.appliedDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-[#101828]">{cand.role}</td>
                  <td className="p-3.5 text-[#475467]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f2f4f7] font-medium text-[#344054] border border-[#eaecf0]">
                      {cand.stage}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#475467]">{cand.recruiter}</td>
                  <td className="p-3.5">
                    {cand.status === 'SCHEDULED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-2.5 py-0.5 rounded-full border border-[#abefc6]">
                        <CheckCircle2 className="w-3 h-3 text-[#0b7c3e]" />
                        {cand.scheduledDate || 'Scheduled'}
                      </span>
                    ) : cand.status === 'NEEDS_SCHEDULING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b54708] bg-[#fffaeb] px-2.5 py-0.5 rounded-full border border-[#fedf89]">
                        Needs Scheduling
                      </span>
                    ) : (
                      <span className="inline-flex text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2.5 py-0.5 rounded-full border border-[#bcd7fd]">
                        Decision Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <button 
                      onClick={() => onScheduleCandidate(cand)}
                      className="px-3.5 py-1.5 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs transition-colors"
                    >
                      Schedule Loop
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#667085]">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-sm text-[#344054]">No candidates in pipeline</p>
                      <p className="text-xs">Add your first candidate to start scheduling interview loops with evaluators.</p>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1668e8] text-white text-xs font-semibold shadow-2xs hover:bg-[#145ac7] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Candidate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Candidate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <h3 className="text-base font-bold text-[#101828]">Add Candidate to Pipeline</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Email</label>
                <input 
                  type="email" 
                  placeholder="jordan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Target Position</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] bg-white"
                >
                  <option>Product Designer</option>
                  <option>Staff Distributed Systems Engineer</option>
                  <option>Senior Frontend Engineer</option>
                  <option>Lead Security Engineer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] font-medium hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs"
                >
                  Create & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
