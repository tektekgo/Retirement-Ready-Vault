import React, { useState } from 'react';
import { resendService } from '../../services/resend.service';

export const ResendTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await resendService.sendTestEmail(email);
      setResult({
        success: true,
        message: `Email sent successfully! Email ID: ${response.id}`,
      });
      setEmail('');
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50 rounded-card shadow-card p-8 border border-teal-50 max-w-md mx-auto mt-8">
      <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
        Test Resend Email
      </h2>
      <p className="text-slate-600 mb-6 text-sm">
        Send a test email to verify Resend API is working correctly.
      </p>

      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            id="test-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-250"
            placeholder="your-email@example.com"
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
            'Send Test Email'
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-input border ${
          result.success
            ? 'bg-teal-50 border-teal-200 text-teal-700'
            : 'bg-coral-50 border-coral-200 text-coral-700'
        }`}>
          <div className="flex items-start">
            {result.success ? (
              <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className="font-medium">{result.success ? 'Success!' : 'Error'}</p>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Note:</strong> For local development, use <code className="bg-slate-200 px-1 rounded">vercel dev</code> to run API routes.
          For production, API routes work automatically on Vercel.
          Check your inbox (and spam folder) for the test email.
        </p>
      </div>
    </div>
  );
};

