import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { Role } from '@core/types/user.interface';
import { UserEditCreateFormComponent } from './user-edit-create-form/user-edit-create-form.component';


@NgModule({
  imports: [
    RouterModule.forChild([])
  ],
  exports: [
    RouterModule
  ],
  // providers: [
  //   UserResolver
  // ]
})
export class UsersRoutingModule { }
