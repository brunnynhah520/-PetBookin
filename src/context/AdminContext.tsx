import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, AdminSettings } from '../types';

interface AdminContextType {
  bookings: Booking[];
  blockedSlots: string[];
  settings: AdminSettings;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  blockTimeSlot: (slot: string) => void;
  unblockTimeSlot: (slot: string) => void;
  updateSettings: (settings: Partial<AdminSettings>) => void;
}

const defaultSettings: AdminSettings = {
  workingHours: {
    start: '08:00',
    end: '18:00',
  },
  workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  serviceInterval: 30,
  lunchBreak: {
    start: '12:30',
    end: '13:30',
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Sample data for testing
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      customer: {
        name: 'Maria Silva',
        phone: '(12) 99999-1111',
        email: 'maria@email.com',
        cpf: '123.456.789-00'
      },
      pet: {
        name: 'Rex',
        breed: 'Labrador',
        size: 'large'
      },
      services: [
        { id: '1', name: 'Bath', duration: 60, price: 35.00 },
        { id: '3', name: 'Machine Grooming', duration: 45, price: 40.00 }
      ],
      date: new Date(),
      time: '09:00',
      totalPrice: 75.00,
      status: 'confirmed',
      createdAt: new Date(),
      extraCharges: {
        fleas: false,
        tangled: false,
        aggressive: false,
        fleaCharge: 0,
        tangledCharge: 0,
        aggressiveCharge: 0
      },
      termsAccepted: true
    },
    {
      id: '2',
      customer: {
        name: 'João Santos',
        phone: '(12) 99999-2222',
        email: 'joao@email.com',
        cpf: '987.654.321-00'
      },
      pet: {
        name: 'Bella',
        breed: 'Poodle',
        size: 'medium'
      },
      services: [
        { id: '1', name: 'Bath', duration: 60, price: 35.00 },
        { id: '2', name: 'Sanitary Trim', duration: 30, price: 25.00 }
      ],
      date: new Date(),
      time: '14:00',
      totalPrice: 60.00,
      status: 'pending',
      createdAt: new Date(),
      extraCharges: {
        fleas: false,
        tangled: false,
        aggressive: false,
        fleaCharge: 0,
        tangledCharge: 0,
        aggressiveCharge: 0
      },
      termsAccepted: true
    }
  ]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev =>
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const blockTimeSlot = (slot: string) => {
    setBlockedSlots(prev => [...prev, slot]);
  };

  const unblockTimeSlot = (slot: string) => {
    setBlockedSlots(prev => prev.filter(s => s !== slot));
  };

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminContext.Provider value={{
      bookings,
      blockedSlots,
      settings,
      addBooking,
      updateBooking,
      deleteBooking,
      blockTimeSlot,
      unblockTimeSlot,
      updateSettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}