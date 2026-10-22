import { useState } from 'react';
import { UserRole } from './types/user';
import { LoginPage } from './pages/auth/LoginPage';
import { CoordinatorWorkspace } from './components/coordinator/CoordinatorWorkspace';
import { InterviewerWorkspace } from './components/interviewer/InterviewerWorkspace';
import { CandidateWorkspace } from './components/candidate/CandidateWorkspace';
import { Sidebar } from './components/Sidebar';
import { NavTab, Task, CandidateItem, JobPosition, InterviewerDirectoryItem } from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_CANDIDATES, 
  INITIAL_JOBS, 
  INITIAL_DIRECTORY 
} from './data/mockDatabase';
import { MyTasksView } from './components/views/MyTasksView';
import { AllTasksView } from './components/views/AllTasksView';
import { UpcomingEventsView } from './components/views/UpcomingEventsView';
import { CandidatesView } from './components/views/CandidatesView';
import { JobsView } from './components/views/JobsView';
import { AutomateSchedulingView } from './components/views/AutomateSchedulingView';
import { InterviewerTrainingView } from './components/views/InterviewerTrainingView';
import { CommunicationsView } from './components/views/CommunicationsView';
import { DirectoryView } from './components/views/DirectoryView';
import { MetricsView } from './components/views/MetricsView';
import { SettingsView } from './components/views/SettingsView';
import { HelpSupportView } from './components/views/HelpSupportView';
import { LogOut, Layers } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export function App() {
  // Current logged in user (default logged in as Coordinator so user immediately sees UI)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'coord-1',
    email: 'emma.watson@chakravyuh.ai',
    full_name: 'Emma Watson',
    role: 'COORDINATOR'
  });

  // App mode: 'flowmap' (executes the exact flowchart) or 'sidebar-modules'
  const [appMode, setAppMode] = useState<'flowmap' | 'sidebar-modules'>('flowmap');

  // Sidebar modules state
  const [currentTab, setCurrentTab] = useState<NavTab>('scheduling');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [directory] = useState<InterviewerDirectoryItem[]>(INITIAL_DIRECTORY);
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);

  // If logged out, render 1. Login Page
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  // Switch role handler (allows testing all 3 branches of flowchart with 1 click)
  const switchRole = (newRole: UserRole) => {
    if (newRole === 'COORDINATOR') {
      setCurrentUser({
        id: 'coord-1',
        email: 'emma.watson@chakravyuh.ai',
        full_name: 'Emma Watson',
        role: 'COORDINATOR'
      });
    } else if (newRole === 'INTERVIEWER') {
      setCurrentUser({
        id: 'int-1',
        email: 'sarah.chen@chakravyuh.ai',
        full_name: 'Dr. Sarah Chen',
        role: 'INTERVIEWER'
      });
    } else {
      setCurrentUser({
        id: 'cand-1',
        email: 'alex.mercer@gmail.com',
        full_name: 'Alex Mercer',
        role: 'CANDIDATE'
      });
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
  };

  const handleAddCandidate = (newCand: CandidateItem) => {
    setCandidates([newCand, ...candidates]);
    setActiveCandidate(newCand);
    setCurrentTab('scheduling');
  };

  const pendingCount = tasks.filter(t => t.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* ============================================================== */}
      {/* TOP FLOWMAP PERSPECTIVE SWITCHER & APP BAR */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#eaecf0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1668e8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  Ch
                </div>
                <span className="font-extrabold text-[15px] text-[#101828] tracking-tight">
                  Chakravyuh
                </span>
              </div>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2f4f7] text-[#475467] border border-[#eaecf0]">
                OR-Tools CP-SAT
              </span>
            </div>

            {/* FLOWCHART ACTIVE PERSONA SWITCHER */}
            <nav className="flex items-center p-1 bg-[#f2f4f7] rounded-lg border border-[#eaecf0] text-xs font-semibold">
              <button
                onClick={() => {
                  setAppMode('flowmap');
                  switchRole('COORDINATOR');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  appMode === 'flowmap' && currentUser.role === 'COORDINATOR'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>👑</span>
                <span>Coordinator Flow</span>
              </button>

              <button
                onClick={() => {
                  setAppMode('flowmap');
                  switchRole('INTERVIEWER');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  appMode === 'flowmap' && currentUser.role === 'INTERVIEWER'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>💼</span>
                <span>Interviewer Flow</span>
              </button>

              <button
                onClick={() => {
                  setAppMode('flowmap');
                  switchRole('CANDIDATE');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  appMode === 'flowmap' && currentUser.role === 'CANDIDATE'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>🎓</span>
                <span>Candidate Flow</span>
              </button>

              <button
                onClick={() => setAppMode(appMode === 'sidebar-modules' ? 'flowmap' : 'sidebar-modules')}
                className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] border border-transparent transition-all ${
                  appMode === 'sidebar-modules'
                    ? 'bg-[#1668e8] text-white font-bold'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>ModernLoop Menu</span>
              </button>
            </nav>

            {/* User Profile & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <span className="font-bold text-[#101828] block">{currentUser.full_name}</span>
                  <span className="text-[10px] text-[#667085] font-mono">{currentUser.role}</span>
                </div>
              </div>

              {/* Sign out button -> returns to Login Page */}
              <button
                onClick={() => setCurrentUser(null)}
                title="Sign Out / Back to Login Page"
                className="p-1.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#667085] hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* FLOWMAP VIEW (Executes exact flowchart) */}
      {/* ============================================================== */}
      {appMode === 'flowmap' && (
        <main className="flex-1 flex flex-col">
          {currentUser.role === 'COORDINATOR' && <CoordinatorWorkspace />}
          {currentUser.role === 'INTERVIEWER' && <InterviewerWorkspace />}
          {currentUser.role === 'CANDIDATE' && <CandidateWorkspace />}
        </main>
      )}

      {/* ============================================================== */}
      {/* MODERNLOOP SIDEBAR MODULES VIEW */}
      {/* ============================================================== */}
      {appMode === 'sidebar-modules' && (
        <div className="flex-1 flex font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
          <Sidebar 
            currentTab={currentTab} 
            onSelectTab={setCurrentTab}
            pendingTasksCount={pendingCount} 
          />

          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {currentTab === 'my-tasks' && (
              <MyTasksView 
                tasks={tasks} 
                onCompleteTask={handleCompleteTask} 
              />
            )}
            {currentTab === 'all-tasks' && (
              <AllTasksView 
                tasks={tasks} 
                onSelectTaskToSchedule={() => setCurrentTab('scheduling')} 
              />
            )}
            {currentTab === 'upcoming' && (
              <UpcomingEventsView />
            )}
            {currentTab === 'candidates' && (
              <CandidatesView 
                candidates={candidates} 
                onScheduleCandidate={(c) => {
                  setActiveCandidate(c);
                  setCurrentTab('scheduling');
                }}
                onAddCandidate={handleAddCandidate}
              />
            )}
            {currentTab === 'jobs' && (
              <JobsView jobs={jobs} />
            )}
            {currentTab === 'scheduling' && (
              <AutomateSchedulingView 
                onGoToCommunications={() => setCurrentTab('communications')}
                candidateName={activeCandidate.name}
                roleName={activeCandidate.role}
              />
            )}
            {currentTab === 'training' && (
              <InterviewerTrainingView />
            )}
            {currentTab === 'communications' && (
              <CommunicationsView 
                onGoToScheduling={() => setCurrentTab('scheduling')} 
              />
            )}
            {currentTab === 'directory' && (
              <DirectoryView interviewers={directory} />
            )}
            {currentTab === 'metrics' && (
              <MetricsView />
            )}
            {currentTab === 'settings' && (
              <SettingsView />
            )}
            {currentTab === 'help' && (
              <HelpSupportView />
            )}
          </main>
        </div>
      )}

    </div>
  );
}

export default App;
