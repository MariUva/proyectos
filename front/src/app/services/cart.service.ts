import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // ✅ importa `tap` aquí
import { CartStateService } from './cart-state.service'; // servicio de estado del carrito

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8080/cart';

  constructor(private http: HttpClient, private cartState: CartStateService) {}

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      tap(items => {
        const total = items.reduce((sum, i) => sum + i.quantity, 0);
        this.cartState.setTotalItems(total);
      })
    );
  }

  addToCart(productId: number, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, null, {
      params: { productId, quantity }
    });
  }

  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }
}
