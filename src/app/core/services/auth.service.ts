import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Enviar credenciales al backend */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, request);
  }

  /** Guardar sesión en localStorage */
  saveSession(token: string, userId: string, role?: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    if (role) localStorage.setItem('role', role);
  }

  /** Obtener token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Obtener userId */
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /** Obtener rol */
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  /** Verificar si el usuario está autenticado */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Cerrar sesión */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
}
