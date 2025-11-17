import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthGuard } from './components/auth/AuthGuard';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { LandingPage } from './components/dashboard/LandingPage';
import { WizardContainer } from './components/wizard/WizardContainer';
import { RetirementDashboard } from './components/dashboard/RetirementDashboard';

function App() {
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
                <WizardContainer />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <RetirementDashboard />
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
