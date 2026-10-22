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

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export function App() {
  // Current logged in user (defaults to Coordinator)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'coord-1',
    email: 'emma.watson@chakravyuh.ai',
    full_name: 'Emma Watson',
    role: 'COORDINATOR'
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [directory] = useState<InterviewerDirectoryItem[]>(INITIAL_DIRECTORY);
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);

  // If logged out, render Google-style Sign In page
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
  };

  const handleAddCandidate = (newCand: CandidateItem) => {
    setCandidates([newCand, ...candidates]);
    setActiveCandidate(newCand);
    setCurrentTab('scheduling');
  };

  const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
  const urgentCount = 2; // Active urgent items

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'home': return 'Home';
      case 'flowchart': return 'Workflow Workspace';
      case 'my-tasks': return 'My Tasks';
      case 'all-tasks': return 'All Tasks';
      case 'upcoming': return 'Upcoming Events';
      case 'candidates': return 'Candidates';
      case 'jobs': return 'Job Openings';
      case 'scheduling': return 'Automate Scheduling';
      case 'training': return 'Interviewer Training';
      case 'communications': return 'Communications';
      case 'directory': return 'Interviewer Directory';
      case 'metrics': return 'Metrics & Analytics';
      case 'settings': return 'Settings';
      case 'help': return 'Help & Support';
      default: return 'Overview';
    }
  };

  return (
    <div className="h-screen bg-[#f8f9fa] flex overflow-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Left Persistent Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab}
        pendingTasksCount={pendingCount} 
        urgentAlertsCount={urgentCount}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />

      {/* Main Area with Clean, Aligned Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar - Clean, Aligned, Professional */}
        <header className="h-14 bg-white border-b border-[#eaecf0] px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-sm text-[#101828] tracking-tight">
              {getTabTitle(currentTab)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <TimezoneSelector variant="compact" />
            <div className="h-4 w-px bg-[#eaecf0]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1668e8] text-white flex items-center justify-center font-semibold text-xs select-none">
                {currentUser.full_name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-[#344054]">
                {currentUser.full_name}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Home Dashboard */}
          {currentTab === 'home' && (
            <HomeDashboardView
              currentUser={currentUser}
              tasks={tasks}
              candidates={candidates}
              onNavigate={setCurrentTab}
              onCompleteTask={handleCompleteTask}
            />
          )}

          {/* Workflow Interactive Workspace */}
          {currentTab === 'flowchart' && (
            <div className="flex-1 overflow-y-auto">
              {currentUser.role === 'COORDINATOR' && <CoordinatorWorkspace />}
              {currentUser.role === 'INTERVIEWER' && <InterviewerWorkspace />}
              {currentUser.role === 'CANDIDATE' && <CandidateWorkspace />}
            </div>
          )}

          {/* My Tasks */}
          {currentTab === 'my-tasks' && (
            <MyTasksView 
              tasks={tasks} 
              onCompleteTask={handleCompleteTask} 
            />
          )}

          {/* All Tasks */}
          {currentTab === 'all-tasks' && (
            <AllTasksView 
              tasks={tasks} 
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

export default App;
