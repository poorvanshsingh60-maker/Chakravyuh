import { 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { INITIAL_DIRECTORY } from '../../data/mockDatabase';

export const MetricsView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <h1 className="text-xl font-bold text-[#101828]">Recruiting Metrics & Utilization</h1>
        <p className="text-xs text-[#667085] mt-1">
          Real-time telemetry on scheduling velocity, interviewer load distribution, and meeting room capacity.
        </p>
      </div>

      <div className="p-8 max-w-6xl space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
              Time to Schedule Loop
            </span>
            <div className="text-2xl font-bold text-[#101828]">1.2 days</div>
            <span className="text-xs text-[#0b7c3e] font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 74% faster than manual
            </span>
          </div>

          <div className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
              Load Balance Variance
            </span>
            <div className="text-2xl font-bold text-[#101828]">±0.4 hrs</div>
            <span className="text-xs text-[#1668e8] font-medium">
              Within CP-SAT soft objective
            </span>
          </div>

          <div className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
              Zero-Conflict Rate
            </span>
            <div className="text-2xl font-bold text-[#101828]">100%</div>
            <span className="text-xs text-[#0b7c3e] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 0 double bookings
            </span>
          </div>

          <div className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
              Active Panel Capacity
            </span>
            <div className="text-2xl font-bold text-[#101828]">23 slots</div>
            <span className="text-xs text-[#475467] font-medium">
              Across 4 qualified interviewers
            </span>
          </div>
        </div>

        {/* Load Balance Chart & Burnout Guard */}
        <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#101828]">
                Interviewer Workload & Fatigue Index
              </h3>
              <p className="text-xs text-[#667085]">
                Weekly allocated interview hours compared against hard burnout limit caps.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1668e8] bg-[#e7f2fe] px-2.5 py-1 rounded-md border border-[#bcd7fd]">
              Optimal Distribution
            </span>
          </div>

          <div className="space-y-4">
            {INITIAL_DIRECTORY.map((int) => {
              const pct = Math.round((int.scheduledThisWeek / int.weeklyCapacity) * 100);
              return (
                <div key={int.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#101828]">{int.name} ({int.team})</span>
                    <span className="text-[#475467] font-medium">
                      {int.scheduledThisWeek} / {int.weeklyCapacity} hrs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f2f4f7] rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-[#1668e8] h-2.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
