import React, { useState } from 'react';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import BookingFlow from './components/BookingFlow/BookingFlow';
import Dashboard from './components/Admin/Dashboard';
import LoginForm from './components/Admin/LoginForm';

type AppView = 'booking' | 'admin';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('booking');
  const { isAuthenticated } = useAuth();

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

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;