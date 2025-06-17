import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  setTotalItems(count: number) {
    this.totalItemsSubject.next(count);
  }

  getCurrentCount(): number {
    return this.totalItemsSubject.value;
  }
}
