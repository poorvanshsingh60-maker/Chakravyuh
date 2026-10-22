import { useState } from 'react';
import { UserRole } from './types/user';
import { LoginPage } from './pages/auth/LoginPage';
import { CoordinatorWorkspace } from './components/coordinator/CoordinatorWorkspace';
import { InterviewerWorkspace } from './components/interviewer/InterviewerWorkspace';
import { CandidateWorkspace } from './components/candidate/CandidateWorkspace';
import { Sidebar } from './components/Sidebar';
import { ChakravyuhLogo } from './components/ChakravyuhLogo';
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
import { LogOut } from 'lucide-react';
import { TimezoneSelector } from './components/common/TimezoneSelector';

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

  // Current active navigation tab (defaults to Home dashboard with Moodle-style Red Alerts)
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [directory] = useState<InterviewerDirectoryItem[]>(INITIAL_DIRECTORY);
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);

  // If logged out, render Login Page with 1-click persona demo logins
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  // Switch role handler (allows testing all 3 branches of the system with 1 click)
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
  const urgentCount = 2; // Active high-priority alerts for current role

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* ============================================================== */}
      {/* TOP UNIFIED APP BAR WITH AUTHENTIC LOGO & ROLE SWITCHER       */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#eaecf0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Authentic Chakravyuh Logo & Solver Badge */}
            <div className="flex items-center gap-3">
              <ChakravyuhLogo size={24} showText={true} />
            </div>

            {/* Role Persona Switcher (Instant 1-Click Role Perspective Test) */}
            <nav className="flex items-center p-1 bg-[#f2f4f7] rounded-lg border border-[#eaecf0] text-xs font-semibold">
              <button
                onClick={() => switchRole('COORDINATOR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentUser.role === 'COORDINATOR'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>👑</span>
                <span>Coordinator</span>
              </button>

              <button
                onClick={() => switchRole('INTERVIEWER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentUser.role === 'INTERVIEWER'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>💼</span>
                <span>Interviewer</span>
              </button>

              <button
                onClick={() => switchRole('CANDIDATE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentUser.role === 'CANDIDATE'
                    ? 'bg-white text-[#101828] shadow-2xs font-bold border border-[#d0d5dd]'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <span>🎓</span>
                <span>Candidate</span>
              </button>
            </nav>

            {/* Global Timezone Switcher & User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center">
                <TimezoneSelector variant="compact" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <span className="font-bold text-[#101828] block">{currentUser.full_name}</span>
                  <span className="text-[10px] text-[#667085] font-mono">{currentUser.role}</span>
                </div>
              </div>

              {/* Sign out button -> returns to Login Page with demo logins */}
              <button
                onClick={() => setCurrentUser(null)}
                title="Sign Out to Login Page / Switch Credentials"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#eaecf0] hover:bg-[#f9fafb] text-[#667085] hover:text-red-600 transition-colors text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* UNIFIED SIDEBAR + WORKSPACE LAYOUT                             */}
      {/* ============================================================== */}
      <div className="flex-1 flex font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab}
          pendingTasksCount={pendingCount} 
          urgentAlertsCount={urgentCount}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* 1. Home Dashboard View with Moodle-style Red Urgent Alert Banners */}
          {currentTab === 'home' && (
            <HomeDashboardView
              currentUser={currentUser}
              tasks={tasks}
              candidates={candidates}
              onNavigate={setCurrentTab}
              onSwitchRole={switchRole}
              onCompleteTask={handleCompleteTask}
            />
          )}

          {/* 2. Interactive Flowmap Workspace (Coordinator / Interviewer / Candidate) */}
          {currentTab === 'flowchart' && (
            <div className="flex-1 overflow-y-auto">
              {currentUser.role === 'COORDINATOR' && <CoordinatorWorkspace />}
              {currentUser.role === 'INTERVIEWER' && <InterviewerWorkspace />}
              {currentUser.role === 'CANDIDATE' && <CandidateWorkspace />}
            </div>
          )}

          {/* 3. My Tasks */}
          {currentTab === 'my-tasks' && (
            <MyTasksView 
              tasks={tasks} 
              onCompleteTask={handleCompleteTask} 
            />
          )}

          {/* 4. All Tasks */}
          {currentTab === 'all-tasks' && (
            <AllTasksView 
              tasks={tasks} 
              onSelectTaskToSchedule={() => setCurrentTab('scheduling')} 
            />
          )}

          {/* 5. Upcoming Events */}
          {currentTab === 'upcoming' && (
            <UpcomingEventsView />
          )}

          {/* 6. Candidates View */}
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

          {/* 7. Jobs View */}
          {currentTab === 'jobs' && (
            <JobsView jobs={jobs} />
          )}

          {/* 8. Automate Scheduling (CP-SAT Solver) */}
          {currentTab === 'scheduling' && (
            <AutomateSchedulingView 
              onGoToCommunications={() => setCurrentTab('communications')}
              candidateName={activeCandidate.name}
              roleName={activeCandidate.role}
            />
          )}

          {/* 9. Interviewer Training */}
          {currentTab === 'training' && (
            <InterviewerTrainingView />
          )}

          {/* 10. Communications & Invitations */}
          {currentTab === 'communications' && (
            <CommunicationsView 
              onGoToScheduling={() => setCurrentTab('scheduling')} 
            />
          )}

          {/* 11. Panel Directory */}
          {currentTab === 'directory' && (
            <DirectoryView interviewers={directory} />
          )}

          {/* 12. Metrics & Analytics */}
          {currentTab === 'metrics' && (
            <MetricsView />
          )}

          {/* 13. Settings */}
          {currentTab === 'settings' && (
            <SettingsView />
          )}

          {/* 14. Help & Support */}
          {currentTab === 'help' && (
            <HelpSupportView />
          )}
        </main>
      </div>

    </div>
  );
}

export default App;
