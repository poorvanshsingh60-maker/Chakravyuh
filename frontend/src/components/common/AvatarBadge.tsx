import React from 'react';

interface AvatarBadgeProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COLOR_PALETTE = [
  'bg-[#1668e8] text-white',
  'bg-[#027a48] text-white',
  'bg-[#6941c6] text-white',
  'bg-[#b54708] text-white',
  'bg-[#0e7490] text-white',
  'bg-[#c01048] text-white',
  'bg-[#364152] text-white',
];

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({ 
  name, 
  size = 'md',
  className = '' 
}) => {
  // Extract clean initials (skip prefixes like Dr., Prof., etc.)
  const cleanName = (name || 'User')
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .trim();
  
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = 'U';
  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    initials = parts[0].slice(0, 2).toUpperCase();
  }

  // Consistent color hash based on name
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base'
  }[size];

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold tracking-tight select-none shrink-0 ${sizeClasses} ${colorClass} ${className}`}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
