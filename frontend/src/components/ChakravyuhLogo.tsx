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
      {/* Official Chakravyuh Logo - Clean, No Border Box */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <img 
          src="/chakravyuh-logo.png" 
          alt="Chakravyuh" 
          className="w-full h-full object-contain select-none"
        />
      </div>

      {showText && (
        <span className="font-bold tracking-tight text-[#101828] text-[15px] select-none leading-none">
          Chakravyuh
        </span>
      )}
    </div>
  );
};
