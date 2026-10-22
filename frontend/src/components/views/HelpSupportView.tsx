import { 
  Command, 
  Cpu 
} from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#eaecf0]">
        <h1 className="text-xl font-bold text-[#101828]">Help & Documentation</h1>
        <p className="text-xs text-[#667085] mt-1">
          Chakravyuh optimization mechanics, keyboard shortcuts, and coordinator guides.
        </p>
      </div>

      <div className="p-8 max-w-4xl space-y-6 text-xs">
        
        {/* Keyboard Shortcuts */}
        <div className="p-6 rounded-xl border border-[#eaecf0] bg-white shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-[#1668e8]" />
            <h3 className="font-bold text-sm text-[#101828]">Quick Navigation Shortcuts</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

      </div>

    </div>
  );
};
