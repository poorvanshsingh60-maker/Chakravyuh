import React, { useState } from 'react';
import { JobPosition } from '../../types';
import { 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  Plus,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';

interface JobsViewProps {
  jobs: JobPosition[];
}

export const JobsView: React.FC<JobsViewProps> = ({ jobs }) => {
  const [jobList, setJobList] = useState<JobPosition[]>(jobs);
  const [selectedJob, setSelectedJob] = useState<JobPosition>(jobs[0]);

  // Modal states
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [addRoundModalOpen, setAddRoundModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Core Infrastructure');
  const [newLocation, setNewLocation] = useState('San Francisco, CA / Hybrid');
  const [newOpenings, setNewOpenings] = useState('2');

  // New Round Form State
  const [newRoundName, setNewRoundName] = useState('');
  const [newRoundDuration, setNewRoundDuration] = useState('45');
  const [newRoundSkills, setNewRoundSkills] = useState('System Design, Concurrency');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newJob: JobPosition = {
      id: `job-${Date.now()}`,
      title: newTitle,
      department: newDept,
      location: newLocation,
      openings: parseInt(newOpenings, 10) || 1,
      activeCandidates: 0,
      rounds: [
        { name: 'Initial Technical Screen', duration: 45, requiredSkills: ['Algorithms', 'Data Structures'] },
        { name: 'System Design & Architecture', duration: 60, requiredSkills: ['System Design', 'Scalability'] }
      ]
    };

    const updated = [newJob, ...jobList];
    setJobList(updated);
    setSelectedJob(newJob);
    setCreateJobModalOpen(false);
    setNewTitle('');
    setFeedbackToast(`Job requisition "${newJob.title}" created successfully!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleAddRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoundName.trim()) return;

    const skillsArray = newRoundSkills.split(',').map(s => s.trim()).filter(Boolean);
    const updatedRounds = [
      ...selectedJob.rounds,
      {
        name: newRoundName,
        duration: parseInt(newRoundDuration, 10) || 45,
        requiredSkills: skillsArray.length > 0 ? skillsArray : ['General Assessment']
      }
    ];

    const updatedJob = { ...selectedJob, rounds: updatedRounds };
    setSelectedJob(updatedJob);
    setJobList(jobList.map(j => j.id === selectedJob.id ? updatedJob : j));
    setAddRoundModalOpen(false);
    setNewRoundName('');
    setFeedbackToast(`Round "${newRoundName}" added to ${selectedJob.title}!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleDeleteRound = (roundIndex: number) => {
    const updatedRounds = selectedJob.rounds.filter((_, idx) => idx !== roundIndex);
    const updatedJob = { ...selectedJob, rounds: updatedRounds };
    setSelectedJob(updatedJob);
    setJobList(jobList.map(j => j.id === selectedJob.id ? updatedJob : j));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">Jobs & Interview Pipelines</h1>
            <p className="text-xs text-[#667085] mt-1">
              Active engineering job templates, round prerequisites, and skill calibration rules.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => setCreateJobModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Job Setup</span>
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="mx-8 mt-4 p-3.5 rounded-2xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#0b7c3e]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-8 max-w-6xl">
        
        {/* Left Column: Job Cards List (5 Cols) */}
        <div className="col-span-12 md:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-[#667085] uppercase tracking-wider">
            Open Requisitions ({jobList.length})
          </h2>

          <div className="space-y-2.5">
            {jobList.map((job) => {
              const isSelected = selectedJob.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#1668e8] bg-[#f9fafb] ring-1 ring-[#1668e8]/20 shadow-2xs' 
                      : 'border-[#eaecf0] bg-white hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#101828]">{job.title}</h3>
                      <p className="text-xs text-[#667085] mt-0.5">{job.department}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#1668e8]' : 'text-[#98a2b3]'}`} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#667085] pt-3 mt-3 border-t border-[#f2f4f7]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#98a2b3]" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-[#101828]">
                      <Users className="w-3.5 h-3.5 text-[#1668e8]" />
                      {job.activeCandidates} candidates
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Calibrated Round Plan (7 Cols) */}
        <div className="col-span-12 md:col-span-7 space-y-4">
          <div className="bg-white border border-[#eaecf0] rounded-2xl p-6 shadow-2xs space-y-6">
            
            <div className="border-b border-[#f2f4f7] pb-4">
              <span className="text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2.5 py-0.5 rounded-full border border-[#bcd7fd]">
                INTERVIEW LOOP SETUP
              </span>
              <h3 className="text-lg font-bold text-[#101828] mt-2">
                {selectedJob.title} — Pipeline
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                {selectedJob.rounds.length} sequential rounds configured for automated constraint optimization.
              </p>
            </div>

            {/* Rounds List */}
            <div className="space-y-3">
              {selectedJob.rounds.map((round, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-[#eaecf0] bg-[#fafafa] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1668e8] text-white text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-xs text-[#101828]">{round.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#667085] bg-white px-2 py-0.5 rounded-full border border-[#eaecf0]">
                        <Clock className="w-3 h-3 text-[#98a2b3]" />
                        {round.duration} min
                      </span>
                      {selectedJob.rounds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRound(idx)}
                          className="p-1 text-[#98a2b3] hover:text-red-500 transition-colors"
                          title="Remove round"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pl-7">
                    {round.requiredSkills.map((sk, sIdx) => (
                      <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-white text-[#344054] border border-[#d0d5dd] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => setAddRoundModalOpen(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-[#d0d5dd] hover:border-[#1668e8] text-xs font-semibold text-[#1668e8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Interview Round</span>
            </button>

          </div>
        </div>

      </div>

      {/* Modal: Create Job Requisition */}
      {createJobModalOpen && (
        <Dialog
          isOpen={createJobModalOpen}
          onClose={() => setCreateJobModalOpen(false)}
          title="Create New Job Requisition"
        >
          <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Job Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Machine Learning Architect"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Department</label>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828]"
              >
                <option>Core Infrastructure</option>
                <option>Product & Design</option>
                <option>Web Applications</option>
                <option>Security & Compliance</option>
                <option>Data Engineering</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Target Openings</label>
              <input
                type="number"
                min="1"
                value={newOpenings}
                onChange={(e) => setNewOpenings(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCreateJobModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Create Requisition
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Modal: Add Pipeline Round */}
      {addRoundModalOpen && (
        <Dialog
          isOpen={addRoundModalOpen}
          onClose={() => setAddRoundModalOpen(false)}
          title={`Add Round to ${selectedJob.title}`}
        >
          <form onSubmit={handleAddRound} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Round Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Chaos Engineering & Incident Management"
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Duration (Minutes)</label>
              <select
                value={newRoundDuration}
                onChange={(e) => setNewRoundDuration(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828]"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={newRoundSkills}
                onChange={(e) => setNewRoundSkills(e.target.value)}
                placeholder="e.g. Distributed DB, Raft, Caching"
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setAddRoundModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Append Round to Pipeline
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};
