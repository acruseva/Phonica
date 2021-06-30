import { CartItem } from "@core/services/cart.service";

export interface IOrder {
    id: string;
    products: CartItem[];
    name: string;
    phone: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    totalPrice: any;
  }
  