import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdType } from '@core/types/common-types';
import { Product } from '@core/types/product';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Product[]> {
    return this.http.get<any>(`${environment.baseApiUrl}/products/`).pipe(
      map(dataResp => dataResp.data));
  }

  findById(id: IdType): Observable<Product | undefined> {
    return this.http.get<Product>(`${environment.baseApiUrl}/products/${id}`);
  }

  findByEmail(email: string): Observable<Product | undefined> {
    return undefined
  }

  create(entity: Product): Observable<Product | undefined> {
    return this.http.post<Product>(`${environment.baseApiUrl}/products`, entity);
  }

  update(entity: Product): Observable<Product | undefined> {
    return this.http.put<Product>(`${environment.baseApiUrl}/products/${entity.id}`, entity);
  }

  deleteById(id: IdType): Observable<Product | undefined> {
    return this.http.delete<Product>(`${environment.baseApiUrl}/products/${id}`);
  }
}
