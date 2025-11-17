import React from 'react';

interface PrivacyNoticeProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
  variant?: 'modal' | 'banner' | 'inline';
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ 
  onDismiss, 
  showDismiss = true,
  variant = 'modal' 
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleDismiss = () => {
    setIsOpen(false);
    onDismiss?.();
    // Remember user dismissed it (for 30 days)
    localStorage.setItem('privacyNoticeDismissed', Date.now().toString());
  };

  // Check if user already dismissed (within 30 days)
  React.useEffect(() => {
    if (variant === 'modal') {
      const dismissed = localStorage.getItem('privacyNoticeDismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - dismissedTime < thirtyDays) {
          setIsOpen(false);
        }
      }
    }
  }, [variant]);

  if (!isOpen && variant === 'modal') {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">Your Privacy Matters</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Your retirement data is stored securely on your device and optionally in our secure database. 
                You can clear your data at any time using the "Clear All Data" option.
              </p>
            </div>
            {showDismiss && (
              <div className="mt-4">
                <button
                  onClick={handleDismiss}
                  className="text-sm font-medium text-blue-800 hover:text-blue-900 underline"
                >
                  Got it, thanks!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Privacy & Data Storage
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>How your data is stored:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Data is saved locally in your browser (localStorage) for quick access</li>
            <li>If you're logged in, data is also saved securely in our database (Supabase)</li>
            <li>Your data is encrypted and only accessible to you</li>
          </ul>
          <p className="mt-2">
            <strong>You're in control:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>You can clear your data at any time using "Clear All Data"</li>
            <li>You can use the site without saving data - just clear it when done</li>
            <li>Logging out clears your session data</li>
          </ul>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Your Privacy Matters</h2>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">✨ You're in Control</h3>
                  <p className="text-sm">
                    You can use this application <strong>without saving your data</strong> if you prefer. 
                    Simply clear your data when you're done using the "Clear All Data" option available throughout the app.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How Your Data is Stored</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Local Storage (Your Browser):</strong> Your retirement planning data is saved 
                      locally in your browser for quick access. This data stays on your device.
                    </li>
                    <li>
                      <strong>Secure Database (If Logged In):</strong> If you create an account and log in, 
                      your data is also saved securely in our database (Supabase) so you can access it from 
                      any device. This data is encrypted and only accessible to you.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Rights</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Clear Data Anytime:</strong> You can delete all your data at any time using 
                      the "Clear All Data" button available on the home page and dashboard.
                    </li>
                    <li>
                      <strong>No Data Sharing:</strong> We don't share your financial data with third parties. 
                      Your data is used solely to provide you with retirement planning calculations.
                    </li>
                    <li>
                      <strong>Secure Storage:</strong> All data is encrypted and stored securely. 
                      Database access is protected by Row Level Security (RLS) policies.
                    </li>
                    <li>
                      <strong>Logout Clears Session:</strong> When you log out, your session data is cleared 
                      from your browser.
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Using Without Saving</h3>
                  <p className="text-sm text-yellow-800">
                    If you're not comfortable saving your data, you can still use all features of the app. 
                    Just remember to use "Clear All Data" when you're finished. Your calculations will work 
                    the same way - we just won't remember your information for next time.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-600">
                    <strong>Note:</strong> This application is for planning purposes only. We recommend 
                    consulting with a certified financial advisor for personalized retirement planning advice. 
                    Calculations are estimates based on standard assumptions.
                  </p>
                </div>
              </div>

              {showDismiss && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleDismiss}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    I Understand, Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

