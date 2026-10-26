import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus,
  X
} from 'lucide-react';
import { AvatarBadge } from '../common/AvatarBadge';

export const InterviewerTrainingView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'setup'>('members');
  const [expandedPhil, setExpandedPhil] = useState(true);
  const [expandedClaire, setExpandedClaire] = useState(false);
  const [search, setSearch] = useState('');
  
  // Shadow sessions state
  const [philShadows, setPhilShadows] = useState([
    { title: 'Shadow 1', status: 'Completed', date: 'Apr 28, 2024' },
    { title: 'Shadow 2', status: 'Scheduled', date: 'Apr 29, 2024' },
    { title: 'Reverse shadow 1', status: 'Scheduled', date: 'Apr 30, 2024' }
  ]);

  const [addShadowModalOpen, setAddShadowModalOpen] = useState(false);
  const [newShadowTitle, setNewShadowTitle] = useState('Shadow 3');
  const [newShadowDate, setNewShadowDate] = useState('May 02, 2024');

  const handleAddShadow = (e: React.FormEvent) => {
    e.preventDefault();
    setPhilShadows([...philShadows, { title: newShadowTitle, status: 'Scheduled', date: newShadowDate }]);
    setAddShadowModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* View Header */}
      <div className="px-6 py-4 border-b border-[#eaecf0] bg-white shrink-0">
        <h1 className="text-xl font-bold text-[#101828] mb-4">
          Company Values
        </h1>

        {/* Members / Setup Sub-tabs */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button 
            onClick={() => setActiveSubTab('members')}
            className={`flex items-center gap-2 pb-3 transition-colors ${
              activeSubTab === 'members'
                ? 'text-[#1668e8] border-b-2 border-[#1668e8] font-semibold'
                : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('setup')}
            className={`flex items-center gap-2 pb-3 transition-colors ${
              activeSubTab === 'setup'
                ? 'text-[#1668e8] border-b-2 border-[#1668e8] font-semibold'
                : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Setup</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 max-w-6xl w-full">
        
        {activeSubTab === 'setup' ? (
          /* Training Setup & Calibration Rules */
          <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-6 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#101828]">Calibration Plan Requirements</h3>
              <p className="text-[#667085] mt-0.5">Define prerequisite training milestones for interviewers before conducting standalone sessions.</p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#fafafa] space-y-3">
                <div className="flex justify-between font-semibold text-[#101828]">
                  <span>Required Shadow Sessions</span>
                  <span className="text-[#1668e8] font-bold">2 sessions</span>
                </div>
                <p className="text-[#667085]">New interviewers must observe a Level 2 certified interviewer conduct the live round.</p>
              </div>

              <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#fafafa] space-y-3">
                <div className="flex justify-between font-semibold text-[#101828]">
                  <span>Required Reverse Shadow Sessions</span>
                  <span className="text-[#1668e8] font-bold">1 session</span>
                </div>
                <p className="text-[#667085]">New interviewers conduct the live round under observation of a certified calibration lead.</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="px-4 py-2 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs">
                  Save Training Rules
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Members View */
          <>
            {/* Filters Toolbar */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb]">
                <span>Role</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054] hover:bg-[#f9fafb]">
                <span>Status</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </button>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl border border-[#eaecf0] shadow-2xs overflow-hidden text-xs">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 px-6 py-3.5 bg-white border-b border-[#eaecf0] text-[#475467] font-semibold">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-3">Training Status</div>
                <div className="col-span-1 text-center">Upcoming</div>
                <div className="col-span-1 text-center">Limit</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#eaecf0]">
                
                {/* ROW 1: Claire Pritchett */}
                <div>
                  <div 
                    onClick={() => setExpandedClaire(!expandedClaire)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#f9fafb] cursor-pointer transition-colors"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <AvatarBadge name="Claire Pritchett" size="sm" />
                      <span className="font-semibold text-sm text-[#101828]">Claire Pritchett</span>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#1668e8] text-white font-semibold text-[11px]">
                        <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px]">R</span>
                        1
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center pr-4">
                      <div className="w-48 h-3 rounded-full bg-[#e0edfe] border border-[#bcd7fd] relative overflow-hidden flex items-center">
                        <div className="h-full bg-[#1668e8] w-20 flex items-center justify-end pr-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <div className="flex-1 h-full stripes-pattern"></div>
                      </div>
                    </div>

                    <div className="col-span-1 text-center text-[#475467] font-medium">2</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">8</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">2</div>

                    <div className="col-span-1 flex items-center justify-end gap-2 text-[#98a2b3]">
                      <button className="hover:text-[#344054]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedClaire ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* ROW 2: Phil Dunphy (Expanded) */}
                <div>
                  <div 
                    onClick={() => setExpandedPhil(!expandedPhil)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#f9fafb] cursor-pointer transition-colors"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <AvatarBadge name="Phil Dunphy" size="sm" />
                      <span className="font-semibold text-sm text-[#101828]">Phil Dunphy</span>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#e7f2fe] text-[#1668e8] font-semibold text-[11px] border border-[#bcd7fd]">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1668e8]/10 flex items-center justify-center text-[9px] text-[#1668e8]">S</span>
                        2
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center pr-4">
                      <div className="w-48 h-3 rounded-full bg-[#e0edfe] border border-[#bcd7fd] relative overflow-hidden flex items-center">
                        <div className="h-full bg-[#1668e8] w-12 flex items-center justify-end pr-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <div className="flex-1 h-full stripes-pattern"></div>
                      </div>
                    </div>

                    <div className="col-span-1 text-center text-[#475467] font-medium">3</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">Unlimited</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">1</div>

                    <div className="col-span-1 flex items-center justify-end gap-2 text-[#98a2b3]">
                      <button className="hover:text-[#344054]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedPhil ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* EXPANDED TRAINING PLAN ACCORDION */}
                  {expandedPhil && (
                    <div className="bg-[#fcfcfd] border-t border-[#eaecf0] px-12 py-5 space-y-4">
                      <h4 className="font-bold text-sm text-[#101828]">Training plan</h4>

                      <div className="space-y-2.5 max-w-xl">
                        {philShadows.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                item.status === 'Completed' ? 'bg-[#1668e8] text-white' : 'bg-[#f2f4f7] text-[#667085] border border-[#eaecf0]'
                              }`}>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-sm text-[#101828]">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className={`px-3 py-1 rounded-md font-medium text-xs ${
                                item.status === 'Completed' 
                                  ? 'bg-[#0b7c3e] text-white' 
                                  : 'bg-[#e7f2fe] text-[#1668e8] border border-[#bcd7fd]'
                              }`}>
                                {item.status}
                              </span>
                              <span className="text-[#475467] text-xs font-medium w-24 text-right">
                                {item.date}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Add shadow button */}
                        <div className="pl-9 py-1">
                          <button 
                            onClick={() => setAddShadowModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f7] hover:bg-[#eaecf0] text-[#344054] font-medium text-xs transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#667085]" />
                            <span>Add shadow</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ROW 3: Manny Delgado */}
                <div>
                  <div className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#f9fafb] cursor-pointer transition-colors">
                    <div className="col-span-3 flex items-center gap-3">
                      <AvatarBadge name="Manny Delgado" size="sm" />
                      <span className="font-semibold text-sm text-[#101828]">Manny Delgado</span>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#f2f4f7] text-[#344054] font-semibold text-[11px] border border-[#eaecf0]">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#667085]/10 flex items-center justify-center text-[9px] text-[#667085]">L</span>
                        3
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center pr-4">
                      <div className="w-48 h-3 rounded-full bg-[#f2f4f7] border border-[#eaecf0] relative overflow-hidden flex items-center">
                        <div className="h-full bg-[#1668e8] w-36"></div>
                      </div>
                    </div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">0</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">5</div>
                    <div className="col-span-1 text-center text-[#475467] font-medium">4</div>
                    <div className="col-span-1 flex items-center justify-end gap-2 text-[#98a2b3]">
                      <button className="hover:text-[#344054]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

      </div>

      {/* Modal: Add Shadow Session */}
      {addShadowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-xl max-w-md w-full p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <h3 className="text-base font-bold text-[#101828]">Add Shadow Session</h3>
              <button onClick={() => setAddShadowModalOpen(false)} className="text-[#98a2b3] hover:text-[#101828]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddShadow} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Session Title</label>
                <input 
                  type="text" 
                  value={newShadowTitle}
                  onChange={(e) => setNewShadowTitle(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#344054]">Scheduled Date</label>
                <input 
                  type="text" 
                  value={newShadowDate}
                  onChange={(e) => setNewShadowDate(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setAddShadowModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d0d5dd] text-[#344054] font-medium hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs"
                >
                  Add to Training Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
