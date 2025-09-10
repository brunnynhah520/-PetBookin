import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 md:p-6 shadow-lg border-b-4 border-gradient-to-r from-orange-200 to-pink-200 w-full">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200'
                      : isCurrent
                      ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-orange-200 animate-pulse'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 md:w-5 md:h-5" />
                  ) : (
                    <span className="text-xs md:text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className="text-xs mt-1 md:mt-2 text-center text-gray-700 max-w-16 md:max-w-20 font-medium">
                  {stepTitles[index]}
                </span>
              </div>
              
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 md:mx-2 transition-colors duration-300 rounded-full ${
                    isCompleted ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}