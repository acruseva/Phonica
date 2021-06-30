import { Component, OnInit } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { Role } from '@core/types/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  constructor(private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {
  }
  get userId() {
    return this.authService.currentUserFromStorage.user.id;
  }

  get isAdmin() {
    return this.authService.currentUserFromStorage && this.authService.currentUserFromStorage.user.role === Role.ADMIN;
  }
  get isLoggedIn() {
    return this.authService.currentUserFromStorage?.user;
  }

  get cartItems() {
    return this.cartService.currentCartItemsValue.length;
  }

  logout() {
    this.authService.logout();
  }

}
