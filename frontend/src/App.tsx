import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { NavTab, Task, CandidateItem, JobPosition, InterviewerDirectoryItem } from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_CANDIDATES, 
  INITIAL_JOBS, 
  INITIAL_DIRECTORY 
} from './data/mockDatabase';

// All View Components
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

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('scheduling');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [directory] = useState<InterviewerDirectoryItem[]>(INITIAL_DIRECTORY);
  
  // Selected candidate context for scheduling
  const [activeCandidate, setActiveCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);

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
    <div className="min-h-screen bg-[#f8f9fa] flex font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      {/* ModernLoop Full Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab}
        pendingTasksCount={pendingCount} 
      />

      {/* Main Dynamic Viewport */}
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
  );
}

export default App;
