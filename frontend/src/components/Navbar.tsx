import React from 'react';
import { ChakravyuhLogo } from './ChakravyuhLogo';
import { 
  Calendar, 
  Layers, 
  UserCheck, 
  BarChart3 
} from 'lucide-react';

export type ActiveTab = 'candidate' | 'coordinator' | 'interviewer' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  solverRunning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, solverRunning = false }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <ChakravyuhLogo size={26} />

            <div className="hidden md:flex items-center text-xs text-slate-400 font-mono pl-4 border-l border-slate-200">
              <span className="text-slate-500 font-semibold text-[13px]">Stripe</span>
              <span className="mx-1.5">/</span>
              <span>Eng Hiring Loop</span>
            </div>
          </div>

          {/* Center: Persona / Perspective View Selector */}
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'candidate'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Portal</span>
              <span className="px-1.5 py-0.2 bg-blue-100/80 text-blue-700 text-[10px] font-mono rounded">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coordinator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'coordinator'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Coordinator Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('interviewer')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'interviewer'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interviewer Rubric</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Load Analytics</span>
            </button>
          </nav>

          {/* Right: Real-time Solver Telemetry & User */}
          <div className="flex items-center gap-3">
            {/* Live Solver Badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono border border-slate-800 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  solverRunning ? 'bg-amber-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  solverRunning ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </span>
              <span className="text-slate-300">
                {solverRunning ? 'CP-SAT: SOLVING...' : 'CP-SAT: OPTIMAL (0 CONFLICTS)'}
              </span>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xs border border-slate-700">
                AR
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-none">
                  {activeTab === 'candidate' ? 'Alex Rivera (Candidate)' : 'Admin / Coordinator'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 leading-tight mt-0.5">
                  {activeTab === 'candidate' ? 'Staff Candidate' : 'Level 7 Coordinator'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
