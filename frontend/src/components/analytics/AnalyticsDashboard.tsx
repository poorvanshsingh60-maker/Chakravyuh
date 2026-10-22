import React from 'react';
import { INTERVIEWERS, ROOMS } from '../../mockData';
import { 
  Flame, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>PIPELINE HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">100%</p>
          <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Zero constraint violations
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>AVG SOLVE LATENCY</span>
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">84.2 ms</p>
          <p className="text-[11px] text-slate-500 font-mono">
            Google OR-Tools CP-SAT
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>INTERVIEWER LOAD FAIRNESS</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">±0.4 hrs</p>
          <p className="text-[11px] text-blue-600 font-mono">
            Balanced within soft constraints
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>SCHEDULE TURNOVER</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">96.8%</p>
          <p className="text-[11px] text-slate-500 font-mono">
            Stability rate on rescheduling
          </p>
        </div>
      </div>

      {/* Main Charts: Interviewer Workload + Room Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interviewer Workload Distribution (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
                Interviewer Workload & Burnout Guard
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active interviews this week vs. hard weekly capacity caps
              </p>
            </div>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              Optimal Variance
            </span>
          </div>

          <div className="space-y-4">
            {INTERVIEWERS.map((int) => {
              const percentage = Math.round((int.interviewsThisWeek / int.maxCapWeekly) * 100);
              const isOverloaded = percentage >= 85;

              return (
                <div key={int.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800">{int.name} ({int.role})</span>
                    <span className="text-slate-500">
                      {int.interviewsThisWeek} / {int.maxCapWeekly} hrs ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                    <div 
                      className={`h-2.5 rounded-full transition-all ${
                        isOverloaded ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
            * The Chakravyuh CP-SAT soft objective function automatically penalizes standard deviation &gt; 1.0 hr between panel members.
          </div>
        </div>

        {/* Room Utilization (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
                Room & Pod Occupancy
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Utilization rate across virtual links & physical pods
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {ROOMS.map((room) => (
              <div key={room.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800">{room.name}</span>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {room.utilizationRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full" 
                    style={{ width: `${room.utilizationRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Type: {room.type}</span>
                  <span>Cap: {room.capacity} seats</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
