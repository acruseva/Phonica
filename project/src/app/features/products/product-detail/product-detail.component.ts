import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { MessageService } from '@core/services/message.service';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/types/product';
import { Role } from '@core/types/user.interface';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input() product: Product;
  constructor(private productService: ProductsService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private cartService: CartService, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.pipe(
      filter(params => params['productId']),
      switchMap(params => this.productService.findById(params['productId']))
    ).subscribe(
      product => {
        this.product = product;
      },
      err => this.messageService.error(err.error.message)
    );
  }

  onDeleteProduct(product: Product) {
    this.productService.deleteById(product.id)
      .subscribe(
        deleted => {
          this.router.navigate(['products',]);
          this.showMessage(`Product ${deleted.name} was successfully deleted.`);
        },
        err => this.showError(err.message)
      );
  }

  private showMessage(msg) {
    this.messageService.success(msg);
  }

  private showError(err) {
    this.messageService.error(err.error.message);
  }


  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.messageService.success("You added " + product.name + " to your cart!")
  }

  editProduct(product){
    this.router.navigateByUrl(`products/edit/${product.id}`);
  }

  get isAdmin() {
    return this.authService.currentUserFromStorage && this.authService.currentUserFromStorage.user.role === Role.ADMIN;
  }

}
