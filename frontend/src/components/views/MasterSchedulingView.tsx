import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { CoordinatorWorkspace } from '../coordinator/CoordinatorWorkspace';
import { AutomateSchedulingView } from './AutomateSchedulingView';
import { CandidateItem } from '../../types';

interface MasterSchedulingViewProps {
  onGoToCommunications: () => void;
  candidateName?: string;
  roleName?: string;
  activeCandidate?: CandidateItem | null;
  onSimulateCandidate?: (candidateId: string) => void;
  defaultSubTab?: 'master-matrix' | 'loop-optimizer';
}

export const MasterSchedulingView: React.FC<MasterSchedulingViewProps> = ({
  onGoToCommunications,
  candidateName = 'Marcus Vance',
  roleName = '20224012 (CSE) — Google SDE',
  activeCandidate,
  onSimulateCandidate,
  defaultSubTab = 'master-matrix'
}) => {
  const [subTab, setSubTab] = useState<'master-matrix' | 'loop-optimizer'>(() => {
    if (activeCandidate) return 'loop-optimizer';
    return defaultSubTab;
  });

  const effectiveCandidateName = activeCandidate?.name || candidateName;
  const effectiveRoleName = activeCandidate?.role || roleName;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-[#f8f9fa] scroll-smooth">
      {/* Top Unified Sub-Navigation Bar - Sticky & Frosted */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#eaecf0] bg-white/95 backdrop-blur-md px-6 py-2.5 shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-[#f2f4f7] p-1 rounded-full border border-[#eaecf0]">
          <button
            type="button"
            onClick={() => setSubTab('master-matrix')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'master-matrix'
                ? 'bg-white text-[#101828] shadow-2xs font-bold'
                : 'text-[#667085] hover:text-[#344054]'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${subTab === 'master-matrix' ? 'text-[#1668e8]' : 'text-[#667085]'}`} />
            <span>Master Grid & CP-SAT Solver</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('loop-optimizer')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'loop-optimizer'
                ? 'bg-white text-[#101828] shadow-2xs font-bold'
                : 'text-[#667085] hover:text-[#344054]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${subTab === 'loop-optimizer' ? 'text-[#1668e8]' : 'text-[#667085]'}`} />
            <span>Candidate Loop Optimizer</span>
            {activeCandidate && (
              <span className="text-[10px] bg-[#eff8ff] text-[#175cd3] px-2 py-0.5 rounded-full font-medium ml-1">
                {activeCandidate.name}
              </span>
            )}
          </button>
        </div>

        <div className="text-[11px] text-[#667085] font-medium hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Google OR-Tools CP-SAT Active
          </span>
          <span className="text-[#d0d5dd]">|</span>
          <span>Zero-Collision Multi-Room Matrix</span>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 flex flex-col">
        {subTab === 'master-matrix' ? (
          <CoordinatorWorkspace onSimulateCandidate={onSimulateCandidate} />
        ) : (
          <AutomateSchedulingView 
            onGoToCommunications={onGoToCommunications}
            candidateName={effectiveCandidateName}
            roleName={effectiveRoleName}
          />
        )}
      </div>
    </div>
  );
};
