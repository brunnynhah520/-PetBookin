export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_T1yyZCbpELzsNH',
    priceId: 'price_1S5v0nGoyplEIAuk7WShueyO',
    name: 'PetBookin',
    description: 'Fast and easy online booking with PetBookin. No calls, available 24/7',
    mode: 'subscription'
  }
];