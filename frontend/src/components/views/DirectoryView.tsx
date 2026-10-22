import React, { useState } from 'react';
import { InterviewerDirectoryItem } from '../../types';
import { Search } from 'lucide-react';

interface DirectoryViewProps {
  interviewers: InterviewerDirectoryItem[];
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ interviewers }) => {
  const [search, setSearch] = useState('');

  const filtered = interviewers.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase()) ||
    i.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <h1 className="text-xl font-bold text-[#101828]">Interviewer Directory</h1>
        <p className="text-xs text-[#667085] mt-1">
          Calibrated interviewer pool, qualified competencies, and weekly capacity thresholds.
        </p>
      </div>

      <div className="p-8 max-w-6xl space-y-6">
        
        {/* Search */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#344054] placeholder-[#98a2b3] focus:outline-none focus:border-[#1668e8]"
          />
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="p-5 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#101828]">{item.name}</h3>
                    <p className="text-xs text-[#475467]">{item.role}</p>
                    <p className="text-[11px] text-[#667085]">{item.team}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  item.status === 'ACTIVE' 
                    ? 'bg-[#ecfdf3] text-[#0b7c3e] border-[#abefc6]' 
                    : 'bg-[#fffaeb] text-[#b54708] border-[#fedf89]'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#98a2b3] tracking-wider block">
                  Calibrated Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f7] text-[#344054] font-medium border border-[#eaecf0]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="pt-2 border-t border-[#f2f4f7] space-y-1">
                <div className="flex justify-between text-xs text-[#475467] font-medium">
                  <span>Weekly Interview Load</span>
                  <span>{item.scheduledThisWeek} of {item.weeklyCapacity} slots</span>
                </div>
                <div className="w-full bg-[#f2f4f7] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#1668e8] h-2 rounded-full" 
                    style={{ width: `${(item.scheduledThisWeek / item.weeklyCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
