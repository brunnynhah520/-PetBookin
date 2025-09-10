import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, PawPrint } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCpf: string;
  petName: string;
  petBreed: string;
  petSize: 'small' | 'medium' | 'large';
}

export default function CustomerInfo() {
  const { state, dispatch } = useBooking();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    dispatch({
      type: 'SET_CUSTOMER',
      payload: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        cpf: data.customerCpf,
      }
    });

    dispatch({
      type: 'SET_PET',
      payload: {
        name: data.petName,
        breed: data.petBreed,
        size: data.petSize,
      }
    });

    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Your Details</h2>
        <p className="text-gray-600">Enter your details and your pet's information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
            <User className="w-5 h-5" />
            <span>Your Details</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                {...register('customerName', { required: 'Nome é obrigatório' })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Your full name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone/WhatsApp *
                </label>
                <input
                  {...register('customerPhone', { required: 'Telefone é obrigatório' })}
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="(12) 99999-9999"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  {...register('customerEmail')}
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number *
              </label>
              <input
                {...register('customerCpf', { required: 'CPF é obrigatório' })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="000.000.000-00"
              />
              {errors.customerCpf && (
                <p className="text-red-500 text-sm mt-1">{errors.customerCpf.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pet Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
            <PawPrint className="w-5 h-5" />
            <span>Pet Details</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  {...register('petName', { required: 'Nome do pet é obrigatório' })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Your pet's name"
                />
                {errors.petName && (
                  <p className="text-red-500 text-sm mt-1">{errors.petName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <input
                  {...register('petBreed', { required: 'Raça é obrigatória' })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="e.g., Labrador, Mixed breed, etc."
                />
                {errors.petBreed && (
                  <p className="text-red-500 text-sm mt-1">{errors.petBreed.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Size *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['small', 'medium', 'large'].map((size) => (
                  <label key={size} className="flex items-center cursor-pointer">
                    <input
                      {...register('petSize', { required: 'Porte é obrigatório' })}
                      type="radio"
                      value={size}
                      className="sr-only"
                    />
                    <div className="flex-1 p-3 text-center border border-gray-300 rounded-lg hover:border-orange-400 transition-colors peer-checked:border-orange-400 peer-checked:bg-orange-50">
                      <span className="capitalize font-medium">{size}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.petSize && (
                <p className="text-red-500 text-sm mt-1">{errors.petSize.message}</p>
              )}
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
            type="submit"
            className="flex-1 bg-orange-400 text-white py-4 rounded-xl font-semibold hover:bg-orange-500 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
}