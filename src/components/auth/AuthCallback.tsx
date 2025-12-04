import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { Footer } from '../common/Footer';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically processes the session from URL hash
        // when detectSessionInUrl is true (which it is in our config)
        // Give Supabase time to process the URL hash and set the session
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (session?.user) {
            // Session is set, AuthProvider will pick it up via onAuthStateChange
            // Wait a moment for the auth state to propagate
            await new Promise(resolve => setTimeout(resolve, 300));
            setHasChecked(true);
            navigate('/home', { replace: true });
            return;
          }

          // Wait a bit before checking again
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }

        // If we get here, no session was found after multiple attempts
        throw new Error('Session not found after processing magic link');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setHasChecked(true);
        // Redirect to login after showing error briefly
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { error: 'Failed to authenticate. Please try again.' }
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (user && !hasChecked) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate, hasChecked]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-50 to-blue-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <>
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-charcoal-900 mb-2">Authentication Error</h2>
              <p className="text-charcoal-600 mb-4">{error}</p>
              <p className="text-sm text-charcoal-500">Redirecting to login...</p>
            </>
          ) : (
            <>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <h2 className="text-xl font-semibold text-charcoal-900 mb-2">Completing sign in...</h2>
              <p className="text-charcoal-600">Please wait while we verify your magic link.</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

