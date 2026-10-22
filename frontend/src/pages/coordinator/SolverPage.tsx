import React, { useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const SolverPage: React.FC = () => {
  const { loading, schedule, runSolver } = useSchedule();
  const [startDate, setStartDate] = useState('2024-05-18');
  const [endDate, setEndDate] = useState('2024-05-25');

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-[#101828]">CP-SAT Solver Control Center</h1>
        <p className="text-xs text-[#667085] mt-1">Trigger Google OR-Tools constraint optimization for batch candidate scheduling.</p>
      </div>

      <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#344054]">Start Date Horizon</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs mt-1" 
            />
          </div>
          <div>
            <label className="font-semibold text-[#344054]">End Date Horizon</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs mt-1" 
            />
          </div>
        </div>

        <Button 
          variant="primary" 
          disabled={loading}
          onClick={() => runSolver(startDate, endDate)}
        >
          {loading ? 'Solving Constraints (OR-Tools)...' : 'Run CP-SAT Solver'}
        </Button>
      </div>

      {schedule && (
        <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-[#101828]">Solver Run Result (v{schedule.versionNumber})</span>
            <Badge variant="success">{schedule.diagnostics.solverStatus}</Badge>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2 text-[#475467]">
            <div>Variables: <span className="font-bold text-[#101828]">{schedule.diagnostics.variablesCount}</span></div>
            <div>Constraints: <span className="font-bold text-[#101828]">{schedule.diagnostics.constraintsCount}</span></div>
            <div>Latency: <span className="font-bold text-[#101828]">{schedule.diagnostics.solveTimeMs}ms</span></div>
            <div>Conflicts: <span className="font-bold text-[#0b7c3e]">{schedule.diagnostics.conflictsCount}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
