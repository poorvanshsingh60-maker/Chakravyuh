import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ChakravyuhLogo: React.FC<LogoProps> = ({ className = '', size = 28, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Concentric Labyrinth Glyph */}
      <div 
        className="relative flex items-center justify-center bg-slate-900 rounded-lg shadow-sm border border-slate-700/60 overflow-hidden flex-shrink-0"
        style={{ width: size + 8, height: size + 8 }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Layer Arc */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#38bdf8" 
            strokeWidth="5" 
            strokeDasharray="210 50" 
            strokeLinecap="round" 
            className="opacity-90"
          />
          {/* Middle Layer Arc */}
          <circle 
            cx="50" 
            cy="50" 
            r="28" 
            stroke="#60a5fa" 
            strokeWidth="5" 
            strokeDasharray="130 40" 
            strokeDashoffset="30"
            strokeLinecap="round" 
            className="opacity-95"
          />
          {/* Inner Layer Arc */}
          <circle 
            cx="50" 
            cy="50" 
            r="15" 
            stroke="#93c5fd" 
            strokeWidth="5" 
            strokeDasharray="60 30" 
            strokeDashoffset="15"
            strokeLinecap="round" 
          />
          {/* Central Optimization Convergence Node */}
          <circle cx="50" cy="50" r="5" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-slate-900 text-base leading-none">
              CHAKRAVYUH
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-blue-50 text-blue-700 border border-blue-200/80 leading-none">
              OR-TOOLS
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-tight leading-tight mt-0.5">
            Combinatorial Interview Orchestration
          </span>
        </div>
      )}
    </div>
  );
};
