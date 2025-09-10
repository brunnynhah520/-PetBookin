import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAdmin } from '../../context/AdminContext';
import { getAvailableDates, generateTimeSlots, formatDate } from '../../utils/dates';
import SameDayWarning from './SameDayWarning';
import { isSameDay } from 'date-fns';

export default function DateTimeSelection() {
  const { state, dispatch } = useBooking();
  const { settings, bookings, blockedSlots } = useAdmin();
  const [selectedDate, setSelectedDate] = useState<Date | null>(state.selectedDate);
  const [showSameDayWarning, setShowSameDayWarning] = useState(false);

  const availableDates = getAvailableDates(settings.workingDays);
  
  const getTimeSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const bookedSlots = bookings
      .filter(booking => {
        const bookingDate = booking.date.toISOString().split('T')[0];
        return bookingDate === dateString && booking.status !== 'cancelado';
      })
      .map(booking => booking.time);

    const dateBlockedSlots = blockedSlots.filter(slot => slot.startsWith(dateString));
    
    return generateTimeSlots(
      settings.workingHours.start,
      settings.workingHours.end,
      settings.serviceInterval,
      settings.lunchBreak.start,
      settings.lunchBreak.end,
      bookedSlots,
      dateBlockedSlots.map(slot => slot.split(' ')[1])
    );
  };

  const handleDateSelect = (date: Date) => {
    // Check if trying to select today
    if (isSameDay(date, new Date())) {
      setShowSameDayWarning(true);
      return;
    }
    
    setSelectedDate(date);
    dispatch({ type: 'SET_DATE', payload: date });
    dispatch({ type: 'SET_TIME', payload: '' });
  };

  const handleTimeSelect = (time: string) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const handleNext = () => {
    if (selectedDate && state.selectedTime) {
      dispatch({ type: 'SET_STEP', payload: 4 });
    }
  };

  const timeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  return (
    <>
      {showSameDayWarning && <SameDayWarning />}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Date and Time</h2>
          <p className="text-gray-600">Choose when you want to bring your pet</p>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
            <Calendar className="w-5 h-5" />
            <span>Select Date</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableDates.slice(0, 14).map((date, index) => {
              const isSelected = selectedDate && 
                date.toDateString() === selectedDate.toDateString();
              
              return (
                <motion.button
                  key={date.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-orange-400 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <div className="font-medium">
                    {formatDate(date)}
                  </div>
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
              <Clock className="w-5 h-5" />
              <span>Select Time</span>
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((slot, index) => {
                const isSelected = state.selectedTime === slot.time;
                
                return (
                  <motion.button
                    key={slot.time}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !slot.available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-orange-400 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {slot.time}
                  </motion.button>
                );
              })}
            </div>

            {timeSlots.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No times available for this date
              </div>
            )}
          </motion.div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedDate || !state.selectedTime}
            className="flex-1 bg-orange-400 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-500 transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </>
  );
}