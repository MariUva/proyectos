import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  role: string;
}

export interface AuthResponse {
  token: string;
}

interface JwtPayload {
  exp: number;
  role: 'ADMIN' | 'USER';
  sub: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (err) {
      return true;
    }
  }

  getUserRole(): 'ADMIN' | 'USER' | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      return decoded.role;
    } catch {
      return null;
    }
  }

}
