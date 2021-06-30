import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment} from '@env';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Authenticate, AuthenticationResult } from '../types/auth.interface';
import { User } from '../types/user.interface';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private messageService: MessageService) {}

  public get currentUserFromStorage(): AuthenticationResult {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  /** POST: login with username and  password */
  login(username: string, password: string, ): Observable<AuthenticationResult> {
    // this.logger.log(JSON.stringify(credentials));
    const url = `${environment.baseApiUrl}/auth/login`;
    return this.http.post<AuthenticationResult>(url, { username, password }).pipe(
      tap((result: AuthenticationResult) => {
        localStorage.setItem('currentUser', JSON.stringify(result));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  /** POST: register with username and  password */
  register(user: User): Observable<User> {
    console.log(JSON.stringify(user));
    const url = `${environment.baseApiUrl}/auth/register`;
    return this.http.post<User>(url, user).pipe(
      tap((created: User) => {
        console.log(`Successfully registered user: ${JSON.stringify(created)}.`);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend unsuccessful status code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error || error)},
        message was: ${JSON.stringify(error.message)}`);
    }
    // return ErrorObservable with a user-facing error message
    return throwError('Invalid user credentials. Try again.');
  }

}
