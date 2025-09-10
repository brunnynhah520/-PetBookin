import { Service } from '../types';

export const availableServices: Service[] = [
  {
    id: '1',
    name: 'Bath',
    duration: 60,
    price: 35.00,
    description: 'Complete bath with shampoo and conditioner'
  },
  {
    id: '2',
    name: 'Sanitary Trim',
    duration: 30,
    price: 25.00,
    description: 'Trimming of intimate areas and paws'
  },
  {
    id: '3',
    name: 'Machine Grooming',
    duration: 45,
    price: 40.00,
    description: 'Complete grooming with clippers'
  },
  {
    id: '4',
    name: 'Scissor Grooming',
    duration: 60,
    price: 55.00,
    description: 'Artisanal grooming with scissor finishing'
  },
  {
    id: '5',
    name: 'Nail Trimming',
    duration: 15,
    price: 15.00,
    description: 'Nail cutting and filing'
  },
  {
    id: '6',
    name: 'Conditioning Treatment',
    duration: 30,
    price: 30.00,
    description: 'Moisturizing treatment for fur'
  }
];