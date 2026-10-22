import React, { useState } from 'react';
import { Evaluation, Recommendation } from '../../types/evaluation';
import { Button } from '../ui/button';

interface FeedbackFormProps {
  interviewId: string;
  candidateId: string;
  candidateName: string;
  interviewerId: string;
  interviewerName: string;
  onSubmit: (data: Omit<Evaluation, 'id' | 'submittedAt'>) => void;
  onCancel: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  interviewId,
  candidateId,
  candidateName,
  interviewerId,
  interviewerName,
  onSubmit,
  onCancel,
}) => {
  const [problemSolving, setProblemSolving] = useState(4);
  const [systemArch, setSystemArch] = useState(5);
  const [rec, setRec] = useState<Recommendation>('STRONG_HIRE');
  const [strengths, setStrengths] = useState('Deep intuition for consensus mechanisms.');
  const [weaknesses, setWeaknesses] = useState('Could improve on edge-case testing coverage.');
  const [notes, setNotes] = useState('Strong candidate, highly recommend hiring.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      interviewId,
      candidateId,
      interviewerId,
      interviewerName,
      scores: [
        { name: 'Problem Solving', score: problemSolving },
        { name: 'System Architecture', score: systemArch },
      ],
      recommendation: rec,
      strengths,
      weaknesses,
      summaryNotes: notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3 bg-[#fafafa] rounded-lg border border-[#eaecf0]">
        <span className="font-semibold text-[#101828]">Evaluating Candidate: {candidateName}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-[#344054]">Problem Solving (1-5)</label>
          <input 
            type="number" 
            min={1} 
            max={5} 
            value={problemSolving} 
            onChange={(e) => setProblemSolving(Number(e.target.value))}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs" 
          />
        </div>
        <div>
          <label className="font-semibold text-[#344054]">Architecture (1-5)</label>
          <input 
            type="number" 
            min={1} 
            max={5} 
            value={systemArch} 
            onChange={(e) => setSystemArch(Number(e.target.value))}
            className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs" 
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-[#344054]">Recommendation</label>
        <select 
          value={rec} 
          onChange={(e) => setRec(e.target.value as Recommendation)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs bg-white"
        >
          <option value="STRONG_HIRE">Strong Hire</option>
          <option value="HIRE">Hire</option>
          <option value="LEAN_HIRE">Lean Hire</option>
          <option value="NO_HIRE">No Hire</option>
          <option value="STRONG_NO_HIRE">Strong No Hire</option>
        </select>
      </div>

      <div>
        <label className="font-semibold text-[#344054]">Candidate Strengths</label>
        <textarea 
          rows={2} 
          value={strengths} 
          onChange={(e) => setStrengths(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-[#344054]">Areas for Development / Weaknesses</label>
        <textarea 
          rows={2} 
          value={weaknesses} 
          onChange={(e) => setWeaknesses(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-[#344054]">Summary Evaluation</label>
        <textarea 
          rows={3} 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-[#d0d5dd] rounded-lg p-2 text-xs"
        />
      </div>

      <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Submit Feedback</Button>
      </div>
    </form>
  );
};
