import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-[#1668e8] hover:bg-[#145ac7] text-white shadow-2xs focus:ring-[#1668e8]",
    secondary: "bg-[#f2f4f7] hover:bg-[#eaecf0] text-[#344054] focus:ring-[#98a2b3]",
    outline: "border border-[#d0d5dd] hover:bg-[#f9fafb] text-[#344054] focus:ring-[#98a2b3]",
    danger: "bg-[#d92d20] hover:bg-[#b42318] text-white focus:ring-[#d92d20]"
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-xs font-semibold",
    lg: "px-5 py-2 text-sm font-semibold"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
