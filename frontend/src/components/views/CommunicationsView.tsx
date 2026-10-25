import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Check, 
  X,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Video,
  UserCheck
} from 'lucide-react';
import { useTimezone } from '../../context/TimezoneContext';
import { AvatarBadge } from '../common/AvatarBadge';
import { useCoordination } from '../../context/CoordinationContext';

interface CommunicationsViewProps {
  onGoToScheduling: () => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({ onGoToScheduling }) => {
  const { currentTimezone, convertTime } = useTimezone();
  const { 
    candidateName, 
    scheduleState, 
    dispatchSchedule, 
    messages, 
    sendMessage 
  } = useCoordination();

  const activeCandidateName = candidateName || 'Marcus Vance';
  const candidateEmail = 'marcus.vance@gmail.com';

  // Derive panel members from currently active schedule sessions
  const initialPanelCC = useMemo(() => {
    if (scheduleState?.activeSessions && scheduleState.activeSessions.length > 0) {
      return scheduleState.activeSessions.map(s => ({
        name: s.interviewer,
        role: s.interviewerRole,
        email: `${s.interviewer.toLowerCase().replace(/[^a-z]/g, '.')}@chakravyuh.ai`
      }));
    }
    return [
      { name: 'Claire Pritchett', role: 'Principal Designer & Bar Raiser', email: 'claire@chakravyuh.ai' },
      { name: 'Phil Dunphy', role: 'Senior Product Manager', email: 'phil@chakravyuh.ai' },
      { name: 'Manny Delgado', role: 'Staff Systems Architect', email: 'manny@chakravyuh.ai' }
    ];
  }, [scheduleState?.activeSessions]);

  const [ccList, setCcList] = useState(initialPanelCC);
  const [showBcc, setShowBcc] = useState(false);
  const [bccList, setBccList] = useState<string[]>(['recruiting-ops@chakravyuh.ai']);
  const [newBccInput, setNewBccInput] = useState('');
  const [sent, setSent] = useState(false);
  const [sentInternal, setSentInternal] = useState(false);
  const [saveTemplate, setSaveTemplate] = useState(true);

  // Email fields
  const [subject, setSubject] = useState(
    `Chakravyuh | Confirmed Interview Schedule for ${activeCandidateName} | Product Design Onsite`
  );

  const initialBody = useMemo(() => {
    const sessions = scheduleState?.activeSessions || [];
    const sessionsList = sessions.map((s, idx) => 
      `• Round ${idx + 1}: ${s.title} — ${convertTime(s.pstTimeSlot)} (Interviewer: ${s.interviewer}, Room: ${s.room})`
    ).join('\n');

    return `Hi ${activeCandidateName.split(' ')[0]},\n\nWe are pleased to confirm your upcoming interview loops with the Chakravyuh evaluation panel!\n\nYour confirmed sessions (viewing in ${currentTimezone.label}):\n${sessionsList || '• All rounds confirmed via CP-SAT zero-conflict optimization.'}\n\nAll Google Meet links and calendar invitations are attached below. If you need any accommodations or have schedule changes, you can request an instant reschedule from your candidate portal.\n\nBest regards,\nEmma Watson\nLead Coordinator, Chakravyuh Scheduling`;
  }, [activeCandidateName, currentTimezone.label, convertTime, scheduleState?.activeSessions]);

  const [body, setBody] = useState(initialBody);

  const removeCc = (name: string) => {
    setCcList(ccList.filter(c => c.name !== name));
  };

  const addBcc = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newBccInput.trim()) {
      e.preventDefault();
      if (!bccList.includes(newBccInput.trim())) {
        setBccList([...bccList, newBccInput.trim()]);
      }
      setNewBccInput('');
    }
  };

  const removeBcc = (email: string) => {
    setBccList(bccList.filter(b => b !== email));
  };

  const handleFinishAndSend = () => {
    const sessions = scheduleState?.activeSessions || [];
    dispatchSchedule(activeCandidateName, candidateEmail, sessions);
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  const handleSendInternalOnly = () => {
    ccList.forEach(cc => {
      sendMessage({
        senderName: 'Emma Watson',
        senderRole: 'Lead Coordinator',
        recipientName: cc.name,
        recipientRole: 'INTERVIEWER',
        subject: `Internal Panel Briefing: ${activeCandidateName} Onsite Loop`,
        body: `Hi ${cc.name.split(' ')[0]}, please review the candidate packet for ${activeCandidateName}. You are confirmed on the evaluation panel.`,
        type: 'INVITE'
      });
    });
    setSentInternal(true);
    setTimeout(() => setSentInternal(false), 5000);
  };

  // Recent coordinator sent communications
  const recentDispatches = messages.filter(
    m => m.senderName === 'Emma Watson' || m.type === 'SCHEDULE_CONFIRMATION' || m.type === 'INVITE'
  );

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="px-6 py-4 border-b border-[#eaecf0] bg-white shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] uppercase tracking-wider">
                Tripartite Dispatch Engine
              </span>
              <span className="text-xs text-[#667085]">
                • Automated Calendar Invites, Google Meet Holds & Candidate Notice
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#101828] mt-1.5 tracking-tight">
              Dispatching Timetable for <span className="text-[#1668e8]">{activeCandidateName}</span>
            </h1>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button 
            onClick={onGoToScheduling}
            className="flex items-center gap-1.5 pb-3 text-[#667085] hover:text-[#101828] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find a schedule</span>
            <span className="text-[#98a2b3] ml-1">&gt;</span>
          </button>
          <button className="flex items-center gap-1.5 pb-3 text-[#1668e8] border-b-2 border-[#1668e8] font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications Hub</span>
          </button>
        </div>
      </div>

      {/* Dispatched Banners */}
      {sent && (
        <div className="mx-6 mt-4 p-4 rounded-2xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center justify-between animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#0b7c3e]" />
            </div>
            <div>
              <span className="block font-bold text-sm text-[#065f46]">
                Tripartite Loop Dispatched Successfully!
              </span>
              <span className="text-xs font-normal text-[#065f46]">
                Candidate confirmation emailed to {candidateEmail} and calendar holds placed for {ccList.length} panel members in {currentTimezone.shortName}.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white border border-[#abefc6] shadow-2xs">
            LIVE SYNCED
          </span>
        </div>
      )}

      {sentInternal && (
        <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#175cd3] shrink-0" />
          <span>Internal panel briefing sent to {ccList.map(c => c.name).join(', ')} without notifying candidate.</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto w-full">
          
          {/* Left Column: Email Composer (8 Cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#101828] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1668e8]" />
                Official Candidate Invitation
              </h2>
              <span className="text-xs text-[#667085]">
                {scheduleState?.activeSessions?.length || 3} Confirmed Sessions
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Candidate Email Input */}
              <div className="p-4 bg-white rounded-2xl border border-[#eaecf0] shadow-2xs space-y-1.5">
                <label className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
                  Candidate Email & Recipient
                </label>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <AvatarBadge name={activeCandidateName} size="sm" />
                    <span className="text-xs font-bold text-[#101828] truncate">{activeCandidateName}</span>
                    <span className="text-xs text-[#667085] truncate">&lt;{candidateEmail}&gt;</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0b7c3e] bg-[#ecfdf3] px-2.5 py-0.5 rounded-full border border-[#abefc6] shrink-0">
                    Verified Contact
                  </span>
                </div>
              </div>

              {/* CC Input with Chips */}
              <div className="p-4 bg-white rounded-2xl border border-[#eaecf0] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
                    Assigned Panelists & Calendar Invites (CC)
                  </label>
                  {!showBcc && (
                    <button 
                      type="button"
                      onClick={() => setShowBcc(true)}
                      className="text-xs font-semibold text-[#1668e8] hover:underline"
                    >
                      + Add BCC
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ccList.map((cc) => (
                    <span 
                      key={cc.name}
                      className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-[#f2f4f7] text-xs font-medium text-[#344054] border border-[#eaecf0]"
                    >
                      <AvatarBadge name={cc.name} size="xs" />
                      <span>{cc.name}</span>
                      <button 
                        type="button"
                        onClick={() => removeCc(cc.name)} 
                        className="text-[#98a2b3] hover:text-[#101828] ml-0.5"
                        title="Remove from CC"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* BCC Section */}
              {showBcc && (
                <div className="p-4 bg-white rounded-2xl border border-[#eaecf0] shadow-2xs space-y-2 animate-in fade-in">
                  <label className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
                    BCC (Operations Ledger)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {bccList.map((bcc) => (
                      <span 
                        key={bcc}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fafafa] text-xs text-[#344054] border border-[#d0d5dd]"
                      >
                        <span>{bcc}</span>
                        <button 
                          type="button"
                          onClick={() => removeBcc(bcc)} 
                          className="text-[#98a2b3] hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="email"
                      placeholder="Type email & press Enter..."
                      value={newBccInput}
                      onChange={(e) => setNewBccInput(e.target.value)}
                      onKeyDown={addBcc}
                      className="text-xs border-none outline-none focus:ring-0 p-1 min-w-[180px] text-[#101828] placeholder-[#98a2b3]"
                    />
                  </div>
                </div>
              )}

              {/* Candidate Confirmation Email Body Box */}
              <div className="p-5 bg-white rounded-2xl border border-[#eaecf0] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#344054]">
                    Invitation Content
                  </span>
                  <span className="text-[10px] text-[#667085] bg-[#f2f4f7] px-2.5 py-0.5 rounded-full font-semibold">
                    Markdown & Timezone Aware
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#667085] block">
                    Subject Line
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs font-medium text-[#101828] border border-[#d0d5dd] rounded-xl p-2.5 focus:outline-none focus:border-[#1668e8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#667085] block">
                    Email Body (Auto-converted into {currentTimezone.label})
                  </label>
                  <textarea 
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full text-xs text-[#344054] leading-relaxed border border-[#d0d5dd] rounded-xl p-3 font-sans focus:outline-none focus:border-[#1668e8]"
                  />
                </div>
              </div>

            </div>

            {/* Dispatched Communications & Coordination Audit Ledger */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#475467] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dispatched Communications Ledger ({recentDispatches.length})</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Audit Bus
                </span>
              </div>

              <div className="bg-white border border-[#eaecf0] rounded-2xl divide-y divide-[#f2f4f7] shadow-2xs overflow-hidden">
                {recentDispatches.map((msg) => (
                  <div key={msg.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f9fafb] transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          msg.recipientRole === 'CANDIDATE' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          To {msg.recipientRole}: {msg.recipientName}
                        </span>
                        <span className="text-[11px] text-[#667085] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {msg.timestamp}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#101828] truncate">
                        {msg.subject}
                      </h4>
                      <p className="text-[11px] text-[#475467] line-clamp-1">
                        {msg.body}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Review & Finish (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6 pt-2">
            <div className="p-6 bg-white rounded-2xl border border-[#eaecf0] shadow-2xs space-y-6">
              <h3 className="text-sm font-bold text-[#101828]">Review & Deliver</h3>

              {/* To Candidate */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                  To Candidate ({activeCandidateName.split(' ')[0]})
                </h4>
                <div className="flex items-center gap-2 text-[#344054]">
                  <Mail className="w-4 h-4 text-[#667085] shrink-0" />
                  <span className="truncate font-medium">{subject}</span>
                </div>
                <div className="flex items-center gap-2 text-[#344054]">
                  <Video className="w-4 h-4 text-[#1668e8] shrink-0" />
                  <span className="font-medium">Direct Google Meet links generated</span>
                </div>
              </div>

              {/* Internal */}
              <div className="space-y-2 text-xs pt-3 border-t border-[#f2f4f7]">
                <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                  Internal Panel Sync
                </h4>
                <div className="flex items-center gap-2 text-[#344054]">
                  <Calendar className="w-4 h-4 text-[#667085] shrink-0" />
                  <span className="font-medium">
                    {scheduleState?.activeSessions?.length || 3} Google Calendar holds reserved
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#344054]">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{ccList.length} Interviewers assigned</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-[#eaecf0]">
                <button 
                  type="button"
                  onClick={handleSendInternalOnly}
                  className="w-full py-2.5 px-4 rounded-full border border-[#d0d5dd] hover:bg-[#f9fafb] text-xs font-semibold text-[#344054] transition-colors"
                >
                  Send internal only (Briefing)
                </button>

                <button 
                  type="button"
                  onClick={handleFinishAndSend}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
                >
                  {sent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Dispatched & Synced!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Finish & send invitations</span>
                    </>
                  )}
                </button>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-xs text-[#475467] cursor-pointer pt-2">
                <input 
                  type="checkbox" 
                  checked={saveTemplate}
                  onChange={(e) => setSaveTemplate(e.target.checked)}
                  className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" 
                />
                <span>Save template to job profile</span>
              </label>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
