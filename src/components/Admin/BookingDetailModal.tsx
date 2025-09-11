import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, User, PawPrint, Scissors, Save, Trash2, Ban } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../../context/AdminContext';
import { Booking, Service } from '../../types';
import { availableServices } from '../../utils/services';
import { generateTimeSlots, getAvailableDates } from '../../utils/dates';

interface BookingDetailModalProps {
  booking: Booking | null;
  mode: 'edit' | 'create';
  initialData?: { date: Date; time: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCpf: string;
  petName: string;
  petBreed: string;
  petSize: 'small' | 'medium' | 'large';
  date: string;
  time: string;
  services: string[];
  hasFleas: boolean;
  hasTangledFur: boolean;
  isAggressive: boolean;
  tangledCharge: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function BookingDetailModal({ booking, mode, initialData, isOpen, onClose }: BookingDetailModalProps) {
  const { updateBooking, deleteBooking, addBooking, settings, bookings } = useAdmin();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>();

  const watchedDate = watch('date');
  const watchedServices = watch('services') || [];
  const watchedHasFleas = watch('hasFleas');
  const watchedHasTangledFur = watch('hasTangledFur');
  const watchedIsAggressive = watch('isAggressive');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && booking) {
        // Edit mode - populate with booking data
        reset({
          customerName: booking.customer.name,
          customerPhone: booking.customer.phone,
          customerEmail: booking.customer.email || '',
          customerCpf: booking.customer.cpf,
          petName: booking.pet.name,
          petBreed: booking.pet.breed,
          petSize: booking.pet.size,
          date: booking.date.toISOString().split('T')[0],
          time: booking.time,
          services: booking.services.map(s => s.id),
          hasFleas: booking.extraCharges.fleas,
          hasTangledFur: booking.extraCharges.tangled,
          isAggressive: booking.extraCharges.aggressive,
          tangledCharge: booking.extraCharges.tangledCharge,
          status: booking.status,
        });
        setSelectedDate(booking.date);
      } else if (mode === 'create' && initialData) {
        // Create mode - populate with initial data
        reset({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          customerCpf: '',
          petName: '',
          petBreed: '',
          petSize: 'medium',
          date: initialData.date.toISOString().split('T')[0],
          time: initialData.time,
          services: [],
          hasFleas: false,
          hasTangledFur: false,
          isAggressive: false,
          tangledCharge: 15,
          status: 'pending',
        });
        setSelectedDate(initialData.date);
      } else {
        // Fallback reset
        reset({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          customerCpf: '',
          petName: '',
          petBreed: '',
          petSize: 'medium',
          date: new Date().toISOString().split('T')[0],
          time: '',
          services: [],
          hasFleas: false,
          hasTangledFur: false,
          isAggressive: false,
          tangledCharge: 15,
          status: 'pending',
        });
      }
    }
  }, [mode, booking, initialData, isOpen, reset]);

  // Remove the old useEffect that was only for booking
  /*
  useEffect(() => {
    if (booking && isOpen) {
      reset({
        customerName: booking.customer.name,
        customerPhone: booking.customer.phone,
        customerEmail: booking.customer.email || '',
        customerCpf: booking.customer.cpf,
        petName: booking.pet.name,
        petBreed: booking.pet.breed,
        petSize: booking.pet.size,
        date: booking.date.toISOString().split('T')[0],
        time: booking.time,
        services: booking.services.map(s => s.id),
        hasFleas: booking.extraCharges.fleas,
        hasTangledFur: booking.extraCharges.tangled,
        isAggressive: booking.extraCharges.aggressive,
        tangledCharge: booking.extraCharges.tangledCharge,
        status: booking.status,
      });
      setSelectedDate(booking.date);
    }
  }, [booking, isOpen, reset]);
  */

  useEffect(() => {
    if (watchedDate) {
      const date = new Date(watchedDate);
      setSelectedDate(date);
      
      // Get booked slots for this date (excluding current booking)
      const bookedSlots = bookings
        .filter(b => 
          b.id !== booking?.id && 
          b.date.toISOString().split('T')[0] === watchedDate && 
          b.status !== 'cancelado'
        )
        .map(b => b.time);

      const timeSlots = generateTimeSlots(
        settings.workingHours.start,
        settings.workingHours.end,
        settings.serviceInterval,
        settings.lunchBreak.start,
        settings.lunchBreak.end,
        bookedSlots,
        []
      );

      setAvailableTimeSlots(timeSlots);
    }
  }, [watchedDate, bookings, booking?.id, settings]);

  const calculateTotal = () => {
    const selectedServices = availableServices.filter(s => watchedServices.includes(s.id));
    let total = selectedServices.reduce((sum, service) => sum + service.price, 0);

    if (watchedHasFleas) total += 20;
    if (watchedHasTangledFur) total += Number(watch('tangledCharge')) || 15;
    if (watchedIsAggressive) {
      const bathService = selectedServices.find(s => s.name.toLowerCase().includes('banho'));
      if (bathService) total += bathService.price * 0.5;
    }

    return total;
  };

  const onSubmit = (data: FormData) => {
    const selectedServiceObjects = availableServices.filter(s => data.services.includes(s.id));
    const fleaCharge = data.hasFleas ? 20 : 0;
    const tangledCharge = data.hasTangledFur ? Number(data.tangledCharge) || 15 : 0;
    const bathService = selectedServiceObjects.find(s => s.name.toLowerCase().includes('banho'));
    const aggressiveCharge = data.isAggressive && bathService ? bathService.price * 0.5 : 0;

    const bookingData = {
      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        cpf: data.customerCpf,
      },
      pet: {
        name: data.petName,
        breed: data.petBreed,
        size: data.petSize,
      },
      date: new Date(data.date),
      time: data.time,
      services: selectedServiceObjects,
      totalPrice: calculateTotal(),
      status: data.status,
      extraCharges: {
        fleas: data.hasFleas,
        tangled: data.hasTangledFur,
        aggressive: data.isAggressive,
        fleaCharge,
        tangledCharge,
        aggressiveCharge,
      },
      termsAccepted: true,
    };

    if (mode === 'edit' && booking) {
      updateBooking(booking.id, bookingData);
    } else if (mode === 'create') {
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      addBooking(newBooking);
    }

    onClose();
  };

  const handleDelete = () => {
    if (booking && window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(booking.id);
      onClose();
    }
  };

  const handleCancel = () => {
    if (booking) {
      updateBooking(booking.id, { status: 'cancelled' });
      onClose();
    }
  };

  if (!isOpen) return null;

  const availableDates = getAvailableDates(settings.workingDays, 60); // 60 days ahead

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {mode === 'edit' ? 'Edit Booking' : 'Create New Booking'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
              <User className="w-5 h-5" />
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  {...register('customerName', { required: 'Name is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  {...register('customerPhone', { required: 'Phone is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  {...register('customerEmail')}
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                <input
                  {...register('customerCpf', { required: 'ID Number is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.customerCpf && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerCpf.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
              <PawPrint className="w-5 h-5" />
              <span>Pet Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                <input
                  {...register('petName', { required: 'Pet name is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.petName && (
                  <p className="text-red-500 text-sm mt-1">{errors.petName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                <input
                  {...register('petBreed', { required: 'Breed is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.petBreed && (
                  <p className="text-red-500 text-sm mt-1">{errors.petBreed.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  {...register('petSize', { required: 'Size is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                {errors.petSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.petSize.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
              <Calendar className="w-5 h-5" />
              <span>Date and Time</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  {...register('time', { required: 'Time is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  {availableTimeSlots.map(slot => (
                    <option 
                      key={slot.time} 
                      value={slot.time}
                      disabled={!slot.available && slot.time !== booking.time}
                    >
                      {slot.time} {!slot.available && slot.time !== booking.time ? '(Occupied)' : ''}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
              <Scissors className="w-5 h-5" />
              <span>Services</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map(service => (
                <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    {...register('services')}
                    type="checkbox"
                    value={service.id}
                    className="rounded border-gray-300 text-blue-400 focus:ring-blue-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-500 ml-2">${service.price.toFixed(2)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Extra Charges */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Extra Charges</h3>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  {...register('hasFleas')}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-400 focus:ring-blue-400"
                />
                <span>Fleas (+$20.00)</span>
              </label>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    {...register('hasTangledFur')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-400 focus:ring-blue-400"
                  />
                  <span>Tangled Fur</span>
                </label>
                {watchedHasTangledFur && (
                  <input
                    {...register('tangledCharge', { min: 15 })}
                    type="number"
                    min="15"
                    step="0.01"
                    placeholder="15.00"
                    className="ml-6 w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                )}
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  {...register('isAggressive')}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-400 focus:ring-blue-400"
                />
                <span>Aggressive Pet (+50% of bath)</span>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-blue-900">Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{mode === 'edit' ? 'Save Changes' : 'Create Booking'}</span>
            </button>

            {mode === 'edit' && (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Ban className="w-5 h-5" />
                  <span>Cancel Booking</span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}