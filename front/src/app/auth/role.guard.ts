import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'] as 'ADMIN' | 'USER';
    const actualRole = this.authService.getUserRole();

    if (!this.authService.isLoggedIn() || actualRole !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
