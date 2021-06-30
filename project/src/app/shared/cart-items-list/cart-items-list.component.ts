import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '@core/services/cart.service';

@Component({
  selector: 'app-cart-items-list',
  templateUrl: './cart-items-list.component.html',
  styleUrls: ['./cart-items-list.component.scss']
})
export class CartItemsListComponent implements OnInit {
  @Input() cartItems: CartItem[];
  constructor() { }

  ngOnInit(): void {
  }
  get cartTotal() {
    let total = 0;
    this.cartItems?.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }
}
