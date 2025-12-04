import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Footer } from '../common/Footer';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-cream-50 rounded-card shadow-card p-8 border border-teal-50">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-charcoal-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please click the link in the email to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 border border-transparent rounded-button text-white bg-gradient-primary hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-350 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-cream-50 rounded-card shadow-card p-8 border border-teal-50">
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
              Enter your email to receive a password reset link
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-coral-50 border border-coral-200 rounded-input text-coral-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-250"
                placeholder="you@example.com"
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors duration-250"
            >
              ← Back to Login
            </Link>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
