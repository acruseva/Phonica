import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@core/services/message.service';
import { OrderService } from '@core/services/order.service';
import { IOrder } from '@core/types/order.interface';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private messageService: MessageService, private orderService: OrderService, private route: ActivatedRoute) { }
  order: IOrder;
  @Input() admin = false;

  ngOnInit(): void {
    this.route.data
      .subscribe(
        (data: { admin?: boolean }) => {          
          this.admin = data.admin || this.admin;
          if(this.admin) {
            this.route.params.pipe(
              filter(params => params['orderId']),
              switchMap(params => this.orderService.findByIdAdmin(params['orderId']))
             ).subscribe(
              order => {
                 this.order = order;
             },
              err => this.messageService.error(err.error.message)
             );
            } else {
              this.route.params.pipe(
                filter(params => params['orderId']),
                switchMap(params => this.orderService.findById(params['orderId']))
               ).subscribe(
                order => {
                   this.order = order;
               },
                err => this.messageService.error(err.error.message)
               );
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

}
