import React, { useState } from 'react';
import { 
  CURRENT_CANDIDATE, 
  SCHEDULED_INTERVIEWS, 
  INTERVIEWERS, 
  InterviewSlot 
} from '../../mockData';
import { 
  Video, 
  Clock, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  Download,
  X
} from 'lucide-react';

export const CandidatePortal: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot>(SCHEDULED_INTERVIEWS[1]);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const getInterviewer = (id: string) => {
    return INTERVIEWERS.find(i => i.id === id) || INTERVIEWERS[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-md border border-slate-700/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              ORCHESTRATED BY CHAKRAVYUH // ENGINE v2.4
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome to your Engineering Loop, {CURRENT_CANDIDATE.name}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Applying for <span className="text-white font-semibold">{CURRENT_CANDIDATE.role}</span>. 
              We've structured your interviews to be collaborative, realistic, and respect your time. 
              Review your schedule, meeting links, and interviewer briefs below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button 
              onClick={() => setRescheduleModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Request Reschedule
            </button>
            <a 
              href="https://meet.google.com/chk-dist-sys" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Active Room (Round 2)</span>
            </a>
          </div>
        </div>

        {/* Subtle Background Geometric Concentric Motif */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border border-blue-500/10 pointer-events-none"></div>
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-indigo-400/10 pointer-events-none"></div>
      </div>

      {/* Main Grid: Schedule Pipeline + Deep-Dive Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interview Loop Timeline (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Interview Loop Schedule
              </h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                PST (UTC-8)
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              4 of 4 Rounds Calibrated
            </span>
          </div>

          <div className="space-y-3">
            {SCHEDULED_INTERVIEWS.map((slot) => {
              const interviewer = getInterviewer(slot.interviewerId);
              const isSelected = selectedSlot.id === slot.id;
              const isCompleted = slot.status === 'COMPLETED';
              const isInProgress = slot.status === 'IN_PROGRESS';

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                      : 'bg-white hover:bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                            ● In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Round {slot.roundNumber}
                          </span>
                        )}
                        <h3 className="text-sm font-semibold text-slate-900">
                          {slot.roundName}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {slot.date} • {slot.time}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {slot.roomName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={interviewer.avatar} 
                          alt={interviewer.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                        />
                        <div className="hidden sm:block text-right">
                          <p className="text-xs font-semibold text-slate-800">{interviewer.name}</p>
                          <p className="text-[10px] text-slate-500">{interviewer.role}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </div>

                  {/* Skills Tag Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {slot.focusSkills.map((skill, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Candidate Preparation Pack Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white">Engineering Onsite Brief & FAQ</h4>
              </div>
              <p className="text-xs text-slate-400">
                Detailed notes on our system design environment, code execution runners, and compensation philosophy.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              PDF Pack
            </button>
          </div>
        </div>

        {/* Right Column: Active Round Detail & Interviewer Dossier (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Round Detail Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  SELECTED ROUND DOSSIER
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Duration: {selectedSlot.duration}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedSlot.roundName}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {selectedSlot.date} | {selectedSlot.time}
              </p>
            </div>

            {/* Interviewer Profile Card */}
            {(() => {
              const interviewer = getInterviewer(selectedSlot.interviewerId);
              return (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Interviewer Profile
                  </h4>
                  <div className="flex items-center gap-4">
                    <img 
                      src={interviewer.avatar} 
                      alt={interviewer.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{interviewer.name}</h4>
                      <p className="text-xs font-medium text-slate-600">{interviewer.role}</p>
                      <p className="text-[11px] font-mono text-blue-600 mt-0.5">{interviewer.team}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    "{interviewer.bio}"
                  </p>

                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      What to expect in this round
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {interviewer.focusArea}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Target Competencies
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {interviewer.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Quick Action to Enter Room */}
            <div className="pt-4 border-t border-slate-200">
              <a 
                href={selectedSlot.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Video className="w-4 h-4" />
                Launch Virtual Meeting Room
                <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
              </a>
            </div>

          </div>

          {/* Need Assistance Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Need support during your loop?</p>
              <p className="text-slate-500">Your coordinator is on standby. Reach out via email or Slack connect.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Request Schedule Adjustment</h3>
              </div>
              <button 
                onClick={() => setRescheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestSent ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Request Logged with Chakravyuh</h4>
                <p className="text-xs text-slate-500">
                  The CP-SAT engine will compute alternate minimal-churn slots for your panel and send a confirmation to your email.
                </p>
                <button 
                  onClick={() => { setRequestSent(false); setRescheduleModalOpen(false); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Need to move a round? Our combinatorial optimizer will find collision-free slots that match your panel's availability.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Which round requires adjustment?</label>
                  <select className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white font-mono">
                    <option>Round 3: Resilience & Fault Tolerance (2:15 PM)</option>
                    <option>Round 4: Bar Raiser & Values (3:30 PM)</option>
                    <option>Entire Afternoon Block</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Preferred alternate window</label>
                  <input 
                    type="text" 
                    defaultValue="Tomorrow, Oct 23 between 10:00 AM – 3:00 PM PST"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setRescheduleModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setRequestSent(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    Submit to Solver
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
