import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    OrdersListComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class OrdersModule { }
