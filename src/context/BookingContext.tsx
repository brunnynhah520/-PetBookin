import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Service, Pet, Customer, Booking } from '../types';

interface BookingState {
  currentStep: number;
  selectedServices: Service[];
  customer: Customer | null;
  pet: Pet | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  totalPrice: number;
  extraCharges: {
    fleas: boolean;
    tangled: boolean;
    aggressive: boolean;
    fleaCharge: number;
    tangledCharge: number;
    aggressiveCharge: number;
  };
  termsAccepted: boolean;
}

type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_CUSTOMER'; payload: Customer }
  | { type: 'SET_PET'; payload: Pet }
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'CALCULATE_TOTAL' }
  | { type: 'SET_EXTRA_CHARGES'; payload: any }
  | { type: 'SET_TERMS_ACCEPTED'; payload: boolean }
  | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
  currentStep: 1,
  selectedServices: [],
  customer: null,
  pet: null,
  selectedDate: null,
  selectedTime: null,
  totalPrice: 0,
  extraCharges: {
    fleas: false,
    tangled: false,
    aggressive: false,
    fleaCharge: 0,
    tangledCharge: 0,
    aggressiveCharge: 0,
  },
  termsAccepted: false,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SERVICES':
      const totalPrice = action.payload.reduce((sum, service) => sum + service.price, 0);
      return { ...state, selectedServices: action.payload, totalPrice };
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload };
    case 'SET_PET':
      return { ...state, pet: action.payload };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_TIME':
      return { ...state, selectedTime: action.payload };
    case 'CALCULATE_TOTAL':
      const total = state.selectedServices.reduce((sum, service) => sum + service.price, 0);
      return { ...state, totalPrice: total };
    case 'SET_EXTRA_CHARGES':
      return { 
        ...state, 
        extraCharges: {
          fleas: action.payload.fleas,
          tangled: action.payload.tangled,
          aggressive: action.payload.aggressive,
          fleaCharge: action.payload.fleaCharge,
          tangledCharge: action.payload.tangledCharge,
          aggressiveCharge: action.payload.aggressiveCharge,
        },
        totalPrice: action.payload.totalPrice || state.totalPrice
      };
    case 'SET_TERMS_ACCEPTED':
      return { ...state, termsAccepted: action.payload };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}