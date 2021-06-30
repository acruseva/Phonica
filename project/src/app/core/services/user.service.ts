import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdType } from '@core/types/common-types';
import { User } from '@core/types/user.interface';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<any>(`${environment.baseApiUrl}/users/`).pipe(
      map(dataResp => dataResp.data));
  }

  findById(id: IdType): Observable<User | undefined> {
    return this.http.get<User>(`${environment.baseApiUrl}/users/${id}`);
  }

  findByEmail(email: string): Observable<User | undefined> {
    return undefined
  }

  create(entity: User): Observable<User | undefined> {
    return this.http.post<User>(`${environment.baseApiUrl}/users`, entity);
  }

  update(entity: User): Observable<User | undefined> {
    return this.http.put<User>(`${environment.baseApiUrl}/users/${entity.id}`, entity);
  }

  delete(id: IdType): Observable<User | undefined> {
    return this.http.delete<User>(`${environment.baseApiUrl}/users/${id}`);
  }
}
