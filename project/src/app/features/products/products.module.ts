import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateEditComponent } from './product-create-edit/product-create-edit.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductCreateEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FontAwesomeModule
  ]
})
export class ProductsModule { }
