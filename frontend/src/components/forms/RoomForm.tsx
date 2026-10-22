import React, { useState } from 'react';
import { Room } from '../../types/room';
import { Button } from '../ui/button';

interface RoomFormProps {
  onSubmit: (data: Omit<Room, 'id'>) => void;
  onCancel: () => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'VIRTUAL' | 'PHYSICAL'>('VIRTUAL');
  const [capacity, setCapacity] = useState(10);
  const [location, setLocation] = useState('Google Meet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      capacity,
      location,
      isActive: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="font-semibold text-[#344054]">Room / Pod Name</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Virtual Pod Delta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs focus:outline-none focus:border-[#1668e8]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-[#344054]">Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as 'VIRTUAL' | 'PHYSICAL')}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white"
          >
            <option value="VIRTUAL">Virtual Meeting Pod</option>
            <option value="PHYSICAL">Physical Conference Room</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-[#344054]">Seat Capacity</label>
          <input 
            type="number" 
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-[#344054]">Location / URL</label>
        <input 
          type="text" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
        />
      </div>

      <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Room</Button>
      </div>
    </form>
  );
};
