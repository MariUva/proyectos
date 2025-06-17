import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

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
  ) {

  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
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

  goToHomeOrDashboard(event: Event): void {
    event.preventDefault();

    if (this.isLoggedIn) {
      this.router.navigate(['/projects']);
    } else {
      this.router.navigate(['/']);
    }
  }

}
