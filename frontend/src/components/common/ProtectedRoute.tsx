import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-[#667085]">Authenticating session...</div>;
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <div className="p-8 text-center text-xs text-[#d92d20]">Please sign in to access this page.</div>;
  }

  return <>{children}</>;
};
