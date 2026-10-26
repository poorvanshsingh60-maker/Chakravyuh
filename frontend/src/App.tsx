import { useState, useEffect } from 'react';
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
import { Sparkles } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  picture?: string;
}

interface MainLayoutProps {
  currentUser: AuthUser;
  isDemoMode: boolean;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onEnterDemoMode: () => void;
  onExitDemoMode: () => void;
}

function MainLayout({ 
  currentUser, 
  isDemoMode,
  onLogout, 
  onSwitchRole,
  onEnterDemoMode,
  onExitDemoMode
}: MainLayoutProps) {
  const { assignments } = useCoordination();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  
  // Isolate tasks: live account starts fresh, demo mode loads mock database
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (isDemoMode) return INITIAL_TASKS;
    try {
      const saved = localStorage.getItem(`chakravyuh_live_tasks_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Isolate candidates: live account starts fresh, demo mode loads mock database
  const [candidates, setCandidates] = useState<CandidateItem[]>(() => {
    if (isDemoMode) return INITIAL_CANDIDATES;
    try {
      const saved = localStorage.getItem(`chakravyuh_live_candidates_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [jobs] = useState<JobPosition[]>(() => isDemoMode ? INITIAL_JOBS : []);
  const [directory] = useState<InterviewerDirectoryItem[]>(() => isDemoMode ? INITIAL_DIRECTORY : []);
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem | null>(() => {
    if (isDemoMode) return INITIAL_CANDIDATES[0];
    return null;
  });

  // Re-sync tasks and candidates when toggling between demo and live mode
  useEffect(() => {
    if (isDemoMode) {
      setTasks(INITIAL_TASKS);
      setCandidates(INITIAL_CANDIDATES);
      setActiveCandidate(INITIAL_CANDIDATES[0]);
    } else {
      try {
        const savedT = localStorage.getItem(`chakravyuh_live_tasks_${currentUser.id}`);
        setTasks(savedT ? JSON.parse(savedT) : []);
        const savedC = localStorage.getItem(`chakravyuh_live_candidates_${currentUser.id}`);
        const cList = savedC ? JSON.parse(savedC) : [];
        setCandidates(cList);
        setActiveCandidate(cList[0] || null);
      } catch {
        setTasks([]);
        setCandidates([]);
        setActiveCandidate(null);
      }
    }
  }, [isDemoMode, currentUser.id]);

  // Persist live tasks
  useEffect(() => {
    if (!isDemoMode && currentUser?.id) {
      try {
        localStorage.setItem(`chakravyuh_live_tasks_${currentUser.id}`, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save live tasks:', e);
      }
    }
  }, [tasks, isDemoMode, currentUser?.id]);

  // Persist live candidates
  useEffect(() => {
    if (!isDemoMode && currentUser?.id) {
      try {
        localStorage.setItem(`chakravyuh_live_candidates_${currentUser.id}`, JSON.stringify(candidates));
      } catch (e) {
        console.error('Failed to save live candidates:', e);
      }
    }
  }, [candidates, isDemoMode, currentUser?.id]);

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
        
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-[#eaecf0] px-5 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-semibold text-sm text-[#101828] tracking-tight truncate">
              {getTabTitle(currentTab)}
            </h2>
          </div>

          {/* Middle: Live Account Status OR Demo Sandbox Switcher */}
          {isDemoMode ? (
            <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-300/80 p-1 pl-3 pr-1.5 rounded-full shadow-2xs">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 hidden md:flex">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Demo Sandbox:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSwitchRole('COORDINATOR')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentUser.role === 'COORDINATOR'
                      ? 'bg-[#1668e8] text-white shadow-xs'
                      : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
                  }`}
                >
                  Coordinator
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole('INTERVIEWER')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentUser.role === 'INTERVIEWER'
                      ? 'bg-[#1668e8] text-white shadow-xs'
                      : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
                  }`}
                >
                  Interviewer
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole('CANDIDATE')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentUser.role === 'CANDIDATE'
                      ? 'bg-[#1668e8] text-white shadow-xs'
                      : 'text-[#444746] hover:bg-white hover:text-[#1f1f1f]'
                  }`}
                >
                  Candidate
                </button>
              </div>
              <button
                type="button"
                onClick={onExitDemoMode}
                className="ml-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full shadow-2xs transition-colors cursor-pointer"
              >
                Exit Demo
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
                Live Account • {currentUser.role}
              </span>
              <button
                type="button"
                onClick={onEnterDemoMode}
                className="text-xs font-semibold text-[#1668e8] hover:text-[#145ac7] bg-[#f0f4f9] hover:bg-[#e4e8ef] border border-[#dadce0] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1668e8]" />
                <span className="hidden sm:inline">Explore Demo Sandbox</span>
                <span className="sm:hidden">Demo</span>
              </button>
            </div>
          )}

          {/* Right: Timezone & Active Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <TimezoneSelector variant="compact" />
            <div className="h-4 w-px bg-[#eaecf0]" />
            <div className="flex items-center gap-2">
              {currentUser.picture ? (
                <img 
                  src={currentUser.picture} 
                  alt={currentUser.full_name} 
                  className="w-7 h-7 rounded-full object-cover border border-[#eaecf0]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-xs select-none">
                  {currentUser.full_name.charAt(0)}
                </div>
              )}
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
              {currentUser.role === 'INTERVIEWER' && (
                <InterviewerWorkspace currentUser={currentUser} />
              )}
              {currentUser.role === 'CANDIDATE' && (
                <CandidateWorkspace />
              )}
            </div>
          )}

          {/* Candidates View */}
          {currentTab === 'candidates' && (
            <CandidatesView 
              candidates={candidates} 
              onScheduleCandidate={(cand) => {
                setActiveCandidate(cand);
                setCurrentTab('scheduling');
              }}
              onAddCandidate={handleAddCandidate}
            />
          )}

          {/* Tasks & Approvals */}
          {currentTab === 'all-tasks' && (
            <AllTasksView 
              tasks={effectiveTasks} 
              onCompleteTask={handleCompleteTask}
              onSelectTaskToSchedule={() => setCurrentTab('scheduling')}
            />
          )}

          {/* My Tasks Checklist */}
          {currentTab === 'my-tasks' && (
            <MyTasksView 
              tasks={effectiveTasks} 
              onCompleteTask={handleCompleteTask} 
            />
          )}

          {/* Upcoming Events / Calendar Grid */}
          {currentTab === 'upcoming' && (
            <UpcomingEventsView />
          )}

          {/* Jobs View */}
          {currentTab === 'jobs' && (
            <JobsView jobs={jobs} />
          )}

          {/* Automate Scheduling */}
          {currentTab === 'scheduling' && (
            <AutomateSchedulingView 
              onGoToCommunications={() => setCurrentTab('communications')}
              candidateName={activeCandidate?.name || currentUser.full_name}
              roleName={activeCandidate?.role || 'Senior Software Engineer'}
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('chakravyuh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chakravyuh_is_demo_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [liveUserBackup, setLiveUserBackup] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('chakravyuh_live_user_backup');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<{
    role: UserRole;
    name: string;
    title: string;
  } | null>(null);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setLiveUserBackup(user);
    setIsDemoMode(false);
    try {
      localStorage.setItem('chakravyuh_user', JSON.stringify(user));
      localStorage.setItem('chakravyuh_live_user_backup', JSON.stringify(user));
      localStorage.setItem('chakravyuh_is_demo_mode', 'false');
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setLiveUserBackup(null);
    setIsDemoMode(false);
    localStorage.removeItem('chakravyuh_is_demo_mode');
    localStorage.removeItem('chakravyuh_live_user_backup');
  };

  const enterDemoMode = () => {
    if (currentUser) {
      setLiveUserBackup(currentUser);
      try {
        localStorage.setItem('chakravyuh_live_user_backup', JSON.stringify(currentUser));
      } catch (e) {
        console.error('Failed to backup live user:', e);
      }
    }
    const demoUser: AuthUser = {
      id: 'coord-demo-1',
      email: 'emma.watson@chakravyuh.ai',
      full_name: 'Emma Watson (Lead Scheduler)',
      role: 'COORDINATOR'
    };
    setCurrentUser(demoUser);
    setIsDemoMode(true);
    try {
      localStorage.setItem('chakravyuh_is_demo_mode', 'true');
      localStorage.setItem('chakravyuh_user', JSON.stringify(demoUser));
    } catch (e) {
      console.error('Failed to enter demo mode:', e);
    }
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    try {
      localStorage.setItem('chakravyuh_is_demo_mode', 'false');
    } catch (e) {
      console.error('Failed to exit demo mode:', e);
    }
    if (liveUserBackup) {
      setCurrentUser(liveUserBackup);
      try {
        localStorage.setItem('chakravyuh_user', JSON.stringify(liveUserBackup));
      } catch (e) {
        console.error('Failed to restore live user:', e);
      }
    } else {
      const realUser = authService.getStoredUser();
      if (realUser) {
        setCurrentUser(realUser);
      } else {
        authService.logout();
        setCurrentUser(null);
      }
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (currentUser?.role === newRole) return;

    let updated: AuthUser;
    let targetMeta: { role: UserRole; name: string; title: string };

    if (newRole === 'COORDINATOR') {
      updated = {
        id: 'coord-1',
        email: 'admin@chakravyuh.ai',
        full_name: 'Emma Watson (Lead Scheduler)',
        role: 'COORDINATOR'
      };
      targetMeta = {
        role: 'COORDINATOR',
        name: 'Emma Watson',
        title: 'Lead Coordinator & Campus Scheduler'
      };
    } else if (newRole === 'INTERVIEWER') {
      updated = {
        id: 'int-1',
        email: 'sarah.chen@google.com',
        full_name: 'Dr. Sarah Chen (Google Lead)',
        role: 'INTERVIEWER'
      };
      targetMeta = {
        role: 'INTERVIEWER',
        name: 'Dr. Sarah Chen',
        title: 'Staff Engineer & Google Panel Lead'
      };
    } else {
      updated = {
        id: 'cand-1',
        email: 'marcus.vance@candidate.com',
        full_name: 'Marcus Vance (Candidate)',
        role: 'CANDIDATE'
      };
      targetMeta = {
        role: 'CANDIDATE',
        name: 'Marcus Vance',
        title: 'B.Tech CSE Candidate (20214012)'
      };
    }

    setTransitionTarget(targetMeta);
    setIsSwitchingRole(true);

    setTimeout(() => {
      setCurrentUser(updated);
      try {
        localStorage.setItem('chakravyuh_user', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update session:', e);
      }
      setIsSwitchingRole(false);
      setTransitionTarget(null);
    }, 420);
  };

  return (
    <CoordinationProvider isDemoMode={isDemoMode} userId={currentUser?.id} currentUser={currentUser}>
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} onEnterDemo={enterDemoMode} initialMode="SIGNUP" />
      ) : (
        <>
          <MainLayout 
            currentUser={currentUser} 
            isDemoMode={isDemoMode}
            onLogout={handleLogout} 
            onSwitchRole={handleSwitchRole} 
            onEnterDemoMode={enterDemoMode}
            onExitDemoMode={exitDemoMode}
          />

          {/* Apple HIG Role Switch Smooth Transition Overlay */}
          {isSwitchingRole && transitionTarget && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
              <div className="bg-white/95 border border-[#eaecf0] shadow-2xl rounded-3xl p-6 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center transform transition-all scale-100 animate-in zoom-in-95">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#1668e8]/20 border-t-[#1668e8] animate-spin" />
                  <div className="absolute w-9 h-9 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
                    {transitionTarget.name.charAt(0)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
                    {transitionTarget.role} Portal Active
                  </span>
                  <h3 className="text-base font-bold text-[#101828] mt-1">
                    {transitionTarget.name}
                  </h3>
                  <p className="text-xs text-[#667085]">
                    {transitionTarget.title}
                  </p>
                </div>

                <p className="text-[11px] text-[#98a2b3] italic animate-pulse">
                  Hydrating calendar views, panel credentials & coordination bus...
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </CoordinationProvider>
  );
}

export default App;
