import React, { useState } from 'react';
import { JobPosition } from '../../types';
import { 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  Plus 
} from 'lucide-react';

interface JobsViewProps {
  jobs: JobPosition[];
}

export const JobsView: React.FC<JobsViewProps> = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState<JobPosition>(jobs[0]);

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

          <button className="px-3.5 py-1.5 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Job Setup</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-8 max-w-6xl">
        
        {/* Left Column: Job Cards List (5 Cols) */}
        <div className="col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-[#667085] uppercase tracking-wider">
            Open Requisitions ({jobs.length})
          </h2>

          <div className="space-y-2.5">
            {jobs.map((job) => {
              const isSelected = selectedJob.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
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
        <div className="col-span-7 space-y-4">
          <div className="bg-white border border-[#eaecf0] rounded-xl p-6 shadow-2xs space-y-6">
            
            <div className="border-b border-[#f2f4f7] pb-4">
              <span className="text-[11px] font-semibold text-[#1668e8] bg-[#e7f2fe] px-2 py-0.5 rounded border border-[#bcd7fd]">
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
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#667085] bg-white px-2 py-0.5 rounded border border-[#eaecf0]">
                      <Clock className="w-3 h-3 text-[#98a2b3]" />
                      {round.duration} min
                    </span>
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

            <button className="w-full py-2 rounded-lg border border-dashed border-[#d0d5dd] hover:border-[#1668e8] text-xs font-semibold text-[#1668e8] transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Interview Round</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
