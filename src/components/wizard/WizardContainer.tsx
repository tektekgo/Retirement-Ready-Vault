import React from 'react';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ExpensesStep } from './ExpensesStep';
import { AssetsStep } from './AssetsStep';
import { IncomeSourcesStep } from './IncomeSourcesStep';
import { RiskAssessmentStep } from './RiskAssessmentStep';
import { RetirementData, PersonalInfo, MonthlyExpenses, Assets, IncomeSources } from '../../types';

interface WizardContainerProps {
  onComplete: (data: RetirementData) => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);
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

  React.useEffect(() => {
    const saved = localStorage.getItem('retirementWizardData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        if (parsedData && typeof parsedData.step === 'number' && parsedData.data) {
          setData(parsedData.data);
          setCurrentStep(parsedData.step);
        }
      } catch (e) {
        console.error('Failed to load saved data', e);
      }
    }
    setHydrated(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Ready Vault</h1>
            <p className="text-gray-600">Complete the wizard to analyze your retirement readiness</p>
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
  );
};
