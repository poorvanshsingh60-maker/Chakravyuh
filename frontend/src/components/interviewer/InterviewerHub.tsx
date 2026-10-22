import React, { useState } from 'react';
import { INTERVIEWERS } from '../../mockData';
import { 
  FileEdit, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export const InterviewerHub: React.FC = () => {
  const currentInterviewer = INTERVIEWERS[0]; // Sarah Chen
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scorecard state
  const [ratings, setRatings] = useState({
    problemSolving: 5,
    systemArch: 4,
    communication: 5,
  });
  const [decision, setDecision] = useState<'STRONG_HIRE' | 'HIRE' | 'NO_HIRE'>('STRONG_HIRE');
  const [notes, setNotes] = useState('Alex exhibited exceptional intuition when designing the Raft quorum model under asymmetric network partitions. Recommended for Staff Level placement.');

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDrawerOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentInterviewer.avatar} 
            alt={currentInterviewer.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentInterviewer.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Interviewer
              </span>
            </div>
            <p className="text-xs text-slate-600">{currentInterviewer.role} • {currentInterviewer.team}</p>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Load: {currentInterviewer.interviewsThisWeek} of {currentInterviewer.maxCapWeekly} max weekly sessions assigned
            </p>
          </div>
        </div>

        {/* Load Balance Bar */}
        <div className="w-full md:w-64 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Weekly Quota</span>
            <span className="font-semibold text-slate-900">{Math.round((currentInterviewer.interviewsThisWeek / currentInterviewer.maxCapWeekly) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
          </div>
          <span className="text-[10px] text-slate-400 block text-right font-mono">2 slots remaining</span>
        </div>
      </div>

      {/* Main Grid: Assigned Interviews + Availability Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Assigned Interviews (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
              Your Assigned Interviews Today
            </h3>
            <span className="text-xs text-slate-500 font-mono">Oct 22, 2026</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  NEXT UP // 1:00 PM PST
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  Alex Rivera — Staff Distributed Systems Engineer
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Round 2: Distributed Systems Architecture (60 min)
                </p>
              </div>

              <button 
                onClick={() => setDrawerOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <FileEdit className="w-3.5 h-3.5" />
                Scorecard Form
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block font-mono text-[11px] uppercase">
                Focus Areas Calibrated by CP-SAT Engine:
              </span>
              <p>Verify candidate's grasp on Raft consensus under network partition, LSM tree compaction tradeoffs, and storage engine invariants.</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-mono">Room: Virtual Pod Gamma</span>
              <a 
                href="https://meet.google.com/chk-dist-sys" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline font-semibold font-mono"
              >
                Join Meeting Link →
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Availability Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
            Weekly Availability Windows
          </h3>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              These recurring time windows are fed directly into the Google OR-Tools optimization engine to compute conflict-free rounds.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Monday</span>
                <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">1:00 PM – 4:00 PM PST</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Tuesday</span>
                <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">10:00 AM – 1:00 PM PST</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Thursday (Today)</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">1:00 PM – 5:00 PM PST</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Friday</span>
                <span className="text-slate-400">Unavailable (Focus Day)</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Update Availability Slots
            </button>
          </div>
        </div>

      </div>

      {/* Evaluation Scorecard Slide-Over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                  OFFICIAL EVALUATION SCORECARD
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Alex Rivera — Round 2 Evaluation
                </h3>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-mono text-base"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Scorecard Submitted</h4>
                <p className="text-xs text-slate-500">
                  Your feedback and hiring recommendation have been committed to the hiring loop ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScorecardSubmit} className="space-y-5">
                
                {/* 1. Problem Solving */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">1. Problem Solving & Algorithmic Rigor</span>
                    <span className="font-mono text-blue-600 font-bold">{ratings.problemSolving} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRatings({ ...ratings, problemSolving: val })}
                        className={`flex-1 py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                          ratings.problemSolving === val 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Systems Architecture */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">2. Distributed Systems Architecture</span>
                    <span className="font-mono text-blue-600 font-bold">{ratings.systemArch} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRatings({ ...ratings, systemArch: val })}
                        className={`flex-1 py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                          ratings.systemArch === val 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Final Recommendation Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Final Hiring Recommendation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NO_HIRE', 'HIRE', 'STRONG_HIRE'] as const).map((dec) => (
                      <button
                        type="button"
                        key={dec}
                        onClick={() => setDecision(dec)}
                        className={`py-2 px-2 text-center rounded-lg text-xs font-mono font-bold border transition-all ${
                          decision === dec 
                            ? dec === 'STRONG_HIRE' 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : dec === 'HIRE' 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {dec.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Feedback Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Detailed Qualitative Notes & Tradeoffs
                  </label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 font-sans text-slate-800 focus:outline-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Scorecard
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
