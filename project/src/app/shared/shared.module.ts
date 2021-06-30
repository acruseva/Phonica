import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartItemsListComponent } from './cart-items-list/cart-items-list.component';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    CartItemsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    CartItemsListComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCartPlus);
  }
 }
