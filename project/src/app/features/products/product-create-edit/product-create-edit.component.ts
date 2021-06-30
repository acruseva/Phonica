import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@core/services/message.service';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/types/product';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-product-create-edit',
  templateUrl: './product-create-edit.component.html',
  styleUrls: ['./product-create-edit.component.scss']
})
export class ProductCreateEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mode;
  @Input() product: Product = new Product(null, null, null, null);
  @Output() productModified = new EventEmitter<Product>();
  @Output() productCanceled = new EventEmitter<void>();
  title = 'Product Details';
  isCanceled = false;

  get isNewProduct() {
    return !this.product || !this.product.id;
  }
  form: FormGroup;
  private statusSubscription: Subscription;

  formErrors = {
    name: '',
    price: '',
    description: '',
    image: ''
  };

  validationMessages = {
    name: {
      required: 'Product name is required.',
      minlength: 'Productname must be at least 2 characters long.',
      maxlength: 'Productname cannot be more than 24 characters long.'
    },
    price: {
      required: 'Price is required.',
      min: 'Price should be positive number.'
    },
    description: {
      minlength: 'Description must be at least 2 characters long.',
      maxlength: 'Description cannot be more than 512 characters long.'
    }
  };

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private messageService: MessageService, private productsService: ProductsService) { }

  ngOnInit() {
    this.route.params.pipe(
      filter(params => params['productId']),
      switchMap(params => this.productsService.findById(params['productId']))
    ).subscribe(
      product => {
        this.product = product;
        this.reset();
      },
      err => this.messageService.error(err.error.message)
    );
    this.route.data
      .subscribe(
        (data: { title?: string, mode?: string }) => {
          this.title = data.title || this.title;
          this.mode = data.mode || this.mode;
        },
        err => this.messageService.error(err.error.message)
      );
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const prodChange = changes.product;
    if (prodChange && prodChange.currentValue !== prodChange.previousValue) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      id: { value: this.product.id, disabled: true },
      name: [this.product.name,
      [Validators.required, Validators.minLength(2), Validators.maxLength(24)]
      ],
      price: [this.product.price,
      [Validators.required, Validators.min(0)]
      ],
      description: [this.product.description,
      [Validators.required, Validators.minLength(2), Validators.maxLength(512)]
      ],
      image: [this.product.image]
    });
    this.statusSubscription = this.form.statusChanges.subscribe(() => this.onStatusChanged());
  }

  submitProduct() {
    this.product = this.form.getRawValue();
    this.productModified.emit(this.product);
    this.reset();
    if (this.isNewProduct) { // edit mode
      this.productsService.create(this.product).subscribe(
        created => {
          this.messageService.success(`Product '${created.name}' created successfully.`);
          // window.history.back();
          this.router.navigate(['products'], { queryParams: { refresh: true } });
        },
        err => this.messageService.error(err.error.message)
      );
    } else {
      this.productsService.update(this.product).subscribe(
        updated => {
          this.messageService.success(`Product '${updated.name}' updated successfully.`);
          this.router.navigate(['products'], { queryParams: { refresh: true } });
        },
        err => this.messageService.error(err.error.message)
      );
    }
  }

  reset() {
    if (this.form && this.product) {
      this.form.reset(this.product);
    }
  }
  cancelProduct() {
    this.productCanceled.emit();
    this.isCanceled = true;
    this.router.navigate(['products']);
  }

  protected onStatusChanged() {
    if (!this.form) { return; }
    const form = this.form;

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

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({
        image: reader.result
      });
    };
  }
}