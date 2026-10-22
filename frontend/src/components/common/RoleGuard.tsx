import React from 'react';
import { UserRole } from '../../types/user';
import { useAuthContext } from '../../context/AuthContext';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuthContext();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
