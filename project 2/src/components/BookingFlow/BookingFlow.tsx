import React from 'react';
import { useBooking } from '../../context/BookingContext';
import StepIndicator from './StepIndicator';
import ServiceSelection from './ServiceSelection';
import CustomerInfo from './CustomerInfo';
import DateTimeSelection from './DateTimeSelection';
import ExtraCharges from './ExtraCharges';
import BookingConfirmation from './BookingConfirmation';

const stepTitles = ['Services', 'Details', 'Date/Time', 'Finalize', 'Confirm'];

export default function BookingFlow() {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <ServiceSelection />;
      case 2:
        return <CustomerInfo />;
      case 3:
        return <DateTimeSelection />;
      case 4:
        return <ExtraCharges />;
      case 5:
        return <BookingConfirmation />;
      default:
        return <ServiceSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      
      <StepIndicator
        currentStep={state.currentStep}
        totalSteps={5}
        stepTitles={stepTitles}
      />
      
      <div className="w-full px-4 py-8">
        <div className="max-w-2xl mx-auto w-full">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}