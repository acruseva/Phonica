import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
  }

  get cartItems() {
    return this.cartService.currentCartItemsValue;
  }

  get btnDisabled() {
    if (this.cartItems !== null) {
      return false;
    } else {
      return true;
    }
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  checkout(){
    this.router.navigateByUrl(`checkout`);
  }

  addToCart(product) {
    this.cartService.addToCart(product);
  }

  removeFromCart(product) {
    this.cartService.removeFromCart(product);
  }

  deleteFromCart(product) {
    this.cartService.deleteFromCart(product);
  }

}
