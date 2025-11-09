import React from 'react';
import { RetirementData, RetirementAnalysis } from '../../types';
import { calculateBasicAnalysis, calculateIntermediateAnalysis, calculateAdvancedAnalysis } from '../../services/retirementCalculations';
import { exportToPDF, exportToCSV } from '../../services/export';
import { RetirementChart } from './Charts/RetirementChart';
import { ExpenseBreakdownChart } from './Charts/ExpenseBreakdownChart';
import { AssetAllocationChart } from './Charts/AssetAllocationChart';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';

interface RetirementDashboardProps {
  data: RetirementData;
  onReset: () => void;
}

export const RetirementDashboard: React.FC<RetirementDashboardProps> = ({ data, onReset }) => {
  const { signOut, user } = useAuth();
  const [selectedMethod, setSelectedMethod] = React.useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
  const [analysis, setAnalysis] = React.useState<RetirementAnalysis | null>(null);

  React.useEffect(() => {
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

      if (user?.id) {
        try {
          await retirementDataService.saveAnalysisResults(user.id, result);
        } catch (error) {
          console.error('Error saving analysis results:', error);
        }
      }
    };

    calculateAndSave();
  }, [data, selectedMethod, user?.id]);

  const handleExportPDF = () => {
    if (analysis) {
      exportToPDF(data, analysis);
    }
  };

  const handleExportCSV = () => {
    if (analysis) {
      exportToCSV(data, analysis);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!analysis) {
    return <div>Loading...</div>;
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
          <div className="bg-white rounded-card shadow-card p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-navy-900">Retirement Analysis Dashboard</h2>
                <p className="text-charcoal-600 mt-1">Your comprehensive retirement readiness report</p>
              </div>
              <button
                onClick={onReset}
                className="px-4 py-2 bg-charcoal-200 text-charcoal-700 rounded-button hover:bg-charcoal-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-250"
              >
                Start Over
              </button>
            </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMethod('basic')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedMethod === 'basic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Basic (70-80% Rule)
              </button>
              <button
                onClick={() => setSelectedMethod('intermediate')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedMethod === 'intermediate'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Intermediate (4% Rule)
              </button>
              <button
                onClick={() => setSelectedMethod('advanced')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedMethod === 'advanced'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Advanced (Monte Carlo)
              </button>
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

          <div className="flex gap-4">
            <button
              onClick={handleExportPDF}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              Export to PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            >
              Export to CSV
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
