import React from 'react';

interface ChakravyuhLoadingAnimationProps {
  message?: string;
  subMessage?: string;
  badge?: string;
  targetRole?: string;
  targetName?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export const ChakravyuhLoadingAnimation: React.FC<ChakravyuhLoadingAnimationProps> = ({
  message = 'Loading workspace...',
  subMessage = 'Hydrating calendar views, panel credentials & coordination bus...',
  badge,
  targetRole,
  targetName,
  size = 'fullscreen'
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Animated Website Logo Container with Concentric Chakravyuh Tactical Rings */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-4">
        {/* Outer orbital dashed ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#1668e8]/30 animate-orbit-slow" />
        
        {/* Secondary reverse counter-orbiting dashed ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#1668e8]/20 animate-orbit-reverse" />
        
        {/* Fast accent spinning arc */}
        <div className="absolute -inset-1 rounded-full border-2 border-transparent border-t-[#1668e8] border-r-[#1668e8]/40 animate-spin" />
        
        {/* Soft radial glow aura */}
        <div className="absolute inset-2 rounded-full bg-[#1668e8]/10 blur-md animate-pulse" />

        {/* Center Website Logo with breathing animation */}
        <div className="relative w-14 h-14 rounded-2xl bg-white shadow-sm border border-[#eaecf0] p-2 flex items-center justify-center animate-logo-pulse">
          <img 
            src="/chakravyuh-logo.png" 
            alt="Chakravyuh Logo" 
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xs" 
          />
        </div>
      </div>

      {/* Brand & Contextual Message */}
      <div className="space-y-1.5 max-w-xs">
        {badge ? (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
            {badge}
          </span>
        ) : targetRole ? (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eff8ff] text-[#175cd3] border border-[#b2ddff]">
            {targetRole} Portal Active
          </span>
        ) : (
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#98a2b3]">
            Chakravyuh Engine
          </span>
        )}

        <h3 className="text-base font-bold text-[#101828] tracking-tight">
          {targetName || message}
        </h3>

        {subMessage && (
          <p className="text-xs text-[#667085] leading-relaxed">
            {subMessage}
          </p>
        )}
      </div>

      {/* Apple-style Indeterminate Progress Track */}
      <div className="w-36 h-1 bg-[#eaecf0] rounded-full overflow-hidden relative mt-4">
        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#1668e8] to-transparent rounded-full animate-shimmer-bar" />
      </div>
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
        <div className="bg-white/95 border border-[#eaecf0] shadow-2xl rounded-3xl p-4 max-w-sm w-full mx-4 transform transition-all animate-in zoom-in-95">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
