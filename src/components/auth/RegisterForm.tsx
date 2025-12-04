import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateInviteCode } from '../../utils/inviteCode';
import { Footer } from '../common/Footer';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  
  // Check if invite code is required
  const inviteCodeRequired = (() => {
    const envCodes = import.meta.env.VITE_INVITE_CODES || '';
    return envCodes && envCodes.trim() !== '';
  })();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate invite code if required
    if (inviteCodeRequired) {
      if (!inviteCode || inviteCode.trim() === '') {
        setError('Invite code is required to create an account');
        return;
      }
      
      if (!validateInviteCode(inviteCode)) {
        setError('Invalid invite code. Please check your code and try again.');
        return;
      }
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
      });
      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-charcoal-600 mb-6">
                We've sent a verification email to <strong>{email}</strong>. 
                Please click the link in the email to verify your account.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 border border-transparent rounded-button text-white bg-gradient-blue hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-350 font-medium"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-50 to-blue-50">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-card shadow-card p-8">
          <div className="text-center mb-8">
            <img 
              src="/ai-focus-logo.png" 
              alt="AI Focus" 
              className="h-16 mx-auto mb-4"
            />
            <h2 className="font-heading text-3xl font-bold text-navy-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-charcoal-600">
              Start planning your retirement today
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-coral-50 border border-coral-200 rounded-input text-coral-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-charcoal-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-charcoal-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                placeholder="you@example.com"
              />
            </div>

            {inviteCodeRequired && (
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium text-charcoal-700 mb-2">
                  Invite Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                  placeholder="Enter your invite code"
                />
                <p className="mt-2 text-xs text-charcoal-500">
                  This is a private application. Please contact the administrator for an invite code.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-charcoal-500">
                Must be 8+ characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-button text-white bg-gradient-blue hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-350 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-250"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};
