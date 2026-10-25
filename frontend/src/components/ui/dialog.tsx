import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
          <h3 className="text-base font-bold text-[#101828]">{title}</h3>
          <button onClick={onClose} className="text-[#98a2b3] hover:text-[#101828]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
