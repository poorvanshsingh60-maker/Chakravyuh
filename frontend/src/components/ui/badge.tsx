import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  const styles = {
    success: 'bg-[#ecfdf3] text-[#0b7c3e] border-[#abefc6]',
    warning: 'bg-[#fffaeb] text-[#b54708] border-[#fedf89]',
    info: 'bg-[#e7f2fe] text-[#1668e8] border-[#bcd7fd]',
    neutral: 'bg-[#f2f4f7] text-[#344054] border-[#eaecf0]',
    danger: 'bg-[#fef3f2] text-[#d92d20] border-[#fecdca]'
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
