import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { MessageService } from '@core/services/message.service';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/types/product';
import { Role } from '@core/types/user.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product | undefined;
  currentMode = 'details';
  messages: string | undefined;
  errors: string | undefined;

  constructor(private service: ProductsService, private messageService: MessageService,
              private router: Router, private route: ActivatedRoute, private cartService: CartService, private authService: AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      if (qparams['refresh']) {
        this.refresh();
      }
    });
    this.refresh();
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    this.router.navigate(['products', this.currentMode, product.id]);
  }

  setMode(mode: string) {
    this.currentMode = mode;
  }

  onAddProduct() {
    this.setMode('edit');
    this.selectedProduct = new Product(undefined, undefined);
    this.router.navigate(['products', 'create']);
  }

  onDeleteProduct(product: Product) {
    this.service.deleteById(product.id)
      .subscribe(
        deleted => {
          const index = this.products.findIndex(p => p.id === deleted.id);
          this.products.splice(index, 1);
          this.showMessage(`Product ${deleted.name} was successfully deleted.`);
        },
        err => this.showError(err.message)
      );
  }

  onProductModified(product: Product) {
    if (product.id) { // edit mode
      this.service.update(product).subscribe(
        updated => {
          const index = this.products.findIndex(p => p.id === updated.id);
          this.products[index] = updated;
          this.showMessage(`Product '${updated.name}' updated successfully.`);
        },
        err => this.showError(err.message)
      );
    } else {
      this.service.create(product).subscribe(
        created => {
          this.products.push(created);
          this.showMessage(`Product '${created.name}' created successfully.`);
        },
        err => this.showError(err.message)
      );
    }
  }

  onProductCanceled() {
    this.selectProduct(undefined);
  }

  private refresh() {
    this.service.findAll()
      .subscribe(
        products => this.products = products,
        err => this.showError(err.message));
  }

  private showMessage(msg) {
    this.messageService.success(msg);
  }

  private showError(err) {
    this.messageService.error(err.error.message);
  }

  addToCart(product: Product) {
      this.cartService.addToCart(product);
      this.messageService.success("You added " + product.name + " to your cart!" )
  }

  get isAdmin() {
    return this.authService.currentUserFromStorage && this.authService.currentUserFromStorage.user.role === Role.ADMIN;
  }

}

