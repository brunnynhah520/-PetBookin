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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{dayBookings.length}</p>
              <p className="text-sm text-blue-600">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">
                {dayBookings.filter(b => b.status === 'pendente').length}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                {dayBookings.filter(b => b.status === 'confirmado').length}
              </p>
              <p className="text-sm text-green-600">Confirmed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <PawPrint className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {dayBookings.filter(b => b.status === 'concluido').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
          <h3 className="text-lg font-semibold">Daily Schedule</h3>
          <p className="text-blue-100 text-sm">Click on time slots to edit bookings or block times</p>
        </div>

        <div className="p-4">
          <div className="grid gap-2">
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
                      ? `${getStatusColor(booking.status)} hover:shadow-md`
                      : isBlocked
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : isLunchTime
                      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      
                      {booking && (
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <PawPrint className="w-4 h-4" />
                            <span>{booking.pet.name}</span>
                          </div>
                        </div>
                      )}
                      
                      {isBlocked && (
                        <div className="flex items-center space-x-2">
                          <Ban className="w-4 h-4" />
                          <span>Blocked Time</span>
                        </div>
                      )}
                      
                      {isLunchTime && (
                        <span>Lunch Time</span>
                      )}
                      
                      {!booking && !isBlocked && !isLunchTime && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Plus className="w-4 h-4" />
                          <span>Available (click to block)</span>
                        </div>
                      )}
                    </div>

                    {booking && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {booking.services.map(s => s.name).join(', ')}
                        </div>
                        <div className="font-bold text-orange-600">
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
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Cancelled/Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}