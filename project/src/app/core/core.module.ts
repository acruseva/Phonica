import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './components/message/message.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NavMenuComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    NavMenuComponent,
    MessageComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule { }
