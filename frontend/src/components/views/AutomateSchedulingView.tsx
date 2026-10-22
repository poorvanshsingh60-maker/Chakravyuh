import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  MessageSquare, 
  Menu, 
  Maximize2, 
  Check, 
  Calendar as CalendarIcon,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface AutomateSchedulingViewProps {
  onGoToCommunications: () => void;
  candidateName?: string;
  roleName?: string;
}

export const AutomateSchedulingView: React.FC<AutomateSchedulingViewProps> = ({ 
  onGoToCommunications,
  candidateName = 'Zach Buechler',
  roleName = 'Product Design Onsite'
}) => {
  const [scheduleApplied, setScheduleApplied] = useState(false);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C'>('A');

  // New interview modal
  const [newRoundTitle, setNewRoundTitle] = useState('');
  const [newRoundInterviewer, setNewRoundInterviewer] = useState('Claire Pritchett');
  const [newRoundTime, setNewRoundTime] = useState('11:00 AM – 12:00 PM PST');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="px-8 pt-6 pb-2 border-b border-[#eaecf0] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#101828]">
            Scheduled <span className="font-bold">{candidateName}</span> for <span className="font-bold">{roleName}</span>
          </h1>

          {/* Timezone Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb] cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-[#667085]" />
            <span>Pacific Standard Time</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085] ml-1" />
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button className="flex items-center gap-1.5 pb-3 text-[#1668e8] border-b-2 border-[#1668e8] font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>Find a schedule</span>
            <span className="text-[#98a2b3] ml-1">&gt;</span>
          </button>
          <button 
            onClick={onGoToCommunications}
            className="flex items-center gap-1.5 pb-3 text-[#667085] hover:text-[#101828] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-8 py-3.5 flex items-center justify-between border-b border-[#f2f4f7] bg-white">
        <button 
          onClick={() => setOptionsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb] shadow-2xs transition-colors"
        >
          <Menu className="w-3.5 h-3.5 text-[#667085]" />
          <span>All schedule options</span>
          <span className="text-[10px] bg-[#e7f2fe] text-[#1668e8] px-1.5 py-0.2 rounded font-bold">3 found</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb] transition-colors"
          >
            Add interview
          </button>
          <button 
            onClick={() => setScheduleApplied(true)}
            className="px-5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            {scheduleApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Schedule Applied</span>
              </>
            ) : (
              <span>Use Schedule</span>
            )}
          </button>
        </div>
      </div>

      {scheduleApplied && (
        <div className="mx-8 mt-4 p-3 rounded-lg bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Schedule confirmed & locked into CP-SAT calendar for {candidateName}.
          </span>
          <button 
            onClick={onGoToCommunications}
            className="underline hover:text-[#085a2d]"
          >
            Proceed to Candidate Communications →
          </button>
        </div>
      )}

      {/* Date Bar */}
      <div className="px-8 py-3 flex items-center justify-between border-b border-[#eaecf0] bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#101828]">May 18, 2024</span>
          {selectedOption === 'A' && (
            <span className="text-[11px] font-medium bg-[#ecfdf3] text-[#0b7c3e] px-2 py-0.2 rounded border border-[#abefc6]">
              Option A: Zero idle gaps
            </span>
          )}
          {selectedOption === 'B' && (
            <span className="text-[11px] font-medium bg-[#e7f2fe] text-[#1668e8] px-2 py-0.2 rounded border border-[#bcd7fd]">
              Option B: Afternoon Block
            </span>
          )}
        </div>
        <button className="text-[#667085] hover:text-[#101828]">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Matrix View */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[980px]">
          
          {/* Column Headers */}
          <div className="grid grid-cols-12 border-b border-[#eaecf0] bg-white sticky top-0 z-10 text-xs">
            
            {/* Candidate Schedule Column */}
            <div className="col-span-3 p-3.5 border-r border-[#eaecf0] flex items-center gap-2 text-[#344054] font-medium">
              <CalendarIcon className="w-4 h-4 text-[#667085]" />
              <span className="font-semibold text-[13px] text-[#101828]">Candidate schedule</span>
            </div>

            {/* Claire Pritchett */}
            <div className="col-span-3 p-3 border-r border-[#eaecf0]">
              <div className="flex items-center gap-2.5 mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" 
                  alt="Claire"
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#101828] leading-tight">Claire Pritchett</h4>
                  <p className="text-[11px] text-[#667085]">Interviewer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#475467] font-medium pt-1 border-t border-[#f2f4f7]">
                <span>📅 0h</span>
                <span>📋 2</span>
                <span>📌 2</span>
              </div>
            </div>

            {/* Phil Dunphy */}
            <div className="col-span-3 p-3 border-r border-[#eaecf0]">
              <div className="flex items-center gap-2.5 mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="Phil"
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#101828] leading-tight">Phil Dunphy</h4>
                  <p className="text-[11px] text-[#667085]">Interviewer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#475467] font-medium pt-1 border-t border-[#f2f4f7]">
                <span>📅 0h</span>
                <span>📋 3</span>
                <span>📌 0</span>
              </div>
            </div>

            {/* Manny Delgado */}
            <div className="col-span-3 p-3">
              <div className="flex items-center gap-2.5 mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                  alt="Manny"
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#101828] leading-tight">Manny Delgado</h4>
                  <p className="text-[11px] text-[#667085]">Interviewer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#475467] font-medium pt-1 border-t border-[#f2f4f7]">
                <span>📅 0h</span>
                <span>📋 0</span>
                <span>📌 0</span>
              </div>
            </div>

          </div>

          {/* Time Rows Grid */}
          <div className="relative text-xs select-none">
            
            {/* 8:00 AM Row */}
            <div className="grid grid-cols-12 min-h-[70px] border-b border-[#f2f4f7]">
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0] text-[#667085] font-medium">
                8 am
              </div>
              <div className="col-span-3 p-1.5 border-r border-[#eaecf0]"></div>
              <div className="col-span-3 p-1.5 border-r border-[#eaecf0]">
                <div className="w-full h-full bg-[#f2f4f7] rounded-lg"></div>
              </div>
              <div className="col-span-3 p-1.5">
                <div className="w-full h-8 bg-[#f2f4f7] rounded-lg"></div>
              </div>
            </div>

            {/* 9:00 AM Row (Active Interviews) */}
            <div className="grid grid-cols-12 min-h-[140px] border-b border-[#eaecf0]">
              
              {/* Candidate Column */}
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0] space-y-1.5">
                <span className="text-[#667085] font-medium block">9 am</span>
                
                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Design Exercise 1</p>
                  <p className="text-[11px] opacity-90 mt-0.5">9-9:30 am PST</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Company Values</p>
                  <p className="text-[11px] opacity-90 mt-0.5">9:30-10 am PST</p>
                </div>
              </div>

              {/* Claire's Column: Design Exercise 1 */}
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0] space-y-1.5">
                <div className="h-6"></div>
                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Design Exercise 1</p>
                  <p className="text-[11px] opacity-90 mt-0.5">9-9:30 am PST</p>
                </div>
                <div className="h-10 bg-[#f2f4f7] rounded-lg"></div>
              </div>

              {/* Phil's Column: Company Values */}
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0] space-y-1.5">
                <div className="h-14"></div>
                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Company Values</p>
                  <p className="text-[11px] opacity-90 mt-0.5">9:30-10 am PST</p>
                </div>
              </div>

              {/* Manny's Column */}
              <div className="col-span-3 p-2.5">
                <div className="w-full h-12 bg-[#f2f4f7] rounded-lg mt-8"></div>
              </div>

            </div>

            {/* 10:00 AM Row (Design Presentation) */}
            <div className="grid grid-cols-12 min-h-[90px] border-b border-[#eaecf0]">
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0] space-y-1.5">
                <span className="text-[#667085] font-medium block">10 am</span>
                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Design Presentation</p>
                  <p className="text-[11px] opacity-90 mt-0.5">10-11 am PST</p>
                </div>
              </div>
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0]"></div>
              <div className="col-span-3 p-2.5 border-r border-[#eaecf0]"></div>
              <div className="col-span-3 p-2.5">
                <div className="p-2.5 rounded-lg bg-[#1668e8] text-white shadow-2xs">
                  <p className="font-semibold text-xs">Design Presentation</p>
                  <p className="text-[11px] opacity-90 mt-0.5">10-11 am PST</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal: All Schedule Options */}
      {optionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Optimization Engine Schedule Options</h3>
                <p className="text-xs text-[#667085]">Chakravyuh CP-SAT computed 3 zero-conflict combinations.</p>
              </div>
              <button onClick={() => setOptionsModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Option A */}
              <div 
                onClick={() => setSelectedOption('A')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'A' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option A (Recommended)</span>
                  <span className="text-[11px] font-semibold text-[#0b7c3e] bg-[#ecfdf3] px-2 py-0.5 rounded border border-[#abefc6]">
                    Optimal • Zero Gaps
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">May 18, 2024 • 9:00 AM – 11:00 AM PST (Continuous)</p>
                <p className="text-[11px] text-[#667085] mt-1">Interviewers: Claire Pritchett, Phil Dunphy, Manny Delgado</p>
              </div>

              {/* Option B */}
              <div 
                onClick={() => setSelectedOption('B')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'B' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option B</span>
                  <span className="text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2 py-0.5 rounded border border-[#bcd7fd]">
                    Afternoon Block
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">May 18, 2024 • 1:00 PM – 3:00 PM PST</p>
                <p className="text-[11px] text-[#667085] mt-1">Interviewers: Claire Pritchett, Gloria Vergara, Manny Delgado</p>
              </div>

              {/* Option C */}
              <div 
                onClick={() => setSelectedOption('C')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'C' ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20' : 'border-[#eaecf0] hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101828]">Option C</span>
                  <span className="text-[11px] font-semibold text-[#475467] bg-[#f2f4f7] px-2 py-0.5 rounded">
                    2-Day Split
                  </span>
                </div>
                <p className="text-xs text-[#475467] mt-1">May 18 (Rounds 1 & 2) + May 19 (Round 3)</p>
                <p className="text-[11px] text-[#667085] mt-1">Reduces candidate interview fatigue</p>
              </div>

            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
              <button 
                onClick={() => setOptionsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] text-xs font-medium hover:bg-[#f9fafb]"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setOptionsModalOpen(false);
                  setScheduleApplied(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs"
              >
                Apply Option {selectedOption}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Interview Session */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <h3 className="text-base font-bold text-[#101828]">Add Interview Round</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">✕</button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Round Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Executive Bar Raiser"
                  value={newRoundTitle}
                  onChange={(e) => setNewRoundTitle(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Interviewer</label>
                <select 
                  value={newRoundInterviewer}
                  onChange={(e) => setNewRoundInterviewer(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] bg-white"
                >
                  <option>Claire Pritchett (Principal Designer)</option>
                  <option>Phil Dunphy (Senior Product Manager)</option>
                  <option>Manny Delgado (Staff Systems Architect)</option>
                  <option>Gloria Vergara (Director of Engineering)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Time Slot</label>
                <input 
                  type="text" 
                  value={newRoundTime}
                  onChange={(e) => setNewRoundTime(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
              <button 
                onClick={() => setAddModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] font-medium hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setAddModalOpen(false);
                  setScheduleApplied(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs"
              >
                Append to Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
