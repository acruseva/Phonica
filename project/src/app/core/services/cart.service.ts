import { Injectable } from '@angular/core';
import { Product } from '@core/types/product';
import { BehaviorSubject, Observable } from 'rxjs';


export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private currentCartItemsSubject: BehaviorSubject<CartItem[]>;
  public currentCartItems: Observable<CartItem[]>;
  constructor() {
    if (JSON.parse(localStorage.getItem('cart'))) {
      this.currentCartItemsSubject = new BehaviorSubject<CartItem[]>(JSON.parse(localStorage.getItem('cart')));
    } else {
      const emptyCart: CartItem[] = [];
      localStorage.setItem('cart', JSON.stringify(emptyCart));
      this.currentCartItemsSubject = new BehaviorSubject<CartItem[]>(JSON.parse(localStorage.getItem('cart')));
    }

  }
  cartItems = 0;

  public get currentCartItemsValue(): CartItem[] {
    return this.currentCartItemsSubject.value;
  }

  private updateCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.currentCartItemsSubject.next(cart);
  }

  addToCart(product: Product) {
    const cart: CartItem[] = this.currentCartItemsValue;
    const itemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity++;
      this.updateCart(cart);
    } else {
      const productToAdd: CartItem = {
        product,
        quantity: 1,
      };
      cart.push(productToAdd);
      this.updateCart(cart);
    }

  }

  removeFromCart(product: Product) {
    const cart: CartItem[] = this.currentCartItemsValue;
    const itemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (itemIndex > -1) {
      if (cart[itemIndex].quantity < 2) {
        cart.splice(itemIndex, 1);
        this.updateCart(cart);
      } else {
        cart[itemIndex].quantity--;
        this.updateCart(cart);
      }
    }

  }

  deleteFromCart(product: Product) {
    const cart: CartItem[] = this.currentCartItemsValue;
    const itemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (itemIndex > -1) {      
        cart.splice(itemIndex, 1);
        this.updateCart(cart);      
    }
  }

  clearCart() {
    this.updateCart([]);
  }
}
