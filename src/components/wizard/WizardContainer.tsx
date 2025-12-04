import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ExpensesStep } from './ExpensesStep';
import { AssetsStep } from './AssetsStep';
import { IncomeSourcesStep } from './IncomeSourcesStep';
import { RiskAssessmentStep } from './RiskAssessmentStep';
import { RetirementData, PersonalInfo, MonthlyExpenses, Assets, IncomeSources } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { retirementDataService } from '../../services/retirementData.service';
import { useAutoSave } from '../../hooks/useAutoSave';
import { PrivacyNotice } from '../common/PrivacyNotice';
import { clearAllUserData } from '../../utils/dataManagement';
import { getVersion } from '../../config/version';

export const WizardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<RetirementData>({
    personalInfo: {
      name: '',
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
    let isMounted = true;
    
    // Safety timeout to ensure loading state is cleared
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Wizard data loading timeout - clearing loading state');
        setLoading(false);
        setHydrated(true);
      }
    }, 3000); // 3 second timeout

    const loadData = async () => {
      if (!user?.id) {
        setLoading(false);
        setHydrated(true);
        return;
      }

      try {
        // Use Promise.race to ensure we don't wait too long
        const cloudData = await Promise.race([
          retirementDataService.loadUserData(user.id),
          new Promise<RetirementData | null>((resolve) => 
            setTimeout(() => resolve(null), 2000)
          )
        ]);
        
        if (!isMounted) return;
        
        if (cloudData) {
          setData(cloudData);
          setCurrentStep(0);
        } else {
          // Only load localStorage data if it belongs to current user
          const localDataKey = `retirementWizardData_${user.id}`;
          const localData = localStorage.getItem(localDataKey);
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              // Verify it belongs to current user
              if (parsedData && parsedData.userId === user.id && parsedData.data) {
                // If wizard was completed, start fresh at step 0
                if (parsedData.completed) {
                  console.log('Wizard was previously completed, starting fresh');
                  setCurrentStep(0);
                  // Clear completed flag so they can start fresh
                  localStorage.setItem(localDataKey, JSON.stringify({
                    ...parsedData,
                    completed: false,
                    step: 0
                  }));
                } else if (typeof parsedData.step === 'number') {
                  setData(parsedData.data);
                  setCurrentStep(parsedData.step);
                  // Don't wait for migration - do it in background
                  retirementDataService.migrateFromLocalStorage(user.id, parsedData)
                    .catch(e => console.error('Failed to migrate local data', e));
                } else {
                  setCurrentStep(0);
                }
              } else {
                // Data doesn't belong to this user, clear it and start fresh
                console.warn('Found localStorage data that does not belong to current user, clearing it');
                localStorage.removeItem(localDataKey);
                // Also clear old non-user-specific key
                localStorage.removeItem('retirementWizardData');
                setCurrentStep(0);
              }
            } catch (e) {
              console.error('Failed to parse local data', e);
              localStorage.removeItem(localDataKey);
              // Also clear old non-user-specific key
              localStorage.removeItem('retirementWizardData');
              setCurrentStep(0);
            }
          } else {
            // No localStorage data, start fresh
            setCurrentStep(0);
          }
        }
      } catch (error) {
        console.error('Error loading retirement data:', error);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
          setHydrated(true);
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
    if (!hydrated || !user?.id) return;
    // Store with user-specific key
    const localDataKey = `retirementWizardData_${user.id}`;
    localStorage.setItem(localDataKey, JSON.stringify({ 
      data, 
      step: currentStep,
      userId: user.id 
    }));
  }, [hydrated, data, currentStep, user?.id]);

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

  const [saving, setSaving] = React.useState(false);

  const handleComplete = async () => {
    console.log('handleComplete called', { userId: user?.id, hasData: !!data });
    
    if (!user?.id) {
      console.error('No user ID available');
      alert('You must be logged in to save your data. Please log in and try again.');
      navigate('/login');
      return;
    }

    setSaving(true);

    try {
      console.log('Saving data...', data);
      
      // Add timeout to prevent hanging
      const savePromise = retirementDataService.saveAllData(user.id, data);
      const timeoutPromise = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out after 5 seconds')), 5000)
      );

      await Promise.race([savePromise, timeoutPromise]);
      console.log('Data saved successfully');
      
      // Clear wizard step from localStorage after successful save
      // This ensures next time they start wizard, it begins at step 0
      const localDataKey = `retirementWizardData_${user.id}`;
      const savedData = localStorage.getItem(localDataKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Update to mark as completed and reset step
          localStorage.setItem(localDataKey, JSON.stringify({
            ...parsed,
            completed: true,
            step: 0 // Reset step so wizard starts fresh next time
          }));
        } catch (e) {
          console.error('Error updating localStorage after save:', e);
        }
      }
      
      // Navigate after successful save
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving final data:', error);
      // Show error to user but still navigate
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Save failed: ${errorMessage}. Navigating to dashboard anyway - data is saved in localStorage.`);
      // Still navigate to dashboard - data is saved in localStorage via auto-save
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
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
              src="/ai-focus-logo.png" 
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
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-blue-600 transition-colors duration-250"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-blue-600 transition-colors duration-250"
            >
              Dashboard
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-4">
            <PrivacyNotice variant="banner" />
          </div>
          
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Retirement Planning Wizard</h2>
                  <p className="text-charcoal-600">Complete the wizard to analyze your retirement readiness</p>
                </div>
                {user?.id && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Clear all data and start fresh? This will delete all your progress.')) {
                        try {
                          await clearAllUserData({
                            userId: user.id,
                            clearLocalStorage: true,
                            clearDatabase: true,
                          });
                          window.location.reload(); // Reload to reset wizard state
                        } catch (error) {
                          console.error('Error clearing data:', error);
                          alert('Error clearing data. Please try again.');
                        }
                      }
                    }}
                    className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Clear all data"
                  >
                    Clear Data
                  </button>
                )}
              </div>
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
                onChange={(riskTolerance: number) => 
                  setData({ ...data, personalInfo: { ...data.personalInfo, riskTolerance } })
                }
                onComplete={handleComplete}
                onBack={handleBack}
                saving={saving}
              />
            )}
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
          <p className="text-xs text-charcoal-400 mt-2">
            {getVersion()}
          </p>
        </div>
      </footer>
    </div>
  );
};
