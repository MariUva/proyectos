import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      if (this.auth.isTokenExpired()) {
        this.auth.logout();
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Por favor inicia sesión nuevamente'
        });
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Debes iniciar sesión para acceder'
    });
    this.router.navigate(['/login']);
    return false;
  }
}
