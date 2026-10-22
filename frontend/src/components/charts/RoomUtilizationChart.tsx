import React from 'react';

interface RoomItem {
  roomName: string;
  utilization: number;
}

export const RoomUtilizationChart: React.FC<{ data: RoomItem[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {data.map((r, idx) => (
        <div key={idx} className="p-3 rounded-lg border border-[#eaecf0] bg-[#fafafa] space-y-1">
          <div className="flex justify-between text-xs font-semibold text-[#101828]">
            <span className="truncate">{r.roomName}</span>
            <span className="text-[#1668e8]">{r.utilization}%</span>
          </div>
          <div className="w-full bg-[#f2f4f7] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#1668e8] h-1.5 rounded-full" style={{ width: `${r.utilization}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};
