import React, { useState } from 'react';
import { Calendar as CalendarIcon, Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Booking } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import WeekView from './WeekView';
import DailyScheduleView from './DailyScheduleView';
import BookingDetailModal from './BookingDetailModal';

export default function CalendarView() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingMode, setBookingMode] = useState<'edit' | 'create'>('edit');
  const [initialBookingData, setInitialBookingData] = useState<{ date: Date; time: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setBookingMode('edit');
    setInitialBookingData(null);
    setIsModalOpen(true);
  };

  const handleCreateBooking = (date: Date, time: string) => {
    setSelectedBooking(null);
    setBookingMode('create');
    setInitialBookingData({ date, time });
    setIsModalOpen(true);
  };

  const handleBackToWeek = () => {
    if (isDesktop) {
      setViewMode('week');
    }
  };

  // Auto-switch to day view on mobile
  React.useEffect(() => {
    if (!isDesktop) {
      setViewMode('day');
    } else if (viewMode === 'day') {
      setViewMode('week');
    }
  }, [isDesktop]);

  if (viewMode === 'day' || !isDesktop) {
    return (
      <>
        {isDesktop && (
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToWeek}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Back to Week View</span>
              </button>
              <h2 className="text-xl font-semibold text-blue-900">Daily View</h2>
            </div>
          </div>
        )}
        
        <DailyScheduleView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onBookingClick={handleBookingClick}
          onCreateBooking={handleCreateBooking}
        />
        
        <BookingDetailModal
          booking={selectedBooking}
          mode={bookingMode}
          initialData={initialBookingData}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
            setInitialBookingData(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <WeekView
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onDayClick={handleDayClick}
        onBookingClick={handleBookingClick}
      />
      
      <BookingDetailModal
        booking={selectedBooking}
        mode={bookingMode}
        initialData={initialBookingData}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
          setInitialBookingData(null);
        }}
      />
      
      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">How to use:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Click on any day in the week view to see detailed schedule</li>
              <li>• Click on a booking to edit it</li>
              <li>• In the daily view, click on empty slots to create bookings or block them</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}