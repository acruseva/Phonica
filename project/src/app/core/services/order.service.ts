import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdType } from '@core/types/common-types';
import { IOrder } from '@core/types/order.interface';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<IOrder[]> {
    return this.http.get<any>(`${environment.baseApiUrl}/orders/`).pipe(
      map(dataResp => dataResp.data));
  }

  findById(id: IdType): Observable<IOrder | undefined> {
    return this.http.get<IOrder>(`${environment.baseApiUrl}/orders/${id}`);
  }

  findAllAdmin(): Observable<IOrder[]> {
    return this.http.get<any>(`${environment.baseApiUrl}/orders/all/`).pipe(
      map(dataResp => dataResp.data));
  }

  findByIdAdmin(id: IdType): Observable<IOrder | undefined> {
    return this.http.get<IOrder>(`${environment.baseApiUrl}/orders/all/${id}`);
  }

  create(order: IOrder): Observable<IOrder | undefined> {
    return this.http.post<IOrder>(`${environment.baseApiUrl}/orders`, order);
  }
}
