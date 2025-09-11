import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useBooking } from '../../context/BookingContext';

interface ExtraChargesData {
  hasFleas: boolean;
  hasTangledFur: boolean;
  isAggressive: boolean;
  tangledCharge: number;
  termsAccepted: boolean;
}

export default function ExtraCharges() {
  const { state, dispatch } = useBooking();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExtraChargesData>({
    defaultValues: {
      hasFleas: false,
      hasTangledFur: false,
      isAggressive: false,
      tangledCharge: 15,
      termsAccepted: false
    }
  });

  const hasFleas = watch('hasFleas');
  const hasTangledFur = watch('hasTangledFur');
  const isAggressive = watch('isAggressive');
  const termsAccepted = watch('termsAccepted');

  const onSubmit = (data: ExtraChargesData) => {
    const fleaCharge = data.hasFleas === true ? 20 : 0;
    const tangledCharge = data.hasTangledFur === true ? Number(data.tangledCharge) || 0 : 0;
    
    // Calculate aggressive charge (50% of bath service price)
    const bathService = state.selectedServices.find(s => s.name.toLowerCase().includes('banho'));
    const aggressiveCharge = data.isAggressive === true && bathService ? bathService.price * 0.5 : 0;

    // Calculate base price from services only
    const basePrice = state.selectedServices.reduce((sum, service) => sum + service.price, 0);
    const newTotalPrice = basePrice + fleaCharge + tangledCharge + aggressiveCharge;

    dispatch({
      type: 'SET_EXTRA_CHARGES',
      payload: {
        fleas: data.hasFleas === true,
        tangled: data.hasTangledFur === true,
        aggressive: data.isAggressive === true,
        fleaCharge,
        tangledCharge,
        aggressiveCharge,
        totalPrice: newTotalPrice,
      }
    });

    // Set terms accepted
    dispatch({ type: 'SET_TERMS_ACCEPTED', payload: data.termsAccepted });

    // Go to confirmation step (step 5)
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Final Information</h2>
        <p className="text-gray-600">Optional extra services and terms of use</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Optional Extra Services Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Optional Extra Services</h3>
          <p className="text-sm text-blue-700">
            Answer only if your pet needs special care. 
            <strong> You can leave everything as "No" if not needed.</strong>
          </p>
        </div>

        {/* Fleas Question */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Does the pet have fleas?</h3>
              <p className="text-sm text-gray-600">Additional fee of $20.00 if confirmed</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('hasFleas')}
                type="radio"
                value={true}
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>Yes</span>
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                {...register('hasFleas')}
                type="radio"
                value={false}
                defaultChecked
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>No</span>
              </div>
            </label>
          </div>
          
          {hasFleas === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-orange-700">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Additional fee: $20.00</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tangled Fur Question */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Is the pet's fur tangled?</h3>
              <p className="text-sm text-gray-600">Additional fee from $15.00</p>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('hasTangledFur')}
                type="radio"
                value={true}
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>Yes</span>
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                {...register('hasTangledFur')}
                type="radio"
                value={false}
                defaultChecked
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>No</span>
              </div>
            </label>
          </div>

          {hasTangledFur === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-700">
                Additional fee amount (minimum $15.00)
              </label>
              <input
                {...register('tangledCharge', { 
                  required: hasTangledFur === true ? 'Amount is required' : false,
                  min: { value: 15, message: 'Minimum value is $15.00' }
                })}
                type="number"
                min="15"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="15.00"
              />
              {errors.tangledCharge && (
                <p className="text-red-500 text-sm">{errors.tangledCharge.message}</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Aggressive Pet Question */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Is the pet aggressive?</h3>
              <p className="text-sm text-gray-600">Additional fee of 50% of bath service price</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('isAggressive')}
                type="radio"
                value={true}
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>Yes</span>
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                {...register('isAggressive')}
                type="radio"
                value={false}
                defaultChecked
                className="sr-only peer"
              />
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                <span>No</span>
              </div>
            </label>
          </div>
          
          {isAggressive === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-red-700">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">
                  Additional fee: 50% of bath service
                  {state.selectedServices.find(s => s.name.toLowerCase().includes('banho')) && 
                    ` ($${(state.selectedServices.find(s => s.name.toLowerCase().includes('banho'))!.price * 0.5).toFixed(2)})`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-xl">
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <FileText className="w-5 h-5" />
              <span>Terms and Conditions of Use</span>
            </h3>
          </div>

          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">IMPORTANT NOTICE</h4>
                  <p className="text-yellow-700">
                    <strong>The stated booking value is approximate.</strong> Your pet will undergo 
                    evaluation by a professional upon arrival, where the final value will be confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <h4 className="font-semibold text-gray-900">1. Booking and Attendance</h4>
              <p>• Arrive 10 minutes before your scheduled time</p>
              <p>• If you are more than 15 minutes late, the booking may be cancelled</p>
              <p>• Cancellations must be made at least 2 hours in advance</p>

              <h4 className="font-semibold text-gray-900 mt-4">2. Pet Evaluation</h4>
              <p>• All pets will undergo preliminary evaluation before services begin</p>
              <p>• Additional fees may apply depending on the animal's condition</p>
              <p>• Final value will be informed after evaluation</p>

              <h4 className="font-semibold text-gray-900 mt-4">3. Responsibilities</h4>
              <p>• Customer is responsible for informing about pet health issues</p>
              <p>• Aggressive pets will have additional safety fee</p>
              <p>• We are not responsible for personal items left at the establishment</p>

              <h4 className="font-semibold text-gray-900 mt-4">4. Payment</h4>
              <p>• Payment must be made when picking up your pet</p>
              <p>• We accept cash, digital payments and debit/credit cards</p>
              <p>• Values may change according to technical evaluation</p>

              <h4 className="font-semibold text-gray-900 mt-4">5. Privacy Policy</h4>
              <p>• Your data will be used only for booking contact purposes</p>
              <p>• We do not share information with third parties</p>
              <p>• Pet photos may be taken for service records</p>
            </div>
          </div>

          <div className="p-6 border-t">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                {...register('termsAccepted', { required: 'You must accept the terms to continue' })}
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-orange-400 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the terms and conditions of use of PetBooking. 
                I have read and agree to the terms and conditions of use of PetBookin. 
                I am aware that the final value may be changed after technical evaluation of my pet.
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-2">{errors.termsAccepted.message}</p>
            )}
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
            type="submit"
            className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
          >
            Finalize Booking
          </button>
        </div>
      </form>
    </motion.div>
  );
}