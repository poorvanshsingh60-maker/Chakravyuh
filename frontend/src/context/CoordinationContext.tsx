import React, { createContext, useContext, useState, useEffect } from 'react';

interface CoordinationState {
  candidateName: string;
  candidateReg: string;
  driveName: string;
  inviteCode: string;
  isInviteAccepted: boolean;
  areSlotsConfirmed: boolean;
  isScorecardSubmitted: boolean;
  interviewerDecision: string;
  interviewerRating: number;
  isNudged: boolean;
  acceptInvite: () => void;
  confirmSlots: () => void;
  submitScorecard: (decision: string, rating: number) => void;
  nudgeInterviewer: () => void;
  clearNudge: () => void;
  resetFlow: () => void;
}

const CoordinationContext = createContext<CoordinationState | undefined>(undefined);

const STORAGE_KEY = 'chakravyuh_coordination_state_v3';

export const CoordinationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInviteAccepted, setIsInviteAccepted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).isInviteAccepted ?? true : true; // Default true so demo is ready, but toggleable
    } catch {
      return true;
    }
  });

  const [areSlotsConfirmed, setAreSlotsConfirmed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).areSlotsConfirmed ?? true : true;
    } catch {
      return true;
    }
  });

  const [isScorecardSubmitted, setIsScorecardSubmitted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).isScorecardSubmitted ?? false : false;
    } catch {
      return false;
    }
  });

  const [isNudged, setIsNudged] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).isNudged ?? true : true;
    } catch {
      return true;
    }
  });

  const [interviewerDecision, setInterviewerDecision] = useState<string>('STRONG_HIRE');
  const [interviewerRating, setInterviewerRating] = useState<number>(5);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isInviteAccepted,
        areSlotsConfirmed,
        isScorecardSubmitted,
        interviewerDecision,
        interviewerRating,
        isNudged
      }));
    } catch (e) {
      console.error('Failed to sync coordination state', e);
    }
  }, [isInviteAccepted, areSlotsConfirmed, isScorecardSubmitted, interviewerDecision, interviewerRating, isNudged]);

  const acceptInvite = () => {
    setIsInviteAccepted(true);
  };

  const confirmSlots = () => {
    setAreSlotsConfirmed(true);
  };

  const submitScorecard = (decision: string, rating: number) => {
    setInterviewerDecision(decision);
    setInterviewerRating(rating);
    setIsScorecardSubmitted(true);
    setIsNudged(false);
  };

  const nudgeInterviewer = () => {
    setIsScorecardSubmitted(false);
    setIsNudged(true);
  };

  const clearNudge = () => {
    setIsNudged(false);
  };

  const resetFlow = () => {
    setIsInviteAccepted(false);
    setAreSlotsConfirmed(false);
    setIsScorecardSubmitted(false);
    setIsNudged(true);
    setInterviewerDecision('STRONG_HIRE');
    setInterviewerRating(5);
  };

  return (
    <CoordinationContext.Provider value={{
      candidateName: 'Marcus Vance',
      candidateReg: '20214012 (B.Tech CSE)',
      driveName: 'Google SDE Campus Placement Drive 2026',
      inviteCode: 'google-sde-marcus',
      isInviteAccepted,
      areSlotsConfirmed,
      isScorecardSubmitted,
      interviewerDecision,
      interviewerRating,
      isNudged,
      acceptInvite,
      confirmSlots,
      submitScorecard,
      nudgeInterviewer,
      clearNudge,
      resetFlow
    }}>
      {children}
    </CoordinationContext.Provider>
  );
};

export const useCoordination = () => {
  const context = useContext(CoordinationContext);
  if (!context) {
    throw new Error('useCoordination must be used within a CoordinationProvider');
  }
  return context;
};
