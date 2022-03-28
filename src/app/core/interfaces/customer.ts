import { Order } from './order'
 
export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  houseNumber: number;
  addition: string;
  zipCode: string;
  city: string;
  country: string
  orders: Order[]
}