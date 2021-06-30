import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment} from '@env';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserFromStorage;
    if (!currentUser || !currentUser.token
      || req.url === `${environment.baseApiUrl}/auth/login` || req.url === `${environment.baseApiUrl}/auth/register`) {
        return next.handle(req);
    } else {   // send token
      return  next.handle(req.clone({ headers: req.headers.set('X-Access-Token', currentUser.token) }));
    }
  }
}
