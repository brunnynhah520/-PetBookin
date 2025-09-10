import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import BookingFlow from './components/BookingFlow/BookingFlow';
import Dashboard from './components/Admin/Dashboard';
import LoginForm from './components/Admin/LoginForm';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import UserDashboard from './components/Dashboard/UserDashboard';
import SubscriptionPage from './components/Subscription/SubscriptionPage';
import SuccessPage from './components/Subscription/SuccessPage';

type AppView = 'booking' | 'admin';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('booking');
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  const toggleView = () => {
    if (currentView === 'booking') {
      // Tentando acessar admin - verifica autenticação
      if (isAuthenticated) {
        setCurrentView('admin');
      } else {
        setCurrentView('admin'); // Vai mostrar tela de login
      }
    } else {
      setCurrentView('booking');
    }
  };

  // Se está tentando acessar admin mas não está autenticado, mostra login
  if (currentView === 'admin' && !isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={currentView === 'booking' ? 'Online Scheduling' : 'Admin Panel'}
        showAdminButton={true}
        onAdminClick={toggleView}
        isAdminView={currentView === 'admin'}
      />
      
      {currentView === 'booking' ? (
        <BookingFlow />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BookingProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<AppContent />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/success" element={<SuccessPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </BookingProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;