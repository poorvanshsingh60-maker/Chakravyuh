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
import { HomeDashboardView } from './components/views/HomeDashboardView';
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
import { TimezoneSelector } from './components/common/TimezoneSelector';
import { authService } from './services/authService';
import { CoordinationProvider, useCoordination } from './context/CoordinationContext';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

interface MainLayoutProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
}

function MainLayout({ currentUser, onLogout, onSwitchRole }: MainLayoutProps) {
  const { assignments } = useCoordination();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [directory] = useState<InterviewerDirectoryItem[]>(INITIAL_DIRECTORY);
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);

  // Sync tasks dynamically with evaluated scorecards from CoordinationContext
  const effectiveTasks = tasks.map(t => {
    const isEvaluated = assignments.some(
      a => (a.candidateName.toLowerCase().includes(t.candidateName.toLowerCase()) || 
            t.candidateName.toLowerCase().includes(a.candidateName.toLowerCase())) && 
           a.status === 'EVALUATED'
    );
    if (isEvaluated && t.type === 'SCORECARD') {
      return { ...t, status: 'COMPLETED' as const };
    }
    return t;
  });

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
  };

  const handleAddCandidate = (newCand: CandidateItem) => {
    setCandidates([newCand, ...candidates]);
    setActiveCandidate(newCand);
    setCurrentTab('scheduling');
  };

  const pendingCount = effectiveTasks.filter(t => t.status === 'PENDING').length;
  const pendingScorecardsCount = assignments.filter(a => a.status !== 'EVALUATED').length;

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'home': return 'Home Command Center';
      case 'flowchart': 
        return currentUser?.role === 'INTERVIEWER' 
          ? 'My Interview Loops' 
          : currentUser?.role === 'CANDIDATE' 
          ? 'My Confirmed Schedule' 
          : 'Master Schedule Grid';
      case 'scheduling': return 'Automate Scheduling Matrix';
      case 'candidates': return 'Candidate Loops';
      case 'all-tasks': return 'Tasks & Approvals';
      case 'my-tasks': return 'My Task Checklist';
      case 'directory': return 'Panels & Rooms Directory';
      case 'training': return 'Interviewer Training & Shadows';
      case 'communications': return 'Candidate Communications';
      case 'metrics': return 'Placement Metrics & Analytics';
      case 'settings': return 'Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8f9fa] flex font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Left Persistent Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab}
        pendingTasksCount={pendingCount} 
        urgentAlertsCount={pendingScorecardsCount}
        currentUser={currentUser}
        onSignOut={onLogout}
      />

      {/* Main Area with Clean, Aligned Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar with 1-Click Role Demo Switcher */}
        <header className="h-14 bg-white border-b border-[#eaecf0] px-5 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-semibold text-sm text-[#101828] tracking-tight truncate">
              {getTabTitle(currentTab)}
            </h2>
          </div>

          {/* Middle: 1-Click Role Demo Switcher */}
          <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-full border border-[#dadce0]">
            <span className="text-[10px] font-bold text-[#5f6368] uppercase px-2 tracking-wider hidden lg:inline">
              Role Demo:
            </span>
            <button
              type="button"
              onClick={() => onSwitchRole('COORDINATOR')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currentUser.role === 'COORDINATOR'
                  ? 'bg-[#1668e8] text-white shadow-xs'
                  : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
              }`}
            >
              Coordinator (Scheduler)
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('INTERVIEWER')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currentUser.role === 'INTERVIEWER'
                  ? 'bg-[#1668e8] text-white shadow-xs'
                  : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
              }`}
            >
              Interviewer (Google Panel)
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('CANDIDATE')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currentUser.role === 'CANDIDATE'
                  ? 'bg-[#1668e8] text-white shadow-xs'
                  : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
              }`}
            >
              Candidate (Marcus Vance)
            </button>
          </div>

          {/* Right: Timezone & Active Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <TimezoneSelector variant="compact" />
            <div className="h-4 w-px bg-[#eaecf0]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-xs select-none">
                {currentUser.full_name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-[#344054] hidden sm:inline max-w-[120px] truncate">
                {currentUser.full_name.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* View Content (Strictly fitted within viewport) */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          
          {/* Home Dashboard */}
          {currentTab === 'home' && (
            <HomeDashboardView
              currentUser={currentUser}
              tasks={effectiveTasks}
              candidates={candidates}
              onNavigate={setCurrentTab}
              onCompleteTask={handleCompleteTask}
            />
          )}

          {/* Master Schedule Table with Time (Flowchart) */}
          {currentTab === 'flowchart' && (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              {currentUser.role === 'COORDINATOR' && (
                <CoordinatorWorkspace 
                  onSimulateCandidate={() => onSwitchRole('CANDIDATE')}
                />
              )}
              {currentUser.role === 'INTERVIEWER' && <InterviewerWorkspace />}
              {currentUser.role === 'CANDIDATE' && <CandidateWorkspace />}
            </div>
          )}

          {/* My Tasks */}
          {currentTab === 'my-tasks' && (
            <MyTasksView 
              tasks={effectiveTasks} 
              onCompleteTask={handleCompleteTask} 
              currentUser={currentUser}
            />
          )}

          {/* All Tasks */}
          {currentTab === 'all-tasks' && (
            <AllTasksView 
              tasks={effectiveTasks} 
              onCompleteTask={handleCompleteTask}
              onSelectTaskToSchedule={() => setCurrentTab('scheduling')} 
            />
          )}

          {/* Upcoming Events */}
          {currentTab === 'upcoming' && (
            <UpcomingEventsView />
          )}

          {/* Candidates View */}
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

          {/* Jobs View */}
          {currentTab === 'jobs' && (
            <JobsView jobs={jobs} />
          )}

          {/* Automate Scheduling */}
          {currentTab === 'scheduling' && (
            <AutomateSchedulingView 
              onGoToCommunications={() => setCurrentTab('communications')}
              candidateName={activeCandidate.name}
              roleName={activeCandidate.role}
            />
          )}

          {/* Interviewer Training */}
          {currentTab === 'training' && (
            <InterviewerTrainingView />
          )}

          {/* Communications */}
          {currentTab === 'communications' && (
            <CommunicationsView 
              onGoToScheduling={() => setCurrentTab('scheduling')} 
            />
          )}

          {/* Panel Directory */}
          {currentTab === 'directory' && (
            <DirectoryView interviewers={directory} />
          )}

          {/* Metrics & Analytics */}
          {currentTab === 'metrics' && (
            <MetricsView />
          )}

          {/* Settings */}
          {currentTab === 'settings' && (
            <SettingsView />
          )}

          {/* Help & Support */}
          {currentTab === 'help' && (
            <HelpSupportView />
          )}
        </main>
      </div>

    </div>
  );
}

export function App() {
  // Current logged in user (defaults to null if not stored -> opens Sign Up page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('chakravyuh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('chakravyuh_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    let updated: AuthUser;
    if (newRole === 'COORDINATOR') {
      updated = {
        id: 'coord-1',
        email: 'admin@chakravyuh.ai',
        full_name: 'Emma Watson (Lead Scheduler)',
        role: 'COORDINATOR'
      };
    } else if (newRole === 'INTERVIEWER') {
      updated = {
        id: 'int-1',
        email: 'sarah.chen@google.com',
        full_name: 'Dr. Sarah Chen (Google Lead)',
        role: 'INTERVIEWER'
      };
    } else {
      updated = {
        id: 'cand-1',
        email: 'marcus.vance@candidate.com',
        full_name: 'Marcus Vance (Candidate)',
        role: 'CANDIDATE'
      };
    }
    setCurrentUser(updated);
    try {
      localStorage.setItem('chakravyuh_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update session:', e);
    }
  };

  return (
    <CoordinationProvider>
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} initialMode="SIGNUP" />
      ) : (
        <MainLayout 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onSwitchRole={handleSwitchRole} 
        />
      )}
    </CoordinationProvider>
  );
}

export default App;
