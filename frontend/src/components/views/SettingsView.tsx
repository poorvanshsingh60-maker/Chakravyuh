import React, { useState } from 'react';
import { 
  Cpu, 
  MapPin, 
  Check, 
  CheckCircle2, 
  Plus,
  Trash2,
  Video
} from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';

interface RoomSetting {
  id: string;
  name: string;
  type: string;
  cap: string;
  isVideo: boolean;
}

export const SettingsView: React.FC = () => {
  const [bufferTime, setBufferTime] = useState('15');
  const [solverTimeout, setSolverTimeout] = useState('30');
  const [autoReschedule, setAutoReschedule] = useState(true);
  const [saved, setSaved] = useState(false);

  // Rooms list
  const [rooms, setRooms] = useState<RoomSetting[]>([
    { id: '1', name: 'Virtual Pod Alpha', type: 'Virtual (Google Meet)', cap: '10 seats', isVideo: true },
    { id: '2', name: 'Virtual Pod Gamma', type: 'Virtual (Google Meet)', cap: '10 seats', isVideo: true },
    { id: '3', name: 'Executive Suite 402', type: 'Physical (SF Floor 4)', cap: '6 seats', isVideo: false },
    { id: '4', name: 'Turing Collab Lab', type: 'Physical (SF Floor 2)', cap: '4 seats', isVideo: false }
  ]);

  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'VIRTUAL' | 'PHYSICAL'>('VIRTUAL');
  const [newRoomCap, setNewRoomCap] = useState('6');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom: RoomSetting = {
      id: `room-${Date.now()}`,
      name: newRoomName,
      type: newRoomType === 'VIRTUAL' ? 'Virtual (Google Meet)' : 'Physical (Campus)',
      cap: `${newRoomCap} seats`,
      isVideo: newRoomType === 'VIRTUAL'
    };

    setRooms([...rooms, newRoom]);
    setAddRoomModalOpen(false);
    setNewRoomName('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <h1 className="text-xl font-bold text-[#101828]">Settings & Engine Configuration</h1>
        <p className="text-xs text-[#667085] mt-1">
          Manage scheduling rules, solver constraint parameters, meeting rooms, and calendar integrations.
        </p>
      </div>

      <div className="p-8 max-w-4xl space-y-8">
        
        {saved && (
          <div className="p-3.5 rounded-xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully! Solver parameters & room registry updated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Section 1: CP-SAT Optimization Constraints */}
          <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1668e8]" />
              <h3 className="font-bold text-sm text-[#101828]">Optimization Engine Parameters</h3>
            </div>
            <p className="text-xs text-[#667085]">
              Configure hard mathematical boundaries and soft objective weights enforced by Google OR-Tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#344054]">
                  Minimum Buffer Between Candidate Rounds (Minutes)
                </label>
                <select 
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 bg-white text-xs text-[#101828]"
                >
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes (Recommended)</option>
                  <option value="30">30 Minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#344054]">
                  Solver Timeout Limit (Seconds)
                </label>
                <select 
                  value={solverTimeout}
                  onChange={(e) => setSolverTimeout(e.target.value)}
                  className="w-full border border-[#d0d5dd] rounded-lg p-2 bg-white text-xs text-[#101828]"
                >
                  <option value="15">15 Seconds (Fast)</option>
                  <option value="30">30 Seconds (Default)</option>
                  <option value="60">60 Seconds (Deep Search)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#344054]">
                <input 
                  type="checkbox" 
                  checked={autoReschedule} 
                  onChange={(e) => setAutoReschedule(e.target.checked)}
                  className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                />
                <span>Enable Minimal-Churn delta rescheduling when an interviewer cancels</span>
              </label>
            </div>
          </div>

          {/* Section 2: Meeting Rooms & Virtual Pods */}
          <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1668e8]" />
                <h3 className="font-bold text-sm text-[#101828]">Meeting Rooms & Pods</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setAddRoomModalOpen(true)}
                className="text-xs font-semibold text-[#1668e8] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Room
              </button>
            </div>

            <div className="space-y-2">
              {rooms.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#eaecf0] bg-[#fafafa]">
                  <div className="flex items-center gap-2">
                    {r.isVideo ? (
                      <Video className="w-4 h-4 text-[#12b76a]" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#667085]" />
                    )}
                    <span className="font-semibold text-xs text-[#101828]">{r.name}</span>
                    <span className="text-[11px] text-[#667085]">• {r.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-[#475467] bg-white px-2 py-0.5 rounded border border-[#eaecf0]">
                      {r.cap}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(r.id)}
                      className="text-[#98a2b3] hover:text-red-500 transition-colors p-1"
                      title="Delete room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>

        </form>

      </div>

      {/* Modal: Add Room */}
      {addRoomModalOpen && (
        <Dialog
          isOpen={addRoomModalOpen}
          onClose={() => setAddRoomModalOpen(false)}
          title="Add Meeting Room or Virtual Bridge"
        >
          <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Room / Pod Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Virtual Pod Delta (Google Meet)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Room Type</label>
              <select
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value as any)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white text-[#101828]"
              >
                <option value="VIRTUAL">Virtual (Google Meet Cloud Bridge)</option>
                <option value="PHYSICAL">Physical (Conference Room)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#344054]">Seat Capacity</label>
              <input
                type="number"
                min="1"
                value={newRoomCap}
                onChange={(e) => setNewRoomCap(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setAddRoomModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Add Room
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};
