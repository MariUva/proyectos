import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  placeOrder(): Observable<any> {
    return this.http.post(`${this.api}/place`, {});
  }

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/history`);
  }
}
