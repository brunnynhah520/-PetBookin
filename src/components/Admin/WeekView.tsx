import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, PawPrint } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { generateTimeSlots } from '../../utils/dates';
import { Booking } from '../../types';

interface WeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

export default function WeekView({ selectedDate, onDateChange, onDayClick, onBookingClick }: WeekViewProps) {
  const { bookings, settings } = useAdmin();
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getTimeSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayBookings = getBookingsForDate(date);
    const bookedSlots = dayBookings
      .filter(booking => booking.status !== 'cancelled')
      .map(booking => booking.time);
    
    return generateTimeSlots(
      settings.workingHours.start,
      settings.workingHours.end,
      settings.serviceInterval,
      settings.lunchBreak.start,
      settings.lunchBreak.end,
      bookedSlots,
      []
    );
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

  const goToPreviousWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    onDateChange(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    onDateChange(newWeek);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(today);
    onDateChange(today);
  };

  return (
    <div className="p-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900">
              {format(weekStart, "MMM dd", { locale: enUS })} - {format(weekEnd, "MMM dd, yyyy", { locale: enUS })}
            </h2>
            <p className="text-gray-600">Week View</p>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Day Headers */}
        {weekDays.map((day, index) => (
          <div key={day.toISOString()} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
            <div className="font-semibold text-sm">
              {format(day, 'EEE', { locale: enUS })}
            </div>
            <div className={`text-lg font-bold mt-1 ${isToday(day) ? 'bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Day Content */}
        {weekDays.map((day, index) => {
          const dayBookings = getBookingsForDate(day);
          const timeSlots = getTimeSlotsForDate(day);
          const availableSlots = timeSlots.filter(slot => slot.available).length;
          const totalSlots = timeSlots.length;

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onDayClick(day)}
              className={`min-h-96 p-3 border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSameDay(day, selectedDate) ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              {/* Day Summary */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{dayBookings.length} bookings</span>
                  <span>{availableSlots}/{totalSlots} free</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalSlots > 0 ? ((totalSlots - availableSlots) / totalSlots) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-2">
                {dayBookings.slice(0, 6).map((booking) => (
                  <div
                    key={booking.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(booking);
                    }}
                    className={`text-xs p-2 rounded border cursor-pointer hover:shadow-sm transition-all ${getStatusColor(booking.status)}`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{booking.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <PawPrint className="w-3 h-3" />
                      <span className="truncate">{booking.pet.name}</span>
                    </div>
                  </div>
                ))}
                
                {dayBookings.length > 6 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayBookings.length - 6} more
                  </div>
                )}

                {dayBookings.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">
                    No bookings
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
  );
}