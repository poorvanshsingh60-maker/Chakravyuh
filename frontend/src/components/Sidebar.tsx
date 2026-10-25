import React, { useState } from 'react';
import { 
  Home,
  GitBranch,
  Search, 
  UserRound, 
  Contact2, 
  Settings, 
  X,
  ChevronRight,
  LogOut,
  CheckSquare,
  Calendar,
  Mail,
  BarChart3
} from 'lucide-react';
import { NavTab } from '../types';
import { UserRole } from '../types/user';
import { INITIAL_CANDIDATES, INITIAL_DIRECTORY, INITIAL_JOBS } from '../data/mockDatabase';
import { ChakravyuhLogo } from './ChakravyuhLogo';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount?: number;
  urgentAlertsCount?: number;
  onSelectCandidate?: (candidateName: string) => void;
  currentUser?: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  } | null;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  pendingTasksCount: _pendingTasksCount = 3,
  urgentAlertsCount = 2,
  currentUser,
  onSignOut
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
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#f1f3f5] shrink-0">
        <ChakravyuhLogo size={24} showText={true} />
      </div>

      {/* Search Input with Live Quick-Results Popover */}
      <div className="p-3 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-[#98a2b3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full bg-[#f2f4f7]/80 hover:bg-[#f2f4f7] focus:bg-white border border-[#d0d5dd] focus:border-[#1668e8] rounded-full pl-9 pr-8 py-2 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#1668e8]/15 shadow-2xs transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-[#344054]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Popup */}
        {searchFocused && hasResults && (
          <div className="absolute left-3 right-3 top-13 bg-white rounded-2xl border border-[#eaecf0] shadow-xl z-50 p-2.5 text-xs space-y-2 animate-in fade-in duration-100">
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

      {/* Main Navigation Links - Organized into Distinct Sections */}
      <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto text-xs">
        
        {/* SECTION: OVERVIEW */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
            Overview
          </span>
          
          <button 
            onClick={() => onSelectTab('home')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              currentTab === 'home' 
                ? 'bg-[#1668e8] text-white shadow-xs' 
                : 'text-[#344054] hover:bg-[#f9fafb]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className={`w-4 h-4 ${currentTab === 'home' ? 'text-white' : 'text-[#667085]'}`} />
              <span className="font-semibold">Home Dashboard</span>
            </div>
            {urgentAlertsCount > 0 && (
              <span className={`flex items-center gap-1.5 text-[11px] font-medium ${
                currentTab === 'home' ? 'text-white' : 'text-red-600'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                <span>{urgentAlertsCount}</span>
              </span>
            )}
          </button>
        </div>

        {/* Role: COORDINATOR Sections */}
        {/* Role: COORDINATOR Sections */}
        {(!currentUser || currentUser.role === 'COORDINATOR') && (
          <>
            {/* SECTION: OPERATIONS & SCHEDULE */}
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                Operations & Schedule
              </span>

              {/* Automate Scheduling Matrix */}
              <button 
                onClick={() => onSelectTab('scheduling')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'scheduling' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className={`w-4 h-4 ${currentTab === 'scheduling' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>Automate Scheduling</span>
                </div>
              </button>
            </div>

            {/* SECTION: RECRUITMENT & PIPELINE */}
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                Recruitment & Pipeline
              </span>

              {/* Candidate Loops */}
              <button 
                onClick={() => onSelectTab('candidates')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'candidates' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserRound className={`w-4 h-4 ${currentTab === 'candidates' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>Candidate Loops</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'candidates' ? 'bg-white text-[#1668e8]' : 'bg-[#f2f4f7] text-[#667085]'
                }`}>
                  5
                </span>
              </button>

              {/* Communications */}
              <button 
                onClick={() => onSelectTab('communications')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'communications' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <Mail className={`w-4 h-4 ${currentTab === 'communications' ? 'text-white' : 'text-[#667085]'}`} />
                <span>Communications</span>
              </button>
            </div>

            {/* SECTION: PANELS & CAPACITY */}
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                Panels & Capacity
              </span>

              {/* Panel & Rooms Directory */}
              <button 
                onClick={() => onSelectTab('directory')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'directory' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <Contact2 className={`w-4 h-4 ${currentTab === 'directory' ? 'text-white' : 'text-[#667085]'}`} />
                <span>Panels & Directory</span>
              </button>
            </div>

            {/* SECTION: WORKFLOW & METRICS */}
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                Workflow & Analytics
              </span>

              {/* Tasks & Approvals */}
              <button 
                onClick={() => onSelectTab('all-tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'all-tasks' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className={`w-4 h-4 ${currentTab === 'all-tasks' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>Tasks & Approvals</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'all-tasks' ? 'bg-white text-[#1668e8]' : 'bg-[#fef3f2] text-[#b42318]'
                }`}>
                  3
                </span>
              </button>

              {/* Placement Metrics */}
              <button 
                onClick={() => onSelectTab('metrics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'metrics' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${currentTab === 'metrics' ? 'text-white' : 'text-[#667085]'}`} />
                <span>Placement Metrics</span>
              </button>
            </div>
          </>
        )}

        {/* Role: INTERVIEWER Sections */}
        {currentUser?.role === 'INTERVIEWER' && (
          <>
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                My Workspace
              </span>

              <button 
                onClick={() => onSelectTab('flowchart')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'flowchart' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GitBranch className={`w-4 h-4 ${currentTab === 'flowchart' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>My Schedule & Loops</span>
                </div>
              </button>

              <button 
                onClick={() => onSelectTab('my-tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'my-tasks' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className={`w-4 h-4 ${currentTab === 'my-tasks' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>Pending Scorecards</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#fef3f2] text-[#b42318]">
                  1
                </span>
              </button>
            </div>
          </>
        )}

        {/* Role: CANDIDATE Sections */}
        {currentUser?.role === 'CANDIDATE' && (
          <>
            <div className="space-y-1 pt-1 border-t border-[#f2f4f7]">
              <span className="px-3 text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block mb-1">
                My Placement
              </span>

              <button 
                onClick={() => onSelectTab('flowchart')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  currentTab === 'flowchart' 
                    ? 'bg-[#1668e8] text-white shadow-xs' 
                    : 'text-[#344054] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GitBranch className={`w-4 h-4 ${currentTab === 'flowchart' ? 'text-white' : 'text-[#667085]'}`} />
                  <span>Confirmed Rounds</span>
                </div>
              </button>
            </div>
          </>
        )}

      </nav>

      {/* Footer Settings */}
      <div className="p-2 border-t border-[#f1f3f5] text-xs">
        <button 
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium transition-colors text-left ${
            currentTab === 'settings' 
              ? 'bg-[#1668e8] text-white shadow-xs' 
              : 'text-[#475467] hover:bg-[#f9fafb]'
          }`}
        >
          <Settings className={`w-4 h-4 ${currentTab === 'settings' ? 'text-white' : 'text-[#667085]'}`} />
          <span>Settings</span>
        </button>
      </div>

      {/* User Profile Card at Bottom of Sidebar */}
      {currentUser && (
        <div className="p-3 border-t border-[#eaecf0] flex items-center justify-between text-xs bg-[#fafbfc]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-[11px] shrink-0 select-none">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="truncate">
              <span className="font-semibold text-[#101828] block truncate leading-none">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-[#667085] capitalize block mt-1 leading-none">
                {currentUser.role.toLowerCase()}
              </span>
            </div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="p-1.5 rounded-md text-[#667085] hover:text-red-600 hover:bg-[#f2f4f7] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

    </aside>
  );
};
