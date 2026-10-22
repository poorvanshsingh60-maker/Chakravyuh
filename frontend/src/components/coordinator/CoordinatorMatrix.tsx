import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  FileSpreadsheet, 
  RefreshCw, 
  Check, 
  Share2
} from 'lucide-react';

interface CoordinatorMatrixProps {
  onRunSolver: () => void;
  solverRunning: boolean;
}

export const CoordinatorMatrix: React.FC<CoordinatorMatrixProps> = ({ onRunSolver, solverRunning }) => {
  const [selectedVersion, setSelectedVersion] = useState<'v2.4' | 'v2.5'>('v2.5');
  const [isPublished, setIsPublished] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const timeColumns = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const handlePublish = () => {
    setIsPublished(true);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Solver Controls & Telemetry Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Engine Header & Version Selector */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  CP-SAT Combinatorial Schedule Matrix
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Google OR-Tools Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Batch Horizon: Oct 21 – Oct 28, 2026 • 24 Candidates in Pipeline
              </p>
            </div>
          </div>

          {/* Action Buttons: Run Solver, Version Selector, Publish */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Version Select */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-mono">
              <button 
                onClick={() => setSelectedVersion('v2.4')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedVersion === 'v2.4' 
                    ? 'bg-white shadow-xs text-slate-900 font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                v2.4 (Published)
              </button>
              <button 
                onClick={() => setSelectedVersion('v2.5')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedVersion === 'v2.5' 
                    ? 'bg-white shadow-xs text-blue-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                v2.5 (Draft - Optimized)
              </button>
            </div>

            {/* Run Solver Button */}
            <button
              onClick={onRunSolver}
              disabled={solverRunning}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-all ${
                solverRunning
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${solverRunning ? 'animate-spin' : ''}`} />
              <span>{solverRunning ? 'Solving CP-SAT (84ms)...' : 'Re-Run Optimization'}</span>
            </button>

            {/* Publish CTA */}
            <button
              onClick={handlePublish}
              disabled={isPublished}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                isPublished 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPublished ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Schedule Published</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Publish v2.5 Draft</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Solver Diagnostics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SOLVER STATUS</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> OPTIMAL (0 CONFLICTS)
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CONSTRAINTS SATISFIED</span>
            <span className="font-bold text-slate-800 block mt-0.5">
              128 / 128 (100% FEASIBLE)
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ENGINE EXECUTION TIME</span>
            <span className="font-bold text-slate-800 block mt-0.5">
              84.2 ms (Google CP-SAT)
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">OBJECTIVE BALANCE SCORE</span>
            <span className="font-bold text-blue-700 block mt-0.5">
              98.6 / 100 (Min Gaps)
            </span>
          </div>
        </div>

        {publishSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Schedule v2.5 successfully promoted to PUBLISHED. Google Calendar invitations & candidate links have been dispatched.</span>
          </div>
        )}
      </div>

      {/* Multi-Track Resource Schedule Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Matrix Header Toolbar */}
        <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Live Room & Interviewer Resource Timeline
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Thursday, Oct 22, 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-500"></span> Tech Arch
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-500 ml-2"></span> Distributed Sys
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 ml-2"></span> Bar Raiser
            </div>

            <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
              <button className="p-1.5 rounded hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 font-mono">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-mono text-slate-600">
                <th className="p-3 w-48 font-semibold sticky left-0 bg-slate-100/90 z-10 border-r border-slate-200">
                  RESOURCE / POD
                </th>
                {timeColumns.map((col, idx) => (
                  <th key={idx} className="p-3 font-semibold text-center min-w-[130px] border-r border-slate-200/60">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              
              {/* Virtual Pod Alpha */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Virtual Pod Alpha</span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">85% Util</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Google Meet #891-23</span>
                </td>
                <td colSpan={1} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-blue-50 border border-blue-200 text-blue-900 font-mono text-[11px] shadow-2xs">
                    <span className="font-bold block truncate">Alex Rivera</span>
                    <span className="text-[10px] text-blue-700 truncate block">R1: Core Algorithms</span>
                  </div>
                </td>
                <td colSpan={4} className="p-2 border-r border-slate-200/60 bg-slate-50/30 text-center text-[11px] font-mono text-slate-400">
                  -- Available Buffer --
                </td>
                <td colSpan={2} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] shadow-2xs">
                    <span className="font-bold block truncate">Alex Rivera</span>
                    <span className="text-[10px] text-emerald-700 truncate block">R4: Bar Raiser (Marcus)</span>
                  </div>
                </td>
                <td className="p-2"></td>
              </tr>

              {/* Virtual Pod Gamma */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Virtual Pod Gamma</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">70% Util</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Google Meet #441-92</span>
                </td>
                <td colSpan={3} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">
                    <span className="font-bold block truncate">Maya Lin (Frontend Loop)</span>
                    <span className="text-[10px] text-slate-500">R2: State Architecture</span>
                  </div>
                </td>
                <td colSpan={2} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-[11px] shadow-2xs">
                    <span className="font-bold block truncate">Alex Rivera</span>
                    <span className="text-[10px] text-indigo-700 truncate block">R2: Distributed Arch (Sarah)</span>
                  </div>
                </td>
                <td colSpan={3} className="p-2 border-r border-slate-200/60 text-center text-[11px] font-mono text-slate-400">
                  -- Clean Buffer --
                </td>
              </tr>

              {/* Virtual Pod Delta */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Virtual Pod Delta</span>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">60% Util</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Google Meet #110-84</span>
                </td>
                <td colSpan={4} className="p-2 border-r border-slate-200/60"></td>
                <td colSpan={2} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-purple-50 border border-purple-200 text-purple-900 font-mono text-[11px] shadow-2xs">
                    <span className="font-bold block truncate">Alex Rivera</span>
                    <span className="text-[10px] text-purple-700 truncate block">R3: Fault Tolerance (David)</span>
                  </div>
                </td>
                <td colSpan={2} className="p-2"></td>
              </tr>

              {/* Physical Suite 402 */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Executive Suite 402</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">SF Floor 4</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Physical Boardroom</span>
                </td>
                <td colSpan={2} className="p-2 border-r border-slate-200/60">
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px]">
                    <span className="font-bold block truncate">VP Eng Interview</span>
                    <span className="text-[10px] text-amber-700">Executive calibration</span>
                  </div>
                </td>
                <td colSpan={6} className="p-2 text-center text-[11px] font-mono text-slate-400">
                  -- Clean Buffer --
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Matrix Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>* Minimum buffer time between rounds: 15 minutes strictly enforced by hard constraint CP-SAT solver.</span>
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Download Solver Constraint Model (.pb)</span>
        </div>

      </div>

    </div>
  );
};
