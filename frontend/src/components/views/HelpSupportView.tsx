import React, { useState } from 'react';
import { 
  Command, 
  Cpu, 
  HelpCircle, 
  ChevronDown, 
  Sparkles
} from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const faqs = [
    {
      q: 'How does Chakravyuh calculate zero-overlap constraints across panel members?',
      a: 'The engine uses Google OR-Tools CP-SAT Interval Variables with AddNoOverlap constraints. Each interview round creates an interval variable with start time, duration, and end time. CP-SAT guarantees that no candidate, interviewer, or room has concurrent interval overlap.'
    },
    {
      q: 'How do timezones convert when interviewers are in London, Bangalore, and San Francisco?',
      a: 'All availability intervals are stored with UTC offsets. The timezone engine shifts time windows based on the selected viewer timezone. For instance, a 9:00 AM PST slot is automatically shown as 5:00 PM GMT for UK panel members and 10:30 PM IST for India panel members.'
    },
    {
      q: 'What happens during a minimal-churn reschedule when an interviewer calls in sick?',
      a: 'Instead of re-solving the entire candidate loop, Chakravyuh fixes all unaffected interview intervals and runs a minimal-churn delta solve. It relocates only the affected round to the closest available qualified interviewer while preserving already confirmed flights and candidate blocks.'
    },
    {
      q: 'How are shadow and reverse shadow training sessions counted in interviewer limits?',
      a: 'Shadow interviewers are added to the loop as non-voting secondary observers. The system tracks their weekly capacity independently so shadows do not violate burnout limits.'
    }
  ];

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsAsking(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsAsking(false);
      setAiResponse(
        `Based on Chakravyuh CP-SAT engine rules: For "${userQuery}", the solver automatically evaluates hard availability bounds first, ensures room capacity exceeds panel size, and applies soft penalties to idle intervals.`
      );
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#101828]">Help & Documentation</h1>
            <p className="text-xs text-[#667085] mt-1">
              Chakravyuh optimization mechanics, keyboard shortcuts, and coordinator guides.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setAskModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Scheduling AI</span>
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-4xl space-y-6 text-xs">
        
        {/* Keyboard Shortcuts */}
        <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-[#1668e8]" />
            <h3 className="font-bold text-sm text-[#101828]">Quick Navigation Shortcuts</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: '⌘ + K', desc: 'Global quick search for candidate or interviewer' },
              { key: 'OP', desc: 'Jump to Open Requisitions and Jobs' },
              { key: 'S', desc: 'Trigger CP-SAT schedule optimization for active loop' },
              { key: 'C', desc: 'Open candidate communication email composer' }
            ].map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-[#eaecf0] bg-[#fafafa]">
                <span className="text-[#344054] font-medium">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d0d5dd] font-mono font-bold text-[#101828] text-[11px] shadow-2xs">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* How Optimization Works */}
        <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1668e8]" />
            <h3 className="font-bold text-sm text-[#101828]">How Chakravyuh Solves Schedules</h3>
          </div>
          <p className="text-[#475467] leading-relaxed">
            Chakravyuh uses Google OR-Tools CP-SAT (Constraint Programming - Satisfiability) to eliminate manual scheduling spreadsheet hell:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#344054]">
            <li><strong>Hard Constraints:</strong> Zero double-booking of interviewers, guaranteed room capacity, sequential prerequisite round ordering, and strict skill matching.</li>
            <li><strong>Soft Objectives:</strong> Minimizing idle gaps between candidate rounds, equalizing weekly workload across engineering interviewers, and honoring preferred time windows.</li>
            <li><strong>Minimal Churn:</strong> When an interviewer cancels last-minute, the delta solver preserves already confirmed schedules and only relocates affected sessions.</li>
          </ul>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#1668e8]" />
            <h3 className="font-bold text-sm text-[#101828]">Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-[#eaecf0]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-semibold text-[#101828] hover:text-[#1668e8] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#667085] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-[#475467] leading-relaxed text-xs pl-2 border-l-2 border-[#1668e8]">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal: Ask Scheduling AI Assistant */}
      {askModalOpen && (
        <Dialog
          isOpen={askModalOpen}
          onClose={() => setAskModalOpen(false)}
          title="Chakravyuh AI Scheduling Assistant"
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#667085]">
              Ask any question about constraint rules, prerequisite logic, or time zone shifting.
            </p>

            <form onSubmit={handleAskAI} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. How does the solver resolve a situation where candidate availability is only 2 hours?"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg p-2.5 text-xs text-[#101828] focus:border-[#1668e8] outline-none"
              />

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#98a2b3]">Powered by OR-Tools Constraint Intelligence</span>
                <Button type="submit" variant="primary" disabled={isAsking} className="font-bold">
                  {isAsking ? 'Thinking...' : 'Submit Query'}
                </Button>
              </div>
            </form>

            {aiResponse && (
              <div className="p-3.5 bg-[#f0f7ff] rounded-xl border border-[#b2ddff] text-[#175cd3] space-y-1 animate-in fade-in">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1668e8]" /> AI Guidance
                </span>
                <p className="text-xs leading-relaxed text-[#1e40af]">{aiResponse}</p>
              </div>
            )}
          </div>
        </Dialog>
      )}

    </div>
  );
};
