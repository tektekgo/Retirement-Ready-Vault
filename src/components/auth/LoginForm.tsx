import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (useMagicLink) {
        await signInWithMagicLink(email);
        setSuccess('Magic link sent! Check your email to sign in.');
      } else {
        await signIn(email, password);
        navigate('/home');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-card shadow-card p-8">
          <div className="text-center mb-8">
            <img 
              src="/ai-focus-logo.png" 
              alt="AI Focus" 
              className="h-16 mx-auto mb-4"
            />
            <h2 className="font-heading text-3xl font-bold text-navy-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-charcoal-600">
              Sign in to your Retirement Ready Vault
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-coral-50 border border-coral-200 rounded-input text-coral-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-input text-blue-700">
              {success}
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
                className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                placeholder="you@example.com"
              />
            </div>

            {!useMagicLink && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250"
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="magic-link"
                  type="checkbox"
                  checked={useMagicLink}
                  onChange={(e) => setUseMagicLink(e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-charcoal-300 rounded"
                />
                <label htmlFor="magic-link" className="ml-2 block text-sm text-charcoal-600">
                  Use magic link instead
                </label>
              </div>

              {!useMagicLink && (
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-250"
                >
                  Forgot password?
                </Link>
              )}
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
                  {useMagicLink ? 'Sending...' : 'Signing in...'}
                </span>
              ) : (
                useMagicLink ? 'Send Magic Link' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-250"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          © 2025 AI-Focus.org | <a href="https://www.ai-focus.org" className="text-blue-600 hover:text-blue-500">www.ai-focus.org</a>
        </p>
      </div>
    </div>
  );
};
