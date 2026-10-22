import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ChakravyuhLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 32, 
  showText = true
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Authentic Chakravyuha Labyrinth Main Logo */}
      <div 
        className="relative flex items-center justify-center bg-white rounded-lg shadow-2xs border border-[#d0d5dd] overflow-hidden shrink-0 p-0.5 hover:shadow-xs transition-shadow"
        style={{ width: size + 8, height: size + 8 }}
      >
        <img 
          src="/chakravyuh-logo.png" 
          alt="Chakravyuh Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-[#101828] text-base leading-none">
              Chakravyuh
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#e7f2fe] text-[#1668e8] border border-[#bcd7fd] leading-none">
              CP-SAT
            </span>
          </div>
          <span className="text-[10px] font-medium text-[#667085] tracking-tight leading-tight mt-0.5">
            Labyrinth Constraint Optimization
          </span>
        </div>
      )}
    </div>
  );
};
