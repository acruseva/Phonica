import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from './cart-list/cart-list.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { CartCheckoutComponent } from './cart-checkout/cart-checkout.component';



@NgModule({
  declarations: [
    CartListComponent,
    CartCheckoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class CartModule { }
