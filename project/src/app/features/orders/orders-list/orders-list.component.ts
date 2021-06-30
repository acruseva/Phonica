import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@core/services/message.service';
import { OrderService } from '@core/services/order.service';
import { IOrder } from '@core/types/order.interface';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnChanges {
  @Input() admin = false;
  constructor(private messageService: MessageService, private orderService: OrderService, private route: ActivatedRoute) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.admin)
  }
  orders: IOrder[]
 
  ngOnInit(): void {
      this.route.data
      .subscribe(
        (data: { admin?: boolean }) => {          
          this.admin = data.admin || this.admin;
          if(this.admin) {
            this.orderService.findAllAdmin()
            .subscribe(
              orders => this.orders = orders,
              err => this.showError(err.message));
          } else {
            this.orderService.findAll()
            .subscribe(
              orders => this.orders = orders,
              err => this.showError(err.message));
          }
        },
        err => this.messageService.error(err.error.message)
      );
    
  }

  private showMessage(msg) {
    this.messageService.success(msg);
  }

  private showError(err) {
    this.messageService.error(err.error.message);
  }

  getLink(order) {
    return this.admin ? `/orders/all/${order.id}` : `/orders/${order.id}`;
  }
}
