import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, PawPrint, Plus, Ban } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { generateTimeSlots } from '../../utils/dates';
import { Booking } from '../../types';

interface DailyScheduleViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

export default function DailyScheduleView({ selectedDate, onDateChange, onBookingClick }: DailyScheduleViewProps) {
  const { bookings, settings, blockedSlots, blockTimeSlot, unblockTimeSlot } = useAdmin();

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getTimeSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayBookings = getBookingsForDate(date);
    const bookedSlots = dayBookings
      .filter(booking => booking.status !== 'cancelado')
      .map(booking => booking.time);

    const dateBlockedSlots = blockedSlots
      .filter(slot => slot.startsWith(dateString))
      .map(slot => slot.split(' ')[1]);
    
    return generateTimeSlots(
      settings.workingHours.start,
      settings.workingHours.end,
      settings.serviceInterval,
      settings.lunchBreak.start,
      settings.lunchBreak.end,
      bookedSlots,
      dateBlockedSlots
    );
  };

  const getBookingForTimeSlot = (time: string) => {
    const dayBookings = getBookingsForDate(selectedDate);
    return dayBookings.find(booking => booking.time === time);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluido': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleSlotClick = (time: string) => {
    const booking = getBookingForTimeSlot(time);
    if (booking) {
      onBookingClick(booking);
    } else {
      // Toggle block/unblock for empty slots
      const dateString = selectedDate.toISOString().split('T')[0];
      const slotKey = `${dateString} ${time}`;
      
      if (blockedSlots.includes(slotKey)) {
        unblockTimeSlot(slotKey);
      } else {
        blockTimeSlot(slotKey);
      }
    }
  };

  const isSlotBlocked = (time: string) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const slotKey = `${dateString} ${time}`;
    return blockedSlots.includes(slotKey);
  };

  const timeSlots = getTimeSlotsForDate(selectedDate);
  const dayBookings = getBookingsForDate(selectedDate);

  return (
    <div className="p-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onDateChange(subDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900">
              {format(selectedDate, "MMMM dd", { locale: enUS })}
            </h2>
            <p className="text-gray-600">
              {format(selectedDate, 'EEEE', { locale: enUS })}
            </p>
          </div>
          
          <button
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDateChange(new Date())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-blue-900">{dayBookings.length}</p>
              <p className="text-xs text-blue-600 font-medium">Total Bookings</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-900">
                {dayBookings.filter(b => b.status === 'pendente').length}
              </p>
              <p className="text-xs text-yellow-600 font-medium">Pending</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-900">
                {dayBookings.filter(b => b.status === 'confirmado').length}
              </p>
              <p className="text-xs text-green-600 font-medium">Confirmed</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-gray-500 p-2 rounded-lg">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {dayBookings.filter(b => b.status === 'concluido').length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Completed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time Slots Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
      >
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Daily Schedule</h3>
              <p className="text-blue-100 text-sm mt-1">Click on time slots to edit bookings or block times</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-3">
            {timeSlots.map((slot, index) => {
              const booking = getBookingForTimeSlot(slot.time);
              const isBlocked = isSlotBlocked(slot.time);
              const isLunchTime = !slot.available && !booking && !isBlocked;

              return (
                <motion.div
                  key={slot.time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  onClick={() => !isLunchTime && handleSlotClick(slot.time)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    booking
                      ? `${getStatusColor(booking.status)} hover:shadow-lg transform hover:scale-[1.02]`
                      : isBlocked
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-700 hover:from-red-100 hover:to-red-200 shadow-sm'
                      : isLunchTime
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-600 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:shadow-md transform hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between min-h-[60px]">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${
                          booking ? 'bg-white/20' : 
                          isBlocked ? 'bg-red-200' : 
                          isLunchTime ? 'bg-gray-300' : 'bg-blue-100'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg">{slot.time}</span>
                      </div>
                      
                      {booking && (
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                          <div className="flex items-center space-x-2">
                            <div className="bg-white/30 p-1 rounded">
                              <User className="w-3 h-3" />
                            </div>
                            <span className="font-semibold text-sm">{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="bg-white/30 p-1 rounded">
                              <PawPrint className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-sm">{booking.pet.name}</span>
                          </div>
                        </div>
                      )}
                      
                      {isBlocked && (
                        <div className="flex items-center space-x-2">
                          <Ban className="w-5 h-5" />
                          <span className="font-semibold">Blocked Time</span>
                        </div>
                      )}
                      
                      {isLunchTime && (
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-400 p-1 rounded">
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-semibold">Lunch Time</span>
                        </div>
                      )}
                      
                      {!booking && !isBlocked && !isLunchTime && (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">Available - Click to block</span>
                        </div>
                      )}
                    </div>

                    {booking && (
                      <div className="text-right bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-xs font-medium mb-1 opacity-80">
                          {booking.services.map(s => s.name).join(', ')}
                        </div>
                        <div className="font-bold text-lg">
                          ${booking.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
      >
        <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="bg-gray-500 p-2 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span>Status Legend</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-lg shadow-sm"></div>
            <span className="font-medium text-gray-700">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 rounded-lg shadow-sm"></div>
            <span className="font-medium text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg shadow-sm"></div>
            <span className="font-medium text-gray-700">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 rounded-lg shadow-sm"></div>
            <span className="font-medium text-gray-700">Cancelled/Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg shadow-sm"></div>
            <span className="font-medium text-gray-700">Available</span>
          </div>
        </div>
    </div>
  );
}