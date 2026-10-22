import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  MessageSquare, 
  ChevronDown, 
  Mail, 
  Calendar, 
  Check, 
  X 
} from 'lucide-react';

interface CommunicationsViewProps {
  onGoToScheduling: () => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({ onGoToScheduling }) => {
  const [ccList, setCcList] = useState([
    { name: 'Claire Pritchett', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
    { name: 'Gloria Vergara', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' }
  ]);
  const [sent, setSent] = useState(false);

  const removeCc = (name: string) => {
    setCcList(ccList.filter(c => c.name !== name));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="px-8 pt-6 pb-2 border-b border-[#eaecf0] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#101828]">
            Scheduled <span className="font-bold">Zach Buechler</span> for <span className="font-bold">Product Design Onsite</span>
          </h1>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-xs font-medium text-[#344054]">
            <Globe className="w-3.5 h-3.5 text-[#667085]" />
            <span>Pacific Standard Time</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085] ml-1" />
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

      {/* Main Two-Column Layout */}
      <div className="flex-1 grid grid-cols-12 p-8 gap-8 max-w-6xl">
        
        {/* Left Column: Email Composer (8 Cols) */}
        <div className="col-span-8 space-y-6">
          <h2 className="text-base font-bold text-[#101828]">Email to candidate</h2>

          <div className="space-y-4">
            
            {/* Candidate Email Input */}
            <div className="p-3 bg-[#fafafa] rounded-xl border border-[#eaecf0] space-y-1">
              <label className="text-[11px] font-medium text-[#667085] block">
                Candidate email
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#101828]">zach@myemail.com</span>
                <ChevronDown className="w-4 h-4 text-[#667085]" />
              </div>
            </div>

            {/* CC Input with Chips */}
            <div className="p-3 bg-white rounded-xl border border-[#eaecf0] space-y-2">
              <label className="text-[11px] font-medium text-[#667085] block">
                CC
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {ccList.map((cc) => (
                  <span 
                    key={cc.name}
                    className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md bg-[#f2f4f7] text-xs font-medium text-[#344054] border border-[#eaecf0]"
                  >
                    <img src={cc.avatar} alt={cc.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{cc.name}</span>
                    <button onClick={() => removeCc(cc.name)} className="text-[#98a2b3] hover:text-[#101828]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button className="text-xs font-semibold text-[#1668e8] hover:underline pt-1">
                BCC
              </button>
            </div>

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
                  defaultValue="Chakravyuh | Interview for Zach | Product Designer role"
                  className="w-full text-xs font-medium text-[#101828] border border-[#d0d5dd] rounded-lg p-2.5 focus:outline-none focus:border-[#1668e8]"
                />
              </div>

              <div className="space-y-1">
                <textarea 
                  rows={6}
                  defaultValue={`Hi Zach!\n\nThanks for taking the time and letting us know your availability to chat more about the Product Designer role with Chakravyuh.\n\nWe have confirmed your onsite loop for May 18, 2024. Your meeting links and interview panel details are attached below.`}
                  className="w-full text-xs text-[#344054] leading-relaxed border border-[#d0d5dd] rounded-lg p-3 focus:outline-none focus:border-[#1668e8]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Review & Finish (4 Cols) */}
        <div className="col-span-4 space-y-6 pt-2">
          <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-[#101828]">Review</h3>

            {/* To Candidate */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                To Candidate
              </h4>
              <div className="flex items-center gap-2 text-[#344054]">
                <Mail className="w-4 h-4 text-[#667085]" />
                <span className="truncate font-medium">Chakravyuh | Interview for Zach | Pro...</span>
              </div>
              <div className="flex items-center gap-2 text-[#344054]">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <span className="font-medium">Your interview with Chakravyuh</span>
              </div>
            </div>

            {/* Internal */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#f2f4f7]">
              <h4 className="font-semibold text-[#475467] text-[11px] uppercase tracking-wider">
                Internal
              </h4>
              <div className="flex items-center gap-2 text-[#344054]">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <span className="font-medium">3 events</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#eaecf0]">
              <button className="w-full py-2 px-4 rounded-lg border border-[#d0d5dd] hover:bg-[#f9fafb] text-xs font-semibold text-[#344054] transition-colors">
                Send internal only
              </button>

              <button 
                onClick={() => setSent(true)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Dispatched!</span>
                  </>
                ) : (
                  <span>Finish & send</span>
                )}
              </button>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-xs text-[#475467] cursor-pointer pt-2">
              <input type="checkbox" className="rounded border-[#d0d5dd] text-[#1668e8] focus:ring-[#1668e8]" />
              <span>Save selected templates to job setup</span>
            </label>

          </div>
        </div>

      </div>

    </div>
  );
};
