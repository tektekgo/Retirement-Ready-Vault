import React from 'react';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ExpensesStep } from './ExpensesStep';
import { AssetsStep } from './AssetsStep';
import { IncomeSourcesStep } from './IncomeSourcesStep';
import { RiskAssessmentStep } from './RiskAssessmentStep';
import { RetirementData, PersonalInfo, MonthlyExpenses, Assets, IncomeSources } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';
import { useAutoSave } from '../../hooks/useAutoSave';

interface WizardContainerProps {
  onComplete: (data: RetirementData) => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ onComplete }) => {
  const { signOut, user } = useAuth();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<RetirementData>({
    personalInfo: {
      age: 0,
      targetRetirementAge: 0,
      riskTolerance: 5,
    },
    expenses: {
      essential: {
        housing: 0,
        utilities: 0,
        food: 0,
        healthcare: 0,
        insurance: 0,
        debtPayments: 0,
      },
      discretionary: {
        entertainment: 0,
        travel: 0,
        dining: 0,
        hobbies: 0,
        other: 0,
      },
    },
    assets: {
      retirement401k: 0,
      iraTraditional: 0,
      iraRoth: 0,
      brokerage: 0,
      savings: 0,
      realEstate: 0,
      other: 0,
    },
    incomeSources: {
      currentSalary: 0,
      socialSecuritySelf: { age: 67, monthlyBenefit: 0 },
    },
  });

  const autoSaveStatus = useAutoSave({
    userId: user?.id || '',
    data,
    enabled: hydrated && !!user?.id,
  });

  React.useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const cloudData = await retirementDataService.loadUserData(user.id);
        
        if (cloudData) {
          setData(cloudData);
          setCurrentStep(0);
        } else {
          const localData = localStorage.getItem('retirementWizardData');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              if (parsedData && typeof parsedData.step === 'number' && parsedData.data) {
                setData(parsedData.data);
                setCurrentStep(parsedData.step);
                await retirementDataService.migrateFromLocalStorage(user.id, parsedData);
              }
            } catch (e) {
              console.error('Failed to migrate local data', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading retirement data:', error);
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    loadData();
  }, [user?.id]);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('retirementWizardData', JSON.stringify({ data, step: currentStep }));
  }, [hydrated, data, currentStep]);

  const steps = [
    { id: 0, title: 'Personal Info', description: 'Basic information' },
    { id: 1, title: 'Expenses', description: 'Monthly spending' },
    { id: 2, title: 'Assets', description: 'Current savings' },
    { id: 3, title: 'Income', description: 'Income sources' },
    { id: 4, title: 'Risk Assessment', description: 'Investment preferences' },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    const completedData = { ...data, completedAt: new Date() };
    localStorage.removeItem('retirementWizardData');
    onComplete(completedData);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading your retirement data...</p>
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
            {autoSaveStatus.saving && (
              <span className="text-xs text-blue-600 flex items-center">
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            )}
            {autoSaveStatus.saved && (
              <span className="text-xs text-green-600">✓ Saved</span>
            )}
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Retirement Planning Wizard</h2>
              <p className="text-charcoal-600">Complete the wizard to analyze your retirement readiness</p>
            </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {currentStep === 0 && (
              <PersonalInfoStep
                data={data.personalInfo}
                onChange={(personalInfo: PersonalInfo) => setData({ ...data, personalInfo })}
                onNext={handleNext}
              />
            )}
            {currentStep === 1 && (
              <ExpensesStep
                data={data.expenses}
                onChange={(expenses: MonthlyExpenses) => setData({ ...data, expenses })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && (
              <AssetsStep
                data={data.assets}
                onChange={(assets: Assets) => setData({ ...data, assets })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <IncomeSourcesStep
                data={data.incomeSources}
                onChange={(incomeSources: IncomeSources) => setData({ ...data, incomeSources })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <RiskAssessmentStep
                onComplete={handleComplete}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
      </div>

      <footer className="bg-white border-t border-charcoal-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-charcoal-600">
            © 2024 AI-Focus.org | <a href="https://www.ai-focus.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">www.ai-focus.org</a>
          </p>
          <p className="text-xs text-charcoal-500 mt-2">
            Email: <a href="mailto:retirement-ready-vault@ai-focus.org" className="text-blue-600 hover:text-blue-500">retirement-ready-vault@ai-focus.org</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
