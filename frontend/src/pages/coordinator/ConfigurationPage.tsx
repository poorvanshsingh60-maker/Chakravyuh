import React, { useState } from 'react';
import { roundService } from '../../services/roundService';
import { roomService } from '../../services/roomService';
import { RoundForm } from '../../components/forms/RoundForm';
import { RoomForm } from '../../components/forms/RoomForm';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

export const ConfigurationPage: React.FC = () => {
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-[#101828]">Pipeline Configuration</h1>
        <p className="text-xs text-[#667085] mt-1">Configure interview pipeline rounds and meeting rooms for CP-SAT solver.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Rounds Card */}
        <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#101828]">Interview Rounds</h3>
            <Button size="sm" onClick={() => setRoundModalOpen(true)}>+ Add Round</Button>
          </div>
          <p className="text-xs text-[#667085]">Sequential dependencies, prerequisites, and required skills.</p>
        </div>

        {/* Rooms Card */}
        <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#101828]">Meeting Rooms & Pods</h3>
            <Button size="sm" onClick={() => setRoomModalOpen(true)}>+ Add Room</Button>
          </div>
          <p className="text-xs text-[#667085]">Physical suites and Google Meet virtual pods.</p>
        </div>
      </div>

      <Dialog isOpen={roundModalOpen} onClose={() => setRoundModalOpen(false)} title="Create Interview Round">
        <RoundForm 
          onSubmit={(data) => {
            roundService.create(data);
            setRoundModalOpen(false);
          }}
          onCancel={() => setRoundModalOpen(false)}
        />
      </Dialog>

      <Dialog isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} title="Create Meeting Room">
        <RoomForm 
          onSubmit={(data) => {
            roomService.create(data);
            setRoomModalOpen(false);
          }}
          onCancel={() => setRoomModalOpen(false)}
        />
      </Dialog>
    </div>
  );
};
