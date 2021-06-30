import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { MessageService } from '@core/services/message.service';
import { OrderService } from '@core/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.scss']
})
export class CartCheckoutComponent implements OnInit, OnDestroy {

  constructor(private cartService: CartService, private fb: FormBuilder, private orderService: OrderService, private authService: AuthService, private router: Router, private messageService: MessageService) { }
  orderForm: FormGroup;
  private statusSubscription: Subscription;
  private userId: string;
  ngOnInit(): void {
    this.userId = this.authService.currentUserFromStorage.user.id;
    this.buildForm();
  }

  formErrors = {
    name: '',
    phone: '',
    address: '',
    city: '',
    postCode: '',
    country: ''
  };

  validationMessages = {
    name: {
      required: 'Full name is required.',
      minlength: 'Full name must be at least 3 characters long.',
      maxlength: 'Full name cannot be more than 40 characters long.'
    },
    phone: {
      required: 'Phone is required.',
      minlength: 'Phone must be at least 3 characters long.',
      maxlength: 'Phone cannot be more than 20 characters long.'
    },
    address: {
      required: 'Address is required.',
      minlength: 'Address must be at least 3 characters long.',
      maxlength: 'Address cannot be more than 255 characters long.'
    },
    city: {
      required: 'City is required.',
      minlength: 'City must be at least 3 characters long.',
      maxlength: 'City cannot be more than 30 characters long.'
    },
    postCode: {
      required: 'Post code is required.',
      minlength: 'Post code must be at least 3 characters long.',
      maxlength: 'Post code cannot be more than 30 characters long.'
    },
    country: {
      required: 'Country is required.',
      minlength: 'Country must be at least 3 characters long.',
      maxlength: 'Country cannot be more than 30 characters long.'
    },
  };

  get cartItems() {
    return this.cartService.currentCartItemsValue;
  }

  buildForm() {
    this.orderForm = this.fb.group({      
      name: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(40)]
      ],
      phone: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      ],
      address: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      ],
      city: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
      ],
      postCode: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
      ],
      country: ["",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
      ],
      products: [this.cartItems],
      userId: [this.userId],
      totalPrice: [this.totalPrice] 
    });
    this.statusSubscription = this.orderForm.statusChanges.subscribe(() => this.onStatusChanged());
  }

  get totalPrice() {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  order() {
    this.orderForm.markAllAsTouched();
    if (this.orderForm.valid) {
      this.orderService.create(this.orderForm.value).subscribe((response) => 
      {
        this.cartService.clearCart();
        this.messageService.success('Order was created');
        this.router.navigate['products'];
      });
    }
    
  }

  protected onStatusChanged() {
    if (!this.orderForm) { return; }
    const form = this.orderForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (control.dirty || control.touched) && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
