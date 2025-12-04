import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';
import { RetirementData } from '../../types';
import { exportToPDF, exportToCSV } from '../../services/export';
import { calculateBasicAnalysis } from '../../services/retirementCalculations';
import { PrivacyNotice } from '../common/PrivacyNotice';
import { Footer } from '../common/Footer';
import { clearAllUserData } from '../../utils/dataManagement';

export const LandingPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [hasExistingData, setHasExistingData] = React.useState(false);
  const [existingData, setExistingData] = React.useState<RetirementData | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    // Safety timeout to ensure loading state is cleared
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 300); // Fast timeout

    const checkExistingData = async () => {
      if (!user?.id) {
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
        return;
      }

      try {
        // Check localStorage first (synchronous) to avoid flash
        const localDataKey = `retirementWizardData_${user.id}`;
        const localData = localStorage.getItem(localDataKey);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.data && parsed.userId === user.id && (
              parsed.data.personalInfo?.age > 0 || 
              Object.keys(parsed.data.assets || {}).some(key => parsed.data.assets[key] > 0) ||
              Object.values(parsed.data.expenses?.essential || {}).some((v: any) => v > 0) ||
              Object.values(parsed.data.expenses?.discretionary || {}).some((v: any) => v > 0)
            )) {
              if (isMounted) {
                setHasExistingData(true);
                setExistingData(parsed.data);
                clearTimeout(safetyTimeout);
                setLoading(false);
              }
              return; // Found data in localStorage, skip database check
            }
          } catch (e) {
            // Continue to database check
          }
        }

        // Clear loading immediately - don't wait for database
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }

        // Check database in background (non-blocking)
        try {
          const data = await Promise.race([
            retirementDataService.loadUserData(user.id),
            new Promise<RetirementData | null>((resolve) => setTimeout(() => resolve(null), 2000))
          ]);
          
          if (!isMounted) return;
          
          // Check if data exists and has been initialized (not just empty object)
          if (data && (
            data.personalInfo.age > 0 || 
            Object.keys(data.assets).some(key => data.assets[key as keyof typeof data.assets] > 0) ||
            Object.values(data.expenses.essential).some(v => v > 0) ||
            Object.values(data.expenses.discretionary).some(v => v > 0)
          )) {
            setHasExistingData(true);
            setExistingData(data);
          }
        } catch (error) {
          console.error('Error loading existing data:', error);
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    };

    checkExistingData();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigate to login immediately after logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Navigate anyway even if there's an error
      navigate('/login', { replace: true });
    }
  };

  const handleContinueWizard = () => {
    navigate('/wizard');
  };

  const handleStartNewWizard = async () => {
    if (user?.id) {
      try {
        await clearAllUserData({
          userId: user.id,
          clearLocalStorage: true,
          clearDatabase: true,
        });
      } catch (error) {
        console.error('Error deleting existing data:', error);
      }
    }
    navigate('/wizard');
  };

  const handleClearAllData = async () => {
    if (!window.confirm(
      'Are you sure you want to clear all your retirement planning data? This action cannot be undone.\n\n' +
      'This will delete:\n' +
      '- All data saved in your browser\n' +
      '- All data saved in our database (if logged in)\n\n' +
      'You can still use the app - just start fresh!'
    )) {
      return;
    }

    try {
      await clearAllUserData({
        userId: user?.id,
        clearLocalStorage: true,
        clearDatabase: true,
      });
      
      // Reset state
      setHasExistingData(false);
      setExistingData(null);
      
      alert('All data has been cleared successfully. You can start fresh anytime!');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('There was an error clearing your data. Please try again or contact support.');
    }
  };

  const handleExportPDF = () => {
    if (existingData) {
      const analysis = calculateBasicAnalysis(existingData);
      exportToPDF(existingData, analysis);
    }
  };

  const handleExportCSV = () => {
    if (existingData) {
      const analysis = calculateBasicAnalysis(existingData);
      exportToCSV(existingData, analysis);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/ai-focus-logo.svg" 
              alt="AI Focus" 
              className="h-10"
            />
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-900 tracking-tight">Retirement Ready Vault</h1>
              <p className="text-xs text-slate-600">Powered by AI-Focus.org</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-charcoal-600">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-250"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <PrivacyNotice variant="modal" />
          
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Welcome to Retirement Ready Vault
            </h2>
            <p className="text-slate-600">
              {hasExistingData 
                ? 'You have existing retirement planning data. What would you like to do?'
                : 'Start planning your retirement journey today'}
            </p>
          </div>

          <div className="mb-6">
            <PrivacyNotice variant="banner" />
          </div>

          {hasExistingData ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-teal-200 hover:border-teal-400 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    Continue Planning
                  </h3>
                  <p className="text-slate-600 mb-6">
                    View or update your existing retirement plan and see your analysis dashboard
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleContinueWizard}
                      className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Edit Planning Data
                    </button>
                    <Link
                      to="/dashboard"
                      className="w-full px-6 py-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors font-medium block text-center"
                    >
                      View Dashboard
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    Export Your Data
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    Download your retirement plan and analysis
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      View Dashboard & Export
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Export Report as PDF (Text Only)
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 border border-charcoal-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    Start Fresh
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Delete your existing data and create a new retirement plan from scratch
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleStartNewWizard}
                      className="px-6 py-3 bg-charcoal-600 text-white rounded-lg hover:bg-charcoal-700 transition-colors font-medium"
                    >
                      Start New Plan
                    </button>
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={handleClearAllData}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        Clear All Data
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Permanently delete all your data from browser and database
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                Start Your Retirement Plan
              </h3>
              <p className="text-slate-600 mb-6">
                Complete our 5-step wizard to create a comprehensive retirement plan with personalized analysis
              </p>
              <div className="mb-6">
                <PrivacyNotice variant="inline" showDismiss={false} />
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleContinueWizard}
                  className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-lg"
                >
                  Begin Planning
                </button>
                {user?.id && (
                  <button
                    onClick={handleClearAllData}
                    className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Clear Any Existing Data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
