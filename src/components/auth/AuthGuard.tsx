import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerified?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requireVerified = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Always show children on public routes - never block them
  if (!requireAuth) {
    // Redirect logged-in users away from public routes immediately
    if (user) {
      return <Navigate to="/home" replace />;
    }
    // Show children immediately, even if loading
    return <>{children}</>;
  }

  // For protected routes:
  // Only show spinner if loading AND no user AND we're not redirecting
  // If user exists, auth is ready - show content
  if (loading && !user) {
    // Only show spinner for a very brief moment (max 200ms)
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-charcoal-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && user && !user.email_confirmed_at) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  return <>{children}</>;
};
