import React from 'react';

interface WorkloadItem {
  name: string;
  assigned: number;
  capacity: number;
}

export const WorkloadBalanceChart: React.FC<{ data: WorkloadItem[] }> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const pct = Math.min(100, Math.round((item.assigned / item.capacity) * 100));
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#344054]">
              <span>{item.name}</span>
              <span>{item.assigned} / {item.capacity} hrs ({pct}%)</span>
            </div>
            <div className="w-full bg-[#f2f4f7] rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all ${pct >= 85 ? 'bg-[#d92d20]' : 'bg-[#1668e8]'}`}
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
