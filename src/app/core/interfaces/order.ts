import { CartItem } from './cart-item'

export interface Order {
  cartItems: CartItem[],
  date: Date
  shippingCosts?: number
}