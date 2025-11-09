import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthGuard } from './components/auth/AuthGuard';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { LandingPage } from './components/dashboard/LandingPage';
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false}>
                <LoginForm />
              </AuthGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthGuard requireAuth={false}>
                <RegisterForm />
              </AuthGuard>
            } 
          />
          <Route 
            path="/auth/forgot-password" 
            element={
              <AuthGuard requireAuth={false}>
                <ForgotPassword />
              </AuthGuard>
            } 
          />
          <Route 
            path="/home" 
            element={
              <AuthGuard requireAuth={true}>
                <LandingPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/wizard" 
            element={
              <AuthGuard requireAuth={true}>
                {!retirementData ? (
                  <WizardContainer onComplete={handleWizardComplete} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                {retirementData ? (
                  <RetirementDashboard data={retirementData} onReset={handleReset} />
                ) : (
                  <Navigate to="/home" replace />
                )}
              </AuthGuard>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
