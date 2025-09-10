import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, PawPrint, Scissors, Phone } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAdmin } from '../../context/AdminContext';
import { formatDateTime } from '../../utils/dates';
import { sendAllNotifications } from '../../utils/whatsapp';
import { Booking } from '../../types';

export default function BookingConfirmation() {
  const { state, dispatch } = useBooking();
  const { addBooking } = useAdmin();

  const handleConfirm = () => {
    if (!state.customer || !state.pet || !state.selectedDate || !state.selectedTime) {
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      customer: state.customer,
      pet: state.pet,
      services: state.selectedServices,
      date: state.selectedDate,
      time: state.selectedTime,
      totalPrice: state.totalPrice,
      status: 'pendente',
      createdAt: new Date(),
      extraCharges: state.extraCharges,
      termsAccepted: state.termsAccepted,
    };

    addBooking(booking);

    // Send WhatsApp notifications to both customer and owner
    sendAllNotifications(booking);

    // Reset booking flow
    dispatch({ type: 'RESET_BOOKING' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  if (!state.customer || !state.pet || !state.selectedDate || !state.selectedTime) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Confirm Booking</h2>
        <p className="text-gray-600">Review the details before confirming</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4">
          <h3 className="text-lg font-semibold">Booking Summary</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Date and Time */}
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Date and Time</p>
              <p className="text-gray-600">
                {formatDateTime(state.selectedDate, state.selectedTime)}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Customer</p>
              <p className="text-gray-600">{state.customer.name}</p>
              <p className="text-gray-500 text-sm">{state.customer.phone}</p>
              <p className="text-gray-500 text-sm">ID: {state.customer.cpf}</p>
            </div>
          </div>

          {/* Pet */}
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <PawPrint className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Pet</p>
              <p className="text-gray-600">{state.pet.name} ({state.pet.breed})</p>
              <p className="text-gray-500 text-sm capitalize">Size: {state.pet.size}</p>
            </div>
          </div>

          {/* Services */}
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Scissors className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900 mb-2">Services</p>
              <div className="space-y-2">
                {state.selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="text-gray-900 font-medium">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                {/* Extra Charges */}
                {state.extraCharges.fleaCharge > 0 && (
                  <div className="flex justify-between items-center text-orange-600">
                    <span>Fee - Fleas</span>
                    <span>${state.extraCharges.fleaCharge.toFixed(2)}</span>
                  </div>
                )}
                {state.extraCharges.tangledCharge > 0 && (
                  <div className="flex justify-between items-center text-orange-600">
                    <span>Fee - Tangled Fur</span>
                    <span>${state.extraCharges.tangledCharge.toFixed(2)}</span>
                  </div>
                )}
                {state.extraCharges.aggressiveCharge > 0 && (
                  <div className="flex justify-between items-center text-orange-600">
                    <span>Fee - Aggressive Pet (50% bath)</span>
                    <span>${state.extraCharges.aggressiveCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-semibold text-blue-900">Total</span>
                  <span className="text-xl font-bold text-orange-600">
                    ${state.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <p className="font-medium text-green-800">WhatsApp Notifications</p>
            <p className="text-green-700 text-sm">
              After confirming, you will receive a confirmation on WhatsApp and the pet grooming service 
              will also be notified about your booking.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </motion.div>
  );
}