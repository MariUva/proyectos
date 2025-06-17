import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private subject = new Subject<{ action: 'show' | 'close', text?: string }>();

  get loading$(): Observable<{ action: 'show' | 'close', text?: string }> {
    return this.subject.asObservable();
  }

  show(text: string = 'Cargando...') {
    this.subject.next({ action: 'show', text });
  }

  close() {
    this.subject.next({ action: 'close' });
  }
}
