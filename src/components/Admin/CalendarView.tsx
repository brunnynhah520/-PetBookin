import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Booking } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import DailyScheduleView from './DailyScheduleView';
import BookingDetailModal from './BookingDetailModal';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookings } = useAdmin();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (viewMode === 'day') {
    return (
      <>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('month')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Back to Calendar</span>
            </button>
            <h2 className="text-xl font-semibold text-blue-900">Daily View</h2>
          </div>
        </div>
        
        <DailyScheduleView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onBookingClick={handleBookingClick}
        />
        
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
        />

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">How to use:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Click on any day to see the detailed schedule</li>
                <li>• Click on a booking to edit it</li>
                <li>• In the daily view, click on empty slots to block them</li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            {format(currentDate, 'MMMM yyyy', { locale: enUS })}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {daysInMonth.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={`min-h-32 p-2 border border-gray-200 ${
                  isToday ? 'bg-orange-50 border-orange-200' : 'bg-white'
                } cursor-pointer hover:bg-gray-50 transition-colors`}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {format(date, 'd')}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingClick(booking);
                      }}
                      className={`text-xs p-1 rounded border ${getStatusColor(booking.status)}`}
                    >
                      <div className="font-medium">{booking.time}</div>
                      <div className="truncate">{booking.pet.name}</div>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {[
            { status: 'pending', label: 'Pending' },
            { status: 'confirmed', label: 'Confirmed' },
            { status: 'completed', label: 'Completed' },
            { status: 'cancelled', label: 'Cancelled' },
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded border ${getStatusColor(status)}`}></div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
      />
      
      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">How to use:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Click on any day to see the detailed schedule</li>
              <li>• Click on a booking to edit it</li>
              <li>• In the daily view, click on empty slots to block them</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}