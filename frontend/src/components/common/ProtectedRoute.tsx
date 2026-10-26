import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { ChakravyuhLoadingAnimation } from './ChakravyuhLoadingAnimation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <ChakravyuhLoadingAnimation 
        size="fullscreen"
        message="Authenticating session..."
        subMessage="Verifying credentials & panel permissions..."
      />
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <div className="p-8 text-center text-xs text-[#d92d20]">Please sign in to access this page.</div>;
  }

  return <>{children}</>;
};
