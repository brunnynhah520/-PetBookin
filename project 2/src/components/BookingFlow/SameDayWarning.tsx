import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Clock } from 'lucide-react';

export default function SameDayWarning() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de verificar a possibilidade de um agendamento para hoje. Vocês têm algum horário disponível para encaixe?"
    );
    const whatsappUrl = `https://wa.me/5512981746615?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">We are fully booked!</h2>
          <p className="text-gray-600">
            To book for today, please contact an attendant to check for availability
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Service Hours</span>
          </div>
          <p className="text-orange-700 text-sm">
            Monday to Saturday: 8 AM to 6 PM<br />
            Break: 12:30 PM to 1:30 PM
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contact Attendant</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Choose Another Day
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            📍 123 Main Street, Pet City, PC 12345<br />
            📞 (12) 98174-6615
          </p>
        </div>
      </div>
    </motion.div>
  );
}