import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditCreateFormComponent } from './user-edit-create-form/user-edit-create-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UserEditCreateFormComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    RouterModule
  ]
})
export class UsersModule { }
