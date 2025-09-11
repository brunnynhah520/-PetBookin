export interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  description?: string;
}

export interface Pet {
  name: string;
  breed: string;
  size: 'small' | 'medium' | 'large';
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  cpf: string;
}

export interface Booking {
  id: string;
  customer: Customer;
  pet: Pet;
  services: Service[];
  date: Date;
  time: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
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

export interface TimeSlot {
  time: string;
  available: boolean;
  bookingId?: string;
}

export interface AdminSettings {
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[]; // 0-6 (Sunday to Saturday)
  serviceInterval: number; // em minutos
  lunchBreak: {
    start: string;
    end: string;
  };
}