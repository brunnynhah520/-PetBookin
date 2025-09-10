import React from 'react';
import { Calendar, Settings, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  showAdminButton?: boolean;
  onAdminClick?: () => void;
  isAdminView?: boolean;
}

export default function Header({ title, showAdminButton, onAdminClick, isAdminView }: HeaderProps) {
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-10 w-8 h-8 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-20 w-6 h-6 bg-white rounded-full animate-bounce"></div>
        <div className="absolute bottom-6 left-1/4 w-4 h-4 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-4 right-1/3 w-5 h-5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full animate-bounce"></div>
      </div>
      
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                PetBookin
              </h1>
              <p className="text-sm md:text-base text-blue-100 font-medium">{title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {showAdminButton && (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-3 md:px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isAdminView ? <Calendar className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {isAdminView ? 'View Bookings' : 'Admin'}
                </span>
              </button>
            )}
            
            {isAuthenticated && isAdminView && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/80 backdrop-blur-sm text-white px-3 md:px-4 py-2 rounded-xl hover:bg-red-600/90 transition-all duration-300 border border-red-300/30 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}