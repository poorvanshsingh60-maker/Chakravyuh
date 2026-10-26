import React, { createContext, useContext, useState, useEffect } from 'react';
import { evaluationService } from '../services/evaluationService';

export interface InterviewAssignment {
  id: string;
  candidateName: string;
  role: string;
  roundName: string;
  interviewerName: string;
  interviewerAvatar?: string;
  duration: number;
  date: string;
  pstTimeSlot: string;
  meetingLink: string;
  roomName: string;
  status: 'PENDING_EVALUATION' | 'EVALUATED';
  decision?: 'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE';
  rating?: number;
  strengths?: string;
  growthAreas?: string;
  notes?: string;
  isNudged?: boolean;
  submittedAt?: string;
}

export interface CoordinationMessage {
  id: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  recipientRole: 'COORDINATOR' | 'INTERVIEWER' | 'CANDIDATE' | 'ALL';
  subject: string;
  body: string;
  timestamp: string;
  type: 'INVITE' | 'NUDGE' | 'SCHEDULE_CONFIRMATION' | 'RESCHEDULE_REQUEST' | 'DIRECT';
  isRead: boolean;
  status: 'DELIVERED' | 'READ' | 'PENDING';
}

const INITIAL_MESSAGES: CoordinationMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Emma Watson',
    senderRole: 'Lead Coordinator',
    recipientName: 'Marcus Vance',
    recipientRole: 'CANDIDATE',
    subject: 'Welcome to Google SDE Technical Loop — Schedule Confirmation',
    body: 'Hi Marcus, your technical interview timetable has been confirmed across 3 rounds. All virtual meeting links and preparation packets are attached.',
    timestamp: 'Today, 9:00 AM',
    type: 'SCHEDULE_CONFIRMATION',
    isRead: false,
    status: 'DELIVERED'
  },
  {
    id: 'msg-2',
    senderName: 'Emma Watson',
    senderRole: 'Lead Coordinator',
    recipientName: 'Dr. Sarah Chen',
    recipientRole: 'INTERVIEWER',
    subject: 'Urgent: Scorecard Evaluation Needed for Marcus Vance',
    body: 'Hi Sarah, please complete your scorecard evaluation for Marcus Vance (Round 1: Problem Solving & DSA Screen) to unblock loop advancement.',
    timestamp: 'Today, 10:30 AM',
    type: 'NUDGE',
    isRead: false,
    status: 'DELIVERED'
  },
  {
    id: 'msg-3',
    senderName: 'Emma Watson',
    senderRole: 'Lead Coordinator',
    recipientName: 'Claire Pritchett',
    recipientRole: 'INTERVIEWER',
    subject: 'New Panel Assignment: Product Design Onsite with Marcus Vance',
    body: 'Hi Claire, you have been assigned as the Bar Raiser for Marcus Vance. The session is scheduled for 9:00 AM – 9:45 AM PST in Virtual Pod Alpha.',
    timestamp: 'Today, 11:15 AM',
    type: 'INVITE',
    isRead: true,
    status: 'READ'
  }
];

export interface SavedScheduleSession {
  id: string;
  title: string;
  interviewer: string;
  interviewerAvatar: string;
  interviewerRole: string;
  pstTimeSlot: string;
  pstRowHour: number;
  durationMins: number;
  room: string;
  type: 'design' | 'values' | 'presentation' | 'bar_raiser';
  meetingLink?: string;
}

export interface SavedScheduleState {
  scheduleApplied: boolean;
  selectedOption: 'A' | 'B' | 'C';
  activeSessions: SavedScheduleSession[];
  currentDateIndex: number;
  lastUpdated?: string;
}

const DEFAULT_SESSIONS_OPTION_A: SavedScheduleSession[] = [
  {
    id: 'sess-1',
    title: 'Design Exercise 1 & Domain Screen',
    interviewer: 'Claire Pritchett',
    interviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    interviewerRole: 'Principal Designer & Bar Raiser',
    pstTimeSlot: '9:00 AM – 9:45 AM PST',
    pstRowHour: 9,
    durationMins: 45,
    room: 'Virtual Pod Alpha',
    type: 'design'
  },
  {
    id: 'sess-2',
    title: 'Executive Calibration & Values',
    interviewer: 'Phil Dunphy',
    interviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    interviewerRole: 'Senior Product Manager',
    pstTimeSlot: '10:00 AM – 10:45 AM PST',
    pstRowHour: 10,
    durationMins: 45,
    room: 'Virtual Pod Gamma',
    type: 'values'
  },
  {
    id: 'sess-3',
    title: 'System Architecture Assessment',
    interviewer: 'Manny Delgado',
    interviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    interviewerRole: 'Staff Systems Architect',
    pstTimeSlot: '11:00 AM – 12:00 PM PST',
    pstRowHour: 11,
    durationMins: 60,
    room: 'Conference Suite 402',
    type: 'presentation'
  }
];

const INITIAL_ASSIGNMENTS: InterviewAssignment[] = [
  {
    id: 'inv-101',
    candidateName: 'Marcus Vance',
    role: 'B.Tech CSE (Reg: 20214012)',
    roundName: 'Round 1: Problem Solving & DSA Screen',
    interviewerName: 'Dr. Sarah Chen',
    duration: 60,
    date: 'Today, Oct 26',
    pstTimeSlot: '10:00 AM – 11:00 AM IST',
    meetingLink: 'https://meet.google.com/chk-dist-sys',
    roomName: 'CCF Lab 1 (Terminal 12)',
    status: 'PENDING_EVALUATION',
    isNudged: true
  },
  {
    id: 'inv-102',
    candidateName: 'Priya Sharma',
    role: 'B.Tech IT (Reg: 20214088)',
    roundName: 'Round 2: Distributed Storage & Raft Consensus',
    interviewerName: 'Phil Dunphy',
    duration: 60,
    date: 'Tomorrow, Oct 27',
    pstTimeSlot: '2:00 PM – 3:00 PM IST',
    meetingLink: 'https://meet.google.com/chk-raft-cons',
    roomName: 'LHC Seminar Hall A',
    status: 'PENDING_EVALUATION',
    isNudged: false
  },
  {
    id: 'inv-103',
    candidateName: 'Rahul Verma',
    role: 'B.Tech ECE (Reg: 20215045)',
    roundName: 'Round 1: Fault Tolerance & Core Algorithms',
    interviewerName: 'Dr. Sarah Chen',
    duration: 45,
    date: 'Thursday, Oct 29',
    pstTimeSlot: '11:00 AM – 11:45 AM IST',
    meetingLink: 'https://meet.google.com/chk-dr-eval',
    roomName: 'CCF Lab 2 (Terminal 08)',
    status: 'EVALUATED',
    decision: 'STRONG_HIRE',
    rating: 5,
    strengths: 'Outstanding grasp of distributed consensus and fault-tolerant algorithms.',
    submittedAt: 'Yesterday'
  }
];

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
  assignments: InterviewAssignment[];
  scheduleState: SavedScheduleState;
  acceptInvite: () => void;
  confirmSlots: () => void;
  submitScorecard: (decision: string, rating: number) => void;
  nudgeInterviewer: () => void;
  clearNudge: () => void;
  resetFlow: () => void;
  // Assignment methods
  submitScorecardForAssignment: (
    assignmentId: string, 
    decision: 'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE', 
    rating: number, 
    strengths?: string, 
    growthAreas?: string
  ) => void;
  nudgeAssignment: (assignmentId: string) => void;
  createAndSendAssignment: (newAssignment: {
    candidateName: string;
    role: string;
    roundName: string;
    interviewerName: string;
    duration?: number;
    date?: string;
    pstTimeSlot?: string;
    roomName?: string;
    notes?: string;
  }) => InterviewAssignment;
  // Schedule state persistence
  updateScheduleState: (partial: Partial<SavedScheduleState>) => void;
  // Messages & Tripartite Communications
  messages: CoordinationMessage[];
  sendMessage: (msg: {
    senderName?: string;
    senderRole?: string;
    recipientName: string;
    recipientRole: 'COORDINATOR' | 'INTERVIEWER' | 'CANDIDATE' | 'ALL';
    subject: string;
    body: string;
    type?: 'INVITE' | 'NUDGE' | 'SCHEDULE_CONFIRMATION' | 'RESCHEDULE_REQUEST' | 'DIRECT';
  }) => CoordinationMessage;
  markMessageAsRead: (id: string) => void;
  dispatchSchedule: (candidateName: string, candidateEmail: string, sessions: SavedScheduleSession[]) => void;
  requestReschedule: (candidateName: string, roundName: string, reason: string) => void;
  resolveRescheduleRequest: (messageId: string, resolution?: {
    candidateName?: string;
    roundName?: string;
    newTimeSlot?: string;
    newRoom?: string;
    newDayIndex?: number;
    newPstHour?: number;
  }) => void;
  isDemoMode?: boolean;
}

const CoordinationContext = createContext<CoordinationState | undefined>(undefined);

export interface CoordinationProviderProps {
  children: React.ReactNode;
  isDemoMode?: boolean;
  userId?: string;
  currentUser?: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
}

export const CoordinationProvider: React.FC<CoordinationProviderProps> = ({ 
  children,
  isDemoMode = false,
  userId = 'default',
  currentUser = null
}) => {
  const STORAGE_KEY = isDemoMode ? 'chakravyuh_demo_coordination_state' : `chakravyuh_live_coord_${userId}`;
  const SCHEDULE_STORAGE_KEY = isDemoMode ? 'chakravyuh_demo_schedule_state' : `chakravyuh_live_sched_${userId}`;
  const MESSAGES_STORAGE_KEY = isDemoMode ? 'chakravyuh_demo_messages' : `chakravyuh_live_msgs_${userId}`;
  const [isInviteAccepted, setIsInviteAccepted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).isInviteAccepted ?? false;
      return isDemoMode ? true : false;
    } catch {
      return isDemoMode ? true : false;
    }
  });

  const [areSlotsConfirmed, setAreSlotsConfirmed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).areSlotsConfirmed ?? false;
      return isDemoMode ? true : false;
    } catch {
      return isDemoMode ? true : false;
    }
  });

  const [assignments, setAssignments] = useState<InterviewAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.assignments)) {
          return parsed.assignments;
        }
      }
      return isDemoMode ? INITIAL_ASSIGNMENTS : [];
    } catch {
      return isDemoMode ? INITIAL_ASSIGNMENTS : [];
    }
  });

  const [scheduleState, setScheduleState] = useState<SavedScheduleState>(() => {
    try {
      const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.activeSessions)) {
          return parsed;
        }
      }
      return isDemoMode ? {
        scheduleApplied: true,
        selectedOption: 'A',
        activeSessions: DEFAULT_SESSIONS_OPTION_A,
        currentDateIndex: 0
      } : {
        scheduleApplied: false,
        selectedOption: 'A',
        activeSessions: [],
        currentDateIndex: 0
      };
    } catch {
      return isDemoMode ? {
        scheduleApplied: true,
        selectedOption: 'A',
        activeSessions: DEFAULT_SESSIONS_OPTION_A,
        currentDateIndex: 0
      } : {
        scheduleApplied: false,
        selectedOption: 'A',
        activeSessions: [],
        currentDateIndex: 0
      };
    }
  });

  // Backward compatible flags derived from Marcus Vance's assignment
  const marcusAssignment = assignments.find(a => a.id === 'inv-101' || a.candidateName.includes('Marcus'));
  const isScorecardSubmitted = marcusAssignment?.status === 'EVALUATED';
  const interviewerDecision = marcusAssignment?.decision || 'STRONG_HIRE';
  const interviewerRating = marcusAssignment?.rating || 5;
  const isNudged = marcusAssignment?.isNudged ?? true;

  // Persist coordination state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isInviteAccepted,
        areSlotsConfirmed,
        assignments
      }));
    } catch (e) {
      console.error('Failed to sync coordination state', e);
    }
  }, [isInviteAccepted, areSlotsConfirmed, assignments]);

  // Persist schedule state
  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(scheduleState));
    } catch (e) {
      console.error('Failed to sync schedule state', e);
    }
  }, [scheduleState]);

  const updateScheduleState = (partial: Partial<SavedScheduleState>) => {
    setScheduleState(prev => ({
      ...prev,
      ...partial,
      lastUpdated: new Date().toISOString()
    }));
  };

  const acceptInvite = () => {
    setIsInviteAccepted(true);
  };

  const confirmSlots = () => {
    setAreSlotsConfirmed(true);
  };

  const submitScorecardForAssignment = (
    assignmentId: string,
    decision: 'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE',
    rating: number,
    strengths?: string,
    growthAreas?: string
  ) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (target) {
      evaluationService.submit({
        interview_id: assignmentId,
        candidate_id: target.id,
        candidate_name: target.candidateName,
        interviewer_name: target.interviewerName,
        round_name: target.roundName,
        decision,
        rating,
        strengths,
        growth_areas: growthAreas,
        notes: 'Submitted via interviewer evaluation portal'
      }).catch(err => console.error('Failed to save evaluation to SQLite', err));
    }

    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: 'EVALUATED',
          decision,
          rating,
          strengths: strengths || a.strengths,
          growthAreas: growthAreas || a.growthAreas,
          isNudged: false,
          submittedAt: 'Just now'
        };
      }
      return a;
    }));
  };

  const submitScorecard = (decision: string, rating: number) => {
    // Marcus Vance submission backward compatibility
    submitScorecardForAssignment(
      'inv-101', 
      decision as any, 
      rating, 
      'Excellent problem decomposition, clean graph traversal implementation, and optimal time complexity analysis.'
    );
  };

  const nudgeAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          isNudged: true,
          status: 'PENDING_EVALUATION'
        };
      }
      return a;
    }));
  };

  const nudgeInterviewer = () => {
    nudgeAssignment('inv-101');
  };

  const clearNudge = () => {
    setAssignments(prev => prev.map(a => a.id === 'inv-101' ? { ...a, isNudged: false } : a));
  };

  const createAndSendAssignment = (newAssignment: {
    candidateName: string;
    role: string;
    roundName: string;
    interviewerName: string;
    duration?: number;
    date?: string;
    pstTimeSlot?: string;
    roomName?: string;
    notes?: string;
  }): InterviewAssignment => {
    const created: InterviewAssignment = {
      id: `inv-${Date.now()}`,
      candidateName: newAssignment.candidateName,
      role: newAssignment.role,
      roundName: newAssignment.roundName,
      interviewerName: newAssignment.interviewerName,
      duration: newAssignment.duration || 45,
      date: newAssignment.date || 'Today, Oct 26',
      pstTimeSlot: newAssignment.pstTimeSlot || '3:30 PM – 4:15 PM IST',
      meetingLink: 'https://meet.google.com/chk-' + Math.random().toString(36).substring(2, 7),
      roomName: newAssignment.roomName || 'Virtual Pod Alpha',
      status: 'PENDING_EVALUATION',
      isNudged: true, // Marked urgent so interviewer immediately sees it
      notes: newAssignment.notes
    };

    setAssignments(prev => [created, ...prev]);
    return created;
  };

  const [messages, setMessages] = useState<CoordinationMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return isDemoMode ? INITIAL_MESSAGES : [];
    } catch {
      return isDemoMode ? INITIAL_MESSAGES : [];
    }
  });

  // Re-sync state when switching between live and demo sandbox modes
  useEffect(() => {
    try {
      const savedCoord = localStorage.getItem(STORAGE_KEY);
      if (savedCoord) {
        const parsed = JSON.parse(savedCoord);
        setAssignments(Array.isArray(parsed.assignments) ? parsed.assignments : (isDemoMode ? INITIAL_ASSIGNMENTS : []));
        setIsInviteAccepted(parsed.isInviteAccepted ?? (isDemoMode ? true : false));
        setAreSlotsConfirmed(parsed.areSlotsConfirmed ?? (isDemoMode ? true : false));
      } else {
        setAssignments(isDemoMode ? INITIAL_ASSIGNMENTS : []);
        setIsInviteAccepted(isDemoMode ? true : false);
        setAreSlotsConfirmed(isDemoMode ? true : false);
      }

      const savedSched = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (savedSched) {
        setScheduleState(JSON.parse(savedSched));
      } else {
        setScheduleState(isDemoMode ? {
          scheduleApplied: true,
          selectedOption: 'A',
          activeSessions: DEFAULT_SESSIONS_OPTION_A,
          currentDateIndex: 0
        } : {
          scheduleApplied: false,
          selectedOption: 'A',
          activeSessions: [],
          currentDateIndex: 0
        });
      }

      const savedMsgs = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs));
      } else {
        setMessages(isDemoMode ? INITIAL_MESSAGES : []);
      }
    } catch (e) {
      console.error('Failed to sync demo/live mode', e);
    }
  }, [isDemoMode, userId, STORAGE_KEY, SCHEDULE_STORAGE_KEY, MESSAGES_STORAGE_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to sync messages', e);
    }
  }, [messages]);

  const sendMessage = (msg: {
    senderName?: string;
    senderRole?: string;
    recipientName: string;
    recipientRole: 'COORDINATOR' | 'INTERVIEWER' | 'CANDIDATE' | 'ALL';
    subject: string;
    body: string;
    type?: 'INVITE' | 'NUDGE' | 'SCHEDULE_CONFIRMATION' | 'RESCHEDULE_REQUEST' | 'DIRECT';
  }): CoordinationMessage => {
    const newMsg: CoordinationMessage = {
      id: `msg-${Date.now()}`,
      senderName: msg.senderName || 'Emma Watson',
      senderRole: msg.senderRole || 'Lead Coordinator',
      recipientName: msg.recipientName,
      recipientRole: msg.recipientRole,
      subject: msg.subject,
      body: msg.body,
      timestamp: 'Just now',
      type: msg.type || 'DIRECT',
      isRead: false,
      status: 'DELIVERED',
    };
    setMessages(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true, status: 'READ' as const } : m));
  };

  const dispatchSchedule = (candidateName: string, _candidateEmail: string, sessions: SavedScheduleSession[]) => {
    setScheduleState(prev => ({
      ...prev,
      scheduleApplied: true,
      activeSessions: sessions
    }));

    const newAssignments: InterviewAssignment[] = sessions.map((sess, idx) => ({
      id: `inv-dispatch-${Date.now()}-${idx}`,
      candidateName,
      role: 'Product Design Onsite',
      roundName: sess.title,
      interviewerName: sess.interviewer,
      duration: sess.durationMins,
      date: 'Saturday, May 18',
      pstTimeSlot: sess.pstTimeSlot,
      meetingLink: `https://meet.google.com/chk-${sess.room.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      roomName: sess.room,
      status: 'PENDING_EVALUATION',
      isNudged: idx === 0
    }));

    setAssignments(prev => [...newAssignments, ...prev]);

    const candidateMsg: CoordinationMessage = {
      id: `msg-${Date.now()}-cand`,
      senderName: 'Emma Watson',
      senderRole: 'Lead Coordinator',
      recipientName: candidateName,
      recipientRole: 'CANDIDATE',
      subject: `Official Timetable Confirmation: ${candidateName} — Product Design Onsite`,
      body: `Your interview loop has been confirmed with ${sessions.map(s => s.interviewer).join(', ')}. All calendar invites and meeting links are active in your portal.`,
      timestamp: 'Just now',
      type: 'SCHEDULE_CONFIRMATION',
      isRead: false,
      status: 'DELIVERED'
    };

    const interviewerMsgs: CoordinationMessage[] = sessions.map((sess, i) => ({
      id: `msg-${Date.now()}-int-${i}`,
      senderName: 'Emma Watson',
      senderRole: 'Lead Coordinator',
      recipientName: sess.interviewer,
      recipientRole: 'INTERVIEWER',
      subject: `Calendar Invite: ${sess.title} with ${candidateName}`,
      body: `You are scheduled to interview ${candidateName} for ${sess.title} (${sess.pstTimeSlot}) in ${sess.room}. Please review the candidate dossier in your workspace.`,
      timestamp: 'Just now',
      type: 'INVITE',
      isRead: false,
      status: 'DELIVERED'
    }));

    setMessages(prev => [candidateMsg, ...interviewerMsgs, ...prev]);
  };

  const requestReschedule = (candName: string, roundName: string, reason: string) => {
    const rescheduleMsg: CoordinationMessage = {
      id: `msg-resched-${Date.now()}`,
      senderName: candName,
      senderRole: 'Candidate',
      recipientName: 'Emma Watson',
      recipientRole: 'COORDINATOR',
      subject: `Reschedule Requested: ${candName} — ${roundName}`,
      body: `Reason: ${reason}. Please evaluate alternate zero-conflict time slots via CP-SAT engine.`,
      timestamp: 'Just now',
      type: 'RESCHEDULE_REQUEST',
      isRead: false,
      status: 'DELIVERED'
    };
    setMessages(prev => [rescheduleMsg, ...prev]);
  };

  const resolveRescheduleRequest = (
    messageId: string,
    resolution?: {
      candidateName?: string;
      roundName?: string;
      newTimeSlot?: string;
      newRoom?: string;
      newDayIndex?: number;
      newPstHour?: number;
    }
  ) => {
    const target = messages.find(m => m.id === messageId);
    const candName = resolution?.candidateName || target?.senderName || 'Marcus Vance';
    const roundName = resolution?.roundName || 'Design Exercise 1 & Domain Screen';
    const slot = resolution?.newTimeSlot || 'Tuesday, Oct 27 • 2:00 PM – 2:45 PM PST';
    const room = resolution?.newRoom || 'Virtual Pod Alpha';

    const confirmationMsg: CoordinationMessage = {
      id: `msg-resolved-${Date.now()}`,
      senderName: 'Emma Watson',
      senderRole: 'Lead Coordinator',
      recipientName: candName,
      recipientRole: 'CANDIDATE',
      subject: `Reschedule Approved: ${roundName}`,
      body: `CP-SAT constraint solver evaluated minimal-churn alternate slots and reallocated: ${slot} in ${room}. Zero conflicts detected across evaluator calendars.`,
      timestamp: 'Just now',
      type: 'SCHEDULE_CONFIRMATION',
      isRead: false,
      status: 'DELIVERED'
    };

    setMessages(prev => [confirmationMsg, ...prev.filter(m => m.id !== messageId)]);

    // Update active sessions in scheduleState if applicable
    setScheduleState(prev => {
      const updatedSessions = (prev.activeSessions || []).map(sess => {
        if (
          sess.title.toLowerCase().includes('design') || 
          sess.id === 'sess-1' || 
          sess.title.toLowerCase().includes(roundName.toLowerCase())
        ) {
          return {
            ...sess,
            pstTimeSlot: slot,
            pstRowHour: resolution?.newPstHour ?? 14,
            room: room
          };
        }
        return sess;
      });
      const newState = {
        ...prev,
        activeSessions: updatedSessions,
        lastUpdated: new Date().toISOString()
      };
      try {
        localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error(e);
      }
      return newState;
    });
  };

  const resetFlow = () => {
    setIsInviteAccepted(false);
    setAreSlotsConfirmed(false);
    setAssignments(INITIAL_ASSIGNMENTS);
  };

  const effectiveCandidateName = isDemoMode 
    ? 'Marcus Vance' 
    : (currentUser?.role === 'CANDIDATE' ? currentUser.full_name : 'Candidate');

  const effectiveCandidateReg = isDemoMode
    ? '20214012 (B.Tech CSE)'
    : (currentUser?.role === 'CANDIDATE' ? currentUser.email : 'Pipeline Candidate');

  const effectiveDriveName = isDemoMode
    ? 'Google SDE Campus Placement Drive 2026'
    : 'Active Placement Drive';

  const effectiveInviteCode = isDemoMode
    ? 'google-sde-marcus'
    : '';

  return (
    <CoordinationContext.Provider value={{
      candidateName: effectiveCandidateName,
      candidateReg: effectiveCandidateReg,
      driveName: effectiveDriveName,
      inviteCode: effectiveInviteCode,
      isInviteAccepted,
      areSlotsConfirmed,
      isScorecardSubmitted,
      interviewerDecision,
      interviewerRating,
      isNudged,
      assignments,
      scheduleState,
      messages,
      sendMessage,
      markMessageAsRead,
      dispatchSchedule,
      requestReschedule,
      resolveRescheduleRequest,
      acceptInvite,
      confirmSlots,
      submitScorecard,
      nudgeInterviewer,
      clearNudge,
      resetFlow,
      submitScorecardForAssignment,
      nudgeAssignment,
      createAndSendAssignment,
      updateScheduleState,
      isDemoMode
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
