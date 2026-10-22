import React, { useState } from 'react';
import { 
  Search, 
  CheckSquare, 
  List, 
  CalendarDays, 
  UserRound, 
  Briefcase, 
  Contact2, 
  LineChart, 
  Settings, 
  HelpCircle,
  Calendar,
  MessageSquare,
  GraduationCap,
  X,
  ChevronRight
} from 'lucide-react';
import { NavTab } from '../types';
import { INITIAL_CANDIDATES, INITIAL_DIRECTORY, INITIAL_JOBS } from '../data/mockDatabase';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount?: number;
  onSelectCandidate?: (candidateName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  pendingTasksCount = 3 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Quick search results
  const matchingCandidates = INITIAL_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  const matchingInterviewers = INITIAL_DIRECTORY.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 3);

  const matchingJobs = INITIAL_JOBS.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 2);

  const hasResults = searchTerm.trim().length > 0 && 
    (matchingCandidates.length > 0 || matchingInterviewers.length > 0 || matchingJobs.length > 0);

  return (
    <aside className="w-60 bg-white border-r border-[#eaecf0] flex flex-col h-screen sticky top-0 shrink-0 select-none">
      
      {/* Top Organization Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#f1f3f5]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1668e8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            Ch
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[15px] text-[#101828] tracking-tight">
              Chakravyuh
            </span>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#667085] bg-[#f2f4f7] px-1.5 py-0.5 rounded font-mono">
          PROD
        </span>
      </div>

      {/* Search Input with Live Quick-Results Popover */}
      <div className="p-3 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search everything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-9 pr-7 py-1.5 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-[#344054]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Popup */}
        {searchFocused && hasResults && (
          <div className="absolute left-3 right-3 top-12 bg-white rounded-xl border border-[#eaecf0] shadow-xl z-50 p-2 text-xs space-y-2 animate-in fade-in duration-100">
            {matchingCandidates.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider px-2">Candidates</span>
                {matchingCandidates.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectTab('candidates');
                      setSearchFocused(false);
                      setSearchTerm('');
                    }}
                    className="w-full p-1.5 rounded-lg hover:bg-[#f9fafb] text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#101828] block">{c.name}</span>
                      <span className="text-[10px] text-[#667085]">{c.role}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#98a2b3]" />
                  </button>
                ))}
              </div>
            )}

            {matchingInterviewers.length > 0 && (
              <div className="pt-1 border-t border-[#f2f4f7]">
                <span className="text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider px-2">Interviewers</span>
                {matchingInterviewers.map(i => (
                  <button
                    key={i.id}
                    onClick={() => {
                      onSelectTab('directory');
                      setSearchFocused(false);
                      setSearchTerm('');
                    }}
                    className="w-full p-1.5 rounded-lg hover:bg-[#f9fafb] text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#101828] block">{i.name}</span>
                      <span className="text-[10px] text-[#667085]">{i.team}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#98a2b3]" />
                  </button>
                ))}
              </div>
            )}

            {matchingJobs.length > 0 && (
              <div className="pt-1 border-t border-[#f2f4f7]">
                <span className="text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider px-2">Jobs</span>
                {matchingJobs.map(j => (
                  <button
                    key={j.id}
                    onClick={() => {
                      onSelectTab('jobs');
                      setSearchFocused(false);
                      setSearchTerm('');
                    }}
                    className="w-full p-1.5 rounded-lg hover:bg-[#f9fafb] text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#101828] block">{j.title}</span>
                      <span className="text-[10px] text-[#667085]">{j.department}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#98a2b3]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto text-xs">
        
        {/* My Tasks */}
        <button 
          onClick={() => onSelectTab('my-tasks')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'my-tasks' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckSquare className={`w-4 h-4 ${currentTab === 'my-tasks' ? 'text-white' : 'text-[#667085]'}`} />
            <span>My tasks</span>
          </div>
          {pendingTasksCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'my-tasks' ? 'bg-white text-[#1668e8]' : 'bg-[#e7f2fe] text-[#1668e8]'
            }`}>
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* All Tasks */}
        <button 
          onClick={() => onSelectTab('all-tasks')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'all-tasks' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <List className={`w-4 h-4 ${currentTab === 'all-tasks' ? 'text-white' : 'text-[#667085]'}`} />
          <span>All tasks</span>
        </button>

        {/* Upcoming events */}
        <button 
          onClick={() => onSelectTab('upcoming')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'upcoming' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <CalendarDays className={`w-4 h-4 ${currentTab === 'upcoming' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Upcoming events</span>
        </button>

        {/* Candidates */}
        <button 
          onClick={() => onSelectTab('candidates')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'candidates' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <UserRound className={`w-4 h-4 ${currentTab === 'candidates' ? 'text-white' : 'text-[#667085]'}`} />
            <span>Candidates</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            currentTab === 'candidates' ? 'bg-white text-[#1668e8]' : 'bg-[#f2f4f7] text-[#667085]'
          }`}>
            5
          </span>
        </button>

        {/* Jobs */}
        <button 
          onClick={() => onSelectTab('jobs')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'jobs' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <Briefcase className={`w-4 h-4 ${currentTab === 'jobs' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Jobs</span>
        </button>

        <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider">
          Orchestration
        </div>

        {/* Automate Scheduling Tab */}
        <button 
          onClick={() => onSelectTab('scheduling')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'scheduling' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <Calendar className={`w-4 h-4 ${currentTab === 'scheduling' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Automate Scheduling</span>
        </button>

        {/* Modules / Interviewer Training Tab */}
        <button 
          onClick={() => onSelectTab('training')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'training' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <GraduationCap className={`w-4 h-4 ${currentTab === 'training' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Interviewer Training</span>
        </button>

        {/* Communications Tab */}
        <button 
          onClick={() => onSelectTab('communications')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'communications' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${currentTab === 'communications' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Communications</span>
        </button>

        <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider">
          Directory & Insights
        </div>

        {/* Directory */}
        <button 
          onClick={() => onSelectTab('directory')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'directory' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <Contact2 className={`w-4 h-4 ${currentTab === 'directory' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Directory</span>
        </button>

        {/* Metrics */}
        <button 
          onClick={() => onSelectTab('metrics')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'metrics' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#344054] hover:bg-[#f9fafb]'
          }`}
        >
          <LineChart className={`w-4 h-4 ${currentTab === 'metrics' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Metrics</span>
        </button>

      </nav>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-[#f1f3f5] space-y-0.5 text-xs">
        <button 
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'settings' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#475467] hover:bg-[#f9fafb]'
          }`}
        >
          <Settings className={`w-4 h-4 ${currentTab === 'settings' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => onSelectTab('help')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'help' 
              ? 'bg-[#1668e8] text-white' 
              : 'text-[#475467] hover:bg-[#f9fafb]'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${currentTab === 'help' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Help & support</span>
        </button>
      </div>

    </aside>
  );
};
