import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Check, 
  X,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useTimezone } from '../../context/TimezoneContext';

import { AvatarBadge } from '../common/AvatarBadge';

interface CommunicationsViewProps {
  onGoToScheduling: () => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({ onGoToScheduling }) => {
  const { currentTimezone, convertTime } = useTimezone();
  const [ccList, setCcList] = useState([
    { name: 'Claire Pritchett', email: 'claire@chakravyuh.ai', avatar: '' },
    { name: 'Gloria Vergara', email: 'gloria@chakravyuh.ai', avatar: '' }
  ]);
  const [showBcc, setShowBcc] = useState(false);
  const [bccList, setBccList] = useState<string[]>(['recruiting-ops@chakravyuh.ai']);
  const [newBccInput, setNewBccInput] = useState('');
  const [sent, setSent] = useState(false);
  const [sentInternal, setSentInternal] = useState(false);
  const [saveTemplate, setSaveTemplate] = useState(true);

  // Email fields
  const [candidateEmail] = useState('zach.buechler@gmail.com');
  const [subject, setSubject] = useState('Chakravyuh | Onsite Interview Schedule for Zach Buechler | Product Designer');
  const [body, setBody] = useState(
    `Hi Zach,\n\nThanks for taking the time to share your availability with us. We are pleased to confirm your upcoming Product Design onsite loop with Chakravyuh!\n\nYour interviews are confirmed for May 18, 2024 (viewing in ${currentTimezone.label}):\n• 1. Design Exercise 1: ${convertTime('9-9:30 am PST')} (Interviewer: Claire Pritchett)\n• 2. Company Values: ${convertTime('9:30-10 am PST')} (Interviewer: Phil Dunphy)\n• 3. Design Presentation: ${convertTime('10-11 am PST')} (Interviewer: Manny Delgado)\n\nAll Google Meet links and calendar invitations are attached. Please reach out if you have any questions!`
  );

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
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const handleSendInternalOnly = () => {
    setSentInternal(true);
    setTimeout(() => setSentInternal(false), 4000);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="px-6 py-4 border-b border-[#eaecf0] bg-white shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] uppercase">
                Ready for Dispatch
              </span>
              <span className="text-xs text-[#667085]">
                • Automated Calendar Invites & Candidate Email
              </span>
            </div>
            <h1 className="text-lg font-semibold text-[#101828] mt-1">
              Scheduled <span className="font-bold">Zach Buechler</span> for <span className="font-bold">Product Design Onsite</span>
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
          <button className="flex items-center gap-1.5 pb-3 text-[#1668e8] border-b-2 border-[#1668e8] font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications</span>
          </button>
        </div>
      </div>

      {/* Dispatched Banners */}
      {sent && (
        <div className="mx-8 mt-4 p-4 rounded-xl bg-[#ecfdf3] text-[#0b7c3e] border border-[#abefc6] text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#0b7c3e]" />
            <div>
              <span className="block font-bold">Candidate Confirmation Email & Calendar Invites Dispatched!</span>
              <span className="text-[11px] font-normal text-[#065f46]">
                Sent to {candidateEmail} and {ccList.length} panel members in {currentTimezone.shortName}.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#abefc6] font-bold">
            DELIVERED
          </span>
        </div>
      )}

      {sentInternal && (
        <div className="mx-8 mt-4 p-3.5 rounded-xl bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#175cd3]" />
          <span>Internal panel briefing sent to {ccList.map(c => c.name).join(', ')} without notifying candidate.</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-12 p-6 gap-6 max-w-6xl w-full">
        
        {/* Left Column: Email Composer (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <h2 className="text-base font-bold text-[#101828]">Email to candidate</h2>

          <div className="space-y-4">
            
            {/* Candidate Email Input */}
            <div className="p-3 bg-[#fafafa] rounded-xl border border-[#eaecf0] space-y-1">
              <label className="text-[11px] font-medium text-[#667085] block">
                Candidate email
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#101828] font-mono">{candidateEmail}</span>
                <span className="text-[11px] font-bold text-[#0b7c3e] bg-[#ecfdf3] px-2 py-0.5 rounded border border-[#abefc6]">
                  Verified Contact
                </span>
              </div>
            </div>

            {/* CC Input with Chips */}
            <div className="p-3 bg-white rounded-xl border border-[#eaecf0] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#667085] block">
                  Panel CC
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
                    className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md bg-[#f2f4f7] text-xs font-medium text-[#344054] border border-[#eaecf0]"
                  >
                    <AvatarBadge name={cc.name} size="xs" />
                    <span>{cc.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeCc(cc.name)} 
                      className="text-[#98a2b3] hover:text-[#101828]"
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
              <div className="p-3 bg-white rounded-xl border border-[#eaecf0] space-y-2 animate-in fade-in">
                <label className="text-[11px] font-medium text-[#667085] block">
                  BCC (Hidden Operations Ledger)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {bccList.map((bcc) => (
                    <span 
                      key={bcc}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#fafafa] text-xs font-mono text-[#344054] border border-[#d0d5dd]"
                    >
                      <span>{bcc}</span>
                      <button 
                        type="button"
                        onClick={() => removeBcc(bcc)} 
                        className="text-[#98a2b3] hover:text-red-500"
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
            <div className="p-4 bg-white rounded-xl border border-[#eaecf0] space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-[#344054] block">
                Candidate confirmation email
              </span>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#667085] block">
                  Subject
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs font-medium text-[#101828] border border-[#d0d5dd] rounded-lg p-2.5 focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#667085] block">
                  Email Body (Converted automatically into {currentTimezone.label})
                </label>
                <textarea 
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full text-xs text-[#344054] leading-relaxed border border-[#d0d5dd] rounded-lg p-3 font-sans focus:outline-none focus:border-[#1668e8]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Review & Finish (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 pt-2">
          <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-[#101828]">Review & Deliver</h3>

            {/* To Candidate */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                To Candidate
              </h4>
              <div className="flex items-center gap-2 text-[#344054]">
                <Mail className="w-4 h-4 text-[#667085] shrink-0" />
                <span className="truncate font-medium">{subject}</span>
              </div>
              <div className="flex items-center gap-2 text-[#344054]">
                <Calendar className="w-4 h-4 text-[#667085] shrink-0" />
                <span className="font-medium">Calendar Event (Google Meet link attached)</span>
              </div>
            </div>

            {/* Internal */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#f2f4f7]">
              <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                Internal Panel Sync
              </h4>
              <div className="flex items-center gap-2 text-[#344054]">
                <Calendar className="w-4 h-4 text-[#667085] shrink-0" />
                <span className="font-medium">3 Google Calendar holds created for panel</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#eaecf0]">
              <button 
                type="button"
                onClick={handleSendInternalOnly}
                className="w-full py-2 px-4 rounded-lg border border-[#d0d5dd] hover:bg-[#f9fafb] text-xs font-semibold text-[#344054] transition-colors"
              >
                Send internal only (Briefing)
              </button>

              <button 
                type="button"
                onClick={handleFinishAndSend}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Finish & send to candidate</span>
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
              <span>Save selected templates to job setup</span>
            </label>

          </div>
        </div>

      </div>

    </div>
  );
};
