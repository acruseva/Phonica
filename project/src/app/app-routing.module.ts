import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { LoginGuard } from '@core/guards/login.guard';
import { Role } from '@core/types/user.interface';
import { CartCheckoutComponent } from '@features/cart/cart-checkout/cart-checkout.component';
import { CartListComponent } from '@features/cart/cart-list/cart-list.component';
import { LoginComponent } from '@features/login/components/login/login.component';
import { OrderDetailsComponent } from '@features/orders/order-details/order-details.component';
import { OrdersListComponent } from '@features/orders/orders-list/orders-list.component';
import { ProductCreateEditComponent } from '@features/products/product-create-edit/product-create-edit.component';
import { ProductDetailComponent } from '@features/products/product-detail/product-detail.component';
import { ProductListComponent } from '@features/products/product-list/product-list.component';
import { UserEditCreateFormComponent } from '@features/users/user-edit-create-form/user-edit-create-form.component';
import { UserListComponent } from '@features/users/user-list/user-list.component';



const routes: Routes = [
  { path: 'login', canActivate: [LoginGuard] ,component: LoginComponent }, 
  {
    path: 'register',
    canActivate: [LoginGuard],
    component: UserEditCreateFormComponent,
    data: {
      title: 'User Registration',
      mode: 'register'
    },
  },
  { path: 'cart', component: CartListComponent },
  { path: 'checkout', component: CartCheckoutComponent },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'create',
        pathMatch: 'full',
        component: UserEditCreateFormComponent,
        data: {
          title: 'Add New User',
          mode: 'create'
        }
      },
      {
        path: 'details/:userId',
        component: UserEditCreateFormComponent,
        data: {
          title: 'User Data',
          mode: 'details'
        }
      },
      {
        path: 'edit/:userId',
        component: UserEditCreateFormComponent,
        data: {
          title: 'Edit User',
          mode: 'edit'
        }
      }
    ]
  },
  {
    path: 'profile',    
    canActivate: [AuthGuard],
    children: [
      {
        path: 'details/:userId',
        component: UserEditCreateFormComponent,
        data: {
          title: 'User Data',
          mode: 'details'
        }
      },
      {
        path: 'edit/:userId',
        component: UserEditCreateFormComponent,
        data: {
          title: 'Edit User',
          mode: 'edit'
        }
      }
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: 'create',
        canActivate: [AdminGuard],
        component: ProductCreateEditComponent,
        data: {
          title: 'Add New Product',
          mode: 'edit'
        }
      },
      {
        path: ':productId',
        component: ProductDetailComponent
      },
      {
        path: 'edit/:productId',
        canActivate: [AdminGuard],
        component: ProductCreateEditComponent,
        data: {
          title: 'Edit Product',
          mode: 'edit'
        }
      }
    ]
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        component: OrdersListComponent,
        data: {
          admin: false
        }
      },
      {
        path: 'all',
        component: OrdersListComponent,
        data: {
          admin: true
        }
      },
      {
        path: ':orderId',
        component: OrderDetailsComponent,        
        data: {
          admin: false
        }
      },
      {
        path: 'all/:orderId',
        component: OrderDetailsComponent,
        data: {
          admin: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
