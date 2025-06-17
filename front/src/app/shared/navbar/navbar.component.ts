import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { CartStateService } from '../../services/cart-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartCount: number = 0;

  constructor(
    public auth: AuthService,
    private router: Router,
    private cartState: CartStateService
  ) {
    this.cartState.totalItems$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.getUserRole() === 'ADMIN';
  }

  get isUser(): boolean {
    return this.auth.getUserRole() === 'USER';
  }
}
