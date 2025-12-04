import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { Footer } from '../common/Footer';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setCheckingSession(false);
          return;
        }

        if (!session) {
          // Try to get session from hash
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            // Wait a bit for Supabase to process the hash
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data: { session: hashSession }, error: hashError } = await supabase.auth.getSession();
            
            if (hashError || !hashSession) {
              setError('Invalid or expired reset link. Please request a new password reset.');
              setCheckingSession(false);
              return;
            }
          } else {
            setError('Invalid or expired reset link. Please request a new password reset.');
            setCheckingSession(false);
            return;
          }
        }
        
        setCheckingSession(false);
      } catch (err) {
        setError('Failed to verify reset link. Please request a new password reset.');
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { message: 'Password reset successfully. Please log in with your new password.' }
        });
      }, 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to reset password. The link may have expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-subtle">
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-cream-50 rounded-card shadow-card p-8 border border-teal-50">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                <h2 className="font-heading text-xl font-semibold text-slate-900 mb-2 tracking-tight">Verifying reset link...</h2>
                <p className="text-slate-600">Please wait while we verify your password reset link.</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-subtle">
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-cream-50 rounded-card shadow-card p-8 border border-teal-50">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                  <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  Password Reset Successful
                </h2>
                <p className="text-slate-600 mb-6">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="text-center mb-8">
              <img 
                src="/ai-focus-logo.svg" 
                alt="AI Focus" 
                className="h-16 mx-auto mb-4"
              />
              <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">
                Reset Password
              </h2>
              <p className="mt-2 text-slate-600">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-coral-50 border border-coral-200 rounded-input text-coral-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-250"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-250"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-button text-white bg-gradient-primary hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-350 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/login"
                className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors duration-250"
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

