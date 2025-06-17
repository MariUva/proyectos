import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  // No se incluye 'role'
}

export interface AuthResponse {
  token: string;
}

// Decodificación mínima, sin campo 'role'
interface JwtPayload {
  exp: number;
  sub: string; // Este suele representar el email/username
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Cambia si tu backend está en otro puerto/ruta

  constructor(private http: HttpClient) {}

  // 🔐 Login
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  // 📝 Registro
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  // 💾 Guardar token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 📦 Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }

  // ✅ ¿Está logueado?
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // ⏳ ¿Token expirado?
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  // 📧 Obtener email o nombre del usuario
  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      return decoded.sub;
    } catch {
      return '';
    }
  }
}
