import React, { useState } from 'react';
import { InterviewRound } from '../../types/interviewRound';
import { Button } from '../ui/button';

interface RoundFormProps {
  onSubmit: (data: Omit<InterviewRound, 'id'>) => void;
  onCancel: () => void;
}

export const RoundForm: React.FC<RoundFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(60);
  const [sequence, setSequence] = useState(1);
  const [skills, setSkills] = useState('System Design, Raft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      durationMinutes: duration,
      sequenceOrder: sequence,
      requiredSkillIds: skills.split(',').map(s => s.trim()),
      prerequisiteRoundIds: [],
      interviewerCount: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="font-semibold text-[#344054]">Round Title</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Distributed Systems Architecture"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs focus:outline-none focus:border-[#1668e8]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-[#344054]">Duration (Minutes)</label>
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-[#344054]">Sequence Order</label>
          <input 
            type="number" 
            value={sequence}
            onChange={(e) => setSequence(Number(e.target.value))}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-[#344054]">Required Skills (comma separated)</label>
        <input 
          type="text" 
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
        />
      </div>

      <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Round</Button>
      </div>
    </form>
  );
};
