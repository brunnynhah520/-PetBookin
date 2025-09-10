import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Settings as SettingsIcon, Filter, BarChart3 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import CalendarView from './CalendarView';
import BookingList from './BookingList';
import Settings from './Settings';
import DashboardTab from './DashboardTab';

type ViewMode = 'dashboard' | 'calendar' | 'list' | 'settings';
type StatusFilter = 'all' | 'pendente' | 'confirmado' | 'concluido' | 'cancelado';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { bookings } = useAdmin();

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const stats = {
    total: bookings.length,
    pendente: bookings.filter(b => b.status === 'pendente').length,
    confirmado: bookings.filter(b => b.status === 'confirmado').length,
    concluido: bookings.filter(b => b.status === 'concluido').length,
    cancelado: bookings.filter(b => b.status === 'cancelado').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="w-full px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage bookings and settings</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'dashboard' 
                      ? 'bg-white text-blue-900 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-white text-blue-900 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-900 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('settings')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'settings' 
                      ? 'bg-white text-blue-900 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats - Only show for non-dashboard views */}
          {viewMode !== 'dashboard' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'Total', value: stats.total, color: 'bg-blue-500' },
                { label: 'Pending', value: stats.pendente, color: 'bg-yellow-500' },
                { label: 'Confirmed', value: stats.confirmado, color: 'bg-green-500' },
                { label: 'Completed', value: stats.concluido, color: 'bg-gray-500' },
                { label: 'Cancelled', value: stats.cancelado, color: 'bg-red-500' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className={viewMode === 'dashboard' ? '' : 'bg-white rounded-lg shadow-sm'}>
            {viewMode === 'dashboard' && <DashboardTab />}
            {viewMode === 'calendar' && <CalendarView />}
            {viewMode === 'list' && (
              <BookingList 
                bookings={filteredBookings}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            )}
            {viewMode === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}