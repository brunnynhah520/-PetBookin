import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, DollarSign } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { availableServices } from '../../utils/services';

export default function ServiceSelection() {
  const { state, dispatch } = useBooking();

  const toggleService = (service: any) => {
    const isSelected = state.selectedServices.some(s => s.id === service.id);
    let newServices;
    
    if (isSelected) {
      newServices = state.selectedServices.filter(s => s.id !== service.id);
    } else {
      newServices = [...state.selectedServices, service];
    }
    
    dispatch({ type: 'SET_SERVICES', payload: newServices });
  };

  const handleNext = () => {
    if (state.selectedServices.length > 0) {
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Choose Services</h2>
        <p className="text-gray-700 text-lg">Select one or more services for your pet</p>
      </div>

      <div className="grid gap-4 w-full">
        {availableServices.map((service, index) => {
          const isSelected = state.selectedServices.some(s => s.id === service.id);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => toggleService(service)}
              className={`relative p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 w-full ${
                isSelected
                  ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 shadow-xl shadow-orange-200/50'
                  : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-gray-200/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-blue-900 text-base md:text-lg">{service.name}</h3>
                    {isSelected && (
                      <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-1 rounded-full shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3 text-sm md:text-base">{service.description}</p>
                  <div className="flex items-center justify-between md:space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex flex-col items-end text-orange-600 font-bold">
                      <span className="text-xs text-gray-500 font-normal">(starting from)</span>
                      <div className="flex items-center space-x-1 text-base">
                      <span>${service.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-4 md:p-6 shadow-lg w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <span className="font-bold text-blue-900 text-lg">
              {state.selectedServices.length} service(s) selected
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              ${state.totalPrice.toFixed(2)}
            </span>
          </div>
        </motion.div>
      )}

      <button
        onClick={handleNext}
        disabled={state.selectedServices.length === 0}
        className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 rounded-2xl font-bold text-base md:text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:from-orange-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Continue
      </button>
    </div>
  );
}