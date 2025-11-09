import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';
import { RetirementData } from '../../types';
import { exportToPDF, exportToCSV } from '../../services/export';
import { calculateBasicAnalysis } from '../../services/retirementCalculations';

export const LandingPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [hasExistingData, setHasExistingData] = React.useState(false);
  const [existingData, setExistingData] = React.useState<RetirementData | null>(null);

  React.useEffect(() => {
    const checkExistingData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await retirementDataService.loadUserData(user.id);
        if (data && data.personalInfo.age > 0) {
          setHasExistingData(true);
          setExistingData(data);
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingData();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleContinueWizard = () => {
    navigate('/wizard');
  };

  const handleStartNewWizard = async () => {
    if (user?.id) {
      try {
        await retirementDataService.deleteUserData(user.id);
        localStorage.removeItem('retirementWizardData');
      } catch (error) {
        console.error('Error deleting existing data:', error);
      }
    }
    navigate('/wizard');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
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
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/src/assets/ai-focus-logo.png" 
              alt="AI Focus" 
              className="h-10"
            />
            <div>
              <h1 className="font-heading text-xl font-bold text-navy-900">Retirement Ready Vault</h1>
              <p className="text-xs text-charcoal-600">Powered by AI-Focus.org</p>
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
              className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-blue-600 transition-colors duration-250"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-navy-900 mb-2">
              Welcome to Retirement Ready Vault
            </h2>
            <p className="text-charcoal-600">
              {hasExistingData 
                ? 'You have existing retirement planning data. What would you like to do?'
                : 'Start planning your retirement journey today'}
            </p>
          </div>

          {hasExistingData ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-2">
                    Continue Planning
                  </h3>
                  <p className="text-charcoal-600 mb-6">
                    View or update your existing retirement plan and see your analysis dashboard
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleContinueWizard}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Edit Planning Data
                    </button>
                    <button
                      onClick={handleViewDashboard}
                      className="w-full px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      View Dashboard
                    </button>
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
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-2">
                    Export Your Data
                  </h3>
                  <p className="text-charcoal-600 mb-6">
                    Download your retirement plan and analysis as PDF or CSV
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-6 py-3 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-6 py-3 bg-coral-100 text-coral-700 rounded-lg hover:bg-coral-200 transition-colors font-medium"
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
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-2">
                    Start Fresh
                  </h3>
                  <p className="text-charcoal-600 mb-6">
                    Delete your existing data and create a new retirement plan from scratch
                  </p>
                  <button
                    onClick={handleStartNewWizard}
                    className="px-6 py-3 bg-charcoal-600 text-white rounded-lg hover:bg-charcoal-700 transition-colors font-medium"
                  >
                    Start New Plan
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                Start Your Retirement Plan
              </h3>
              <p className="text-charcoal-600 mb-8">
                Complete our 5-step wizard to create a comprehensive retirement plan with personalized analysis
              </p>
              <button
                onClick={handleContinueWizard}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Begin Planning
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-charcoal-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-charcoal-600">
            © 2025 AI-Focus.org | <a href="https://www.ai-focus.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">www.ai-focus.org</a>
          </p>
          <p className="text-xs text-charcoal-500 mt-2">
            Email: <a href="mailto:retirement-ready-vault@ai-focus.org" className="text-blue-600 hover:text-blue-500">retirement-ready-vault@ai-focus.org</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
