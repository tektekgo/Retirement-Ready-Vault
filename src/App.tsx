import React from 'react';
import { WizardContainer } from './components/wizard/WizardContainer';
import { RetirementDashboard } from './components/dashboard/RetirementDashboard';
import { RetirementData } from './types';

function App() {
  const [retirementData, setRetirementData] = React.useState<RetirementData | null>(null);

  const handleWizardComplete = (data: RetirementData) => {
    setRetirementData(data);
  };

  const handleReset = () => {
    setRetirementData(null);
    localStorage.removeItem('retirementWizardData');
  };

  return (
    <div className="App">
      {!retirementData ? (
        <WizardContainer onComplete={handleWizardComplete} />
      ) : (
        <RetirementDashboard data={retirementData} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
