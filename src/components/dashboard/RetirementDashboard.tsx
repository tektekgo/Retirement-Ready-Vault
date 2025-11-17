import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RetirementData, RetirementAnalysis } from '../../types';
import { calculateBasicAnalysis, calculateIntermediateAnalysis, calculateAdvancedAnalysis } from '../../services/retirementCalculations';
import { exportToPDF, exportToCSV, exportDashboardToPDF } from '../../services/export';
import { RetirementChart } from './Charts/RetirementChart';
import { ExpenseBreakdownChart } from './Charts/ExpenseBreakdownChart';
import { AssetAllocationChart } from './Charts/AssetAllocationChart';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';
import { PrivacyNotice } from '../common/PrivacyNotice';
import { clearAllUserData } from '../../utils/dataManagement';

export const RetirementDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = React.useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
  const [analysis, setAnalysis] = React.useState<RetirementAnalysis | null>(null);
  const [data, setData] = React.useState<RetirementData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    
    // Safety timeout to ensure loading state is cleared
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Dashboard data loading timeout - clearing loading state');
        setLoading(false);
      }
    }, 3000); // 3 second timeout

    const loadData = async () => {
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
        let retirementData: RetirementData | null = null;
        
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.data && parsed.userId === user.id && parsed.completed && parsed.data.personalInfo?.age > 0) {
              retirementData = parsed.data;
              console.log('Loaded data from localStorage');
              if (isMounted) {
                setData(retirementData);
                setLoading(false);
                clearTimeout(safetyTimeout);
                return; // Found data in localStorage, skip database check
              }
            }
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
          }
        }

        // If no localStorage data, check database
        if (!retirementData) {
          // Use Promise.race to ensure we don't wait too long
          retirementData = await Promise.race([
            retirementDataService.loadUserData(user.id),
            new Promise<RetirementData | null>((resolve) => 
              setTimeout(() => resolve(null), 2000)
            )
          ]);
        }
        
        if (!isMounted) return;
        
        if (retirementData && retirementData.personalInfo.age > 0) {
          setData(retirementData);
        }
      } catch (error) {
        console.error('Error loading retirement data:', error);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [user?.id]);

  React.useEffect(() => {
    if (!data) return;

    const calculateAndSave = async () => {
      let result: RetirementAnalysis;
      switch (selectedMethod) {
        case 'basic':
          result = calculateBasicAnalysis(data);
          break;
        case 'intermediate':
          result = calculateIntermediateAnalysis(data);
          break;
        case 'advanced':
          result = calculateAdvancedAnalysis(data);
          break;
      }
      setAnalysis(result);

      // Don't wait for save - do it in background
      if (user?.id) {
        retirementDataService.saveAnalysisResults(user.id, result)
          .catch(error => console.error('Error saving analysis results:', error));
      }
    };

    calculateAndSave();
  }, [data, selectedMethod, user?.id]);

  const handleExportPDF = () => {
    if (!analysis || !data) return;
    exportToPDF(data, analysis);
  };

  const handleExportDashboardPDF = async () => {
    await exportDashboardToPDF('dashboard-content');
  };

  const handleExportCSV = () => {
    if (!analysis || !data) return;
    exportToCSV(data, analysis);
  };

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

  const handleEditData = () => {
    navigate('/wizard');
  };

  const handleReset = async () => {
    if (user?.id) {
      try {
        await clearAllUserData({
          userId: user.id,
          clearLocalStorage: true,
          clearDatabase: true,
        });
        navigate('/wizard');
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm(
      'Are you sure you want to clear all your retirement planning data? This action cannot be undone.\n\n' +
      'This will delete:\n' +
      '- All data saved in your browser\n' +
      '- All data saved in our database (if logged in)\n\n' +
      'You will be redirected to the home page.'
    )) {
      return;
    }

    try {
      await clearAllUserData({
        userId: user?.id,
        clearLocalStorage: true,
        clearDatabase: true,
      });
      
      alert('All data has been cleared successfully.');
      navigate('/home');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('There was an error clearing your data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading your retirement analysis...</p>
        </div>
      </div>
    );
  }

  if (!data || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="font-heading text-2xl font-bold text-navy-900 mb-4">No Data Yet</h2>
            <p className="text-charcoal-600 mb-6">
              You haven't completed the retirement planning wizard yet. Complete the wizard to see your personalized analysis.
            </p>
            <button
              onClick={() => navigate('/wizard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalEssential = Object.values(data.expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(data.expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalAssets = Object.values(data.assets).reduce((a, b) => a + b, 0);

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
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-blue-600 transition-colors duration-250"
            >
              Home
            </button>
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

      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4">
            <PrivacyNotice variant="banner" />
          </div>
          
          <div id="dashboard-content" className="bg-white rounded-card shadow-card p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-navy-900">Retirement Analysis Dashboard</h2>
                <p className="text-charcoal-600 mt-1">Your comprehensive retirement readiness report</p>
                {data?.personalInfo?.name && (
                  <p className="text-sm text-gray-600 mt-2">
                    Prepared for: <span className="font-semibold">{data.personalInfo.name}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEditData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-button hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-250"
                >
                  Edit Data
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-charcoal-200 text-charcoal-700 rounded-button hover:bg-charcoal-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-250"
                >
                  Start Over
                </button>
                <button
                  onClick={handleClearAllData}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-button hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-250 text-sm"
                  title="Permanently delete all your data"
                >
                  Clear All Data
                </button>
              </div>
            </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Method</label>
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <div className="relative group flex-1">
                <button
                  onClick={() => setSelectedMethod('basic')}
                  className={`w-full px-4 py-2 rounded-lg font-medium relative ${
                    selectedMethod === 'basic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Basic (70-80% Rule)
                  <svg className="inline-block ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <div className="font-semibold mb-1 text-blue-300">How it calculates:</div>
                  <div className="leading-relaxed">Uses 75% of your current expenses as required income. Divides your total savings by 30 years to estimate monthly income. Compares what you'll have vs. what you need.</div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              <div className="relative group flex-1">
                <button
                  onClick={() => setSelectedMethod('intermediate')}
                  className={`w-full px-4 py-2 rounded-lg font-medium relative ${
                    selectedMethod === 'intermediate'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Intermediate (4% Rule)
                  <svg className="inline-block ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <div className="font-semibold mb-1 text-blue-300">How it calculates:</div>
                  <div className="leading-relaxed">Uses 80% of current expenses as required income. Applies the 4% safe withdrawal rate to your savings (4% of total assets per year). Adds Social Security, pension, and other income sources.</div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              <div className="relative group flex-1">
                <button
                  onClick={() => setSelectedMethod('advanced')}
                  className={`w-full px-4 py-2 rounded-lg font-medium relative ${
                    selectedMethod === 'advanced'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Advanced (Monte Carlo)
                  <svg className="inline-block ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <div className="font-semibold mb-1 text-blue-300">How it calculates:</div>
                  <div className="leading-relaxed">Runs 1,000 simulations with varying investment returns (4-10%) and inflation rates. Tests if your portfolio lasts 30 years in each scenario. Shows the percentage of successful outcomes as your readiness score.</div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-gray-900 mb-2">
                {selectedMethod === 'basic' && 'Basic Method (70-80% Rule)'}
                {selectedMethod === 'intermediate' && 'Intermediate Method (4% Rule)'}
                {selectedMethod === 'advanced' && 'Advanced Method (Monte Carlo)'}
              </div>
              <p className="text-sm text-gray-700">
                {selectedMethod === 'basic' && 'This method estimates your retirement needs using a simple rule: you\'ll need about 75% of your current monthly expenses in retirement. It divides your total savings evenly over 30 years to see if you have enough to cover your needs.'}
                {selectedMethod === 'intermediate' && 'This method uses the proven 4% withdrawal rule, which suggests you can safely withdraw 4% of your retirement savings each year. It also includes your Social Security, pension, and other income sources to give a more complete picture.'}
                {selectedMethod === 'advanced' && 'This method runs 1,000 computer simulations testing different market conditions, investment returns, and inflation rates over 30 years. It shows the probability that your retirement savings will last, giving you a realistic view of your retirement readiness.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Readiness Score</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">
                {analysis.readinessScore.toFixed(1)}%
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Projected Income</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                ${analysis.projectedMonthlyIncome.toFixed(0)}/mo
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Required Income</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">
                ${analysis.requiredMonthlyIncome.toFixed(0)}/mo
              </div>
            </div>
            <div className={`${analysis.gap > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg`}>
              <div className="text-sm font-medium text-gray-600">Gap</div>
              <div className={`text-2xl font-bold mt-1 ${analysis.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {analysis.gap > 0 ? '-' : '+'}${Math.abs(analysis.gap).toFixed(0)}/mo
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Projection</h3>
              <RetirementChart data={data} analysis={analysis} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
              <ExpenseBreakdownChart expenses={data.expenses} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
              <AssetAllocationChart assets={data.assets} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Age</span>
                  <span className="font-semibold">{data.personalInfo.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Retirement Age</span>
                  <span className="font-semibold">{data.personalInfo.targetRetirementAge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years to Retirement</span>
                  <span className="font-semibold">{data.personalInfo.targetRetirementAge - data.personalInfo.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assets</span>
                  <span className="font-semibold">${totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Expenses</span>
                  <span className="font-semibold">${(totalEssential + totalDiscretionary).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Tolerance</span>
                  <span className="font-semibold">{data.personalInfo.riskTolerance}/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleExportDashboardPDF}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                Export Dashboard as PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                Export to CSV
              </button>
            </div>
            <button
              onClick={handleExportPDF}
              className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-sm"
            >
              Export Report as PDF (Text Only)
            </button>
          </div>
        </div>
      </div>
      </div>

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
