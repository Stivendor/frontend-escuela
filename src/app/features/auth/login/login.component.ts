import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card slide-in-up">
        <div class="card glass">
          <div class="card-header text-center">
            <div class="login-icon">🔐</div>
            <h2 class="card-title text-title-contrast">Iniciar Sesión</h2>
            <p class="login-subtitle text-high-contrast">Accede a tu cuenta para continuar</p>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <span class="label-icon">📧</span>
                  Usuario
                </label>
                <input 
                  type="text" 
                  id="email"
                  class="form-control" 
                  [(ngModel)]="loginData.email"
                  name="email"
                  required
                  placeholder="admin"
                  #email="ngModel"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">El usuario es requerido</div>
                </div>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  <span class="label-icon">🔑</span>
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="password"
                  class="form-control" 
                  [(ngModel)]="loginData.password"
                  name="password"
                  required
                  minlength="6"
                  placeholder="admin123"
                  #password="ngModel"
                  [class.is-invalid]="password.invalid && password.touched"
                >
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  <div *ngIf="password.errors?.['required']">La contraseña es requerida</div>
                  <div *ngIf="password.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 btn-lg"
                  [disabled]="loginForm.invalid || loading"
                  [class.loading]="loading"
                >
                  <span *ngIf="loading" class="spinner"></span>
                  <span *ngIf="loading">Iniciando sesión...</span>
                  <span *ngIf="!loading">
                    <span class="btn-icon">🚀</span>
                    Iniciar Sesión
                  </span>
                </button>
              </div>

              <!-- Credenciales de prueba -->
              <div class="demo-credentials">
                <div class="demo-header">
                  <span class="demo-icon">🧪</span>
                  <strong>Credenciales de Prueba</strong>
                </div>
                <div class="demo-info">
                  <p><strong>Usuario:</strong> admin</p>
                  <p><strong>Contraseña:</strong> admin123</p>
                </div>
              </div>

              <div class="form-options">
                <div class="text-center">
                  <a routerLink="/auth/forgot-password" class="link">
                    <span class="link-icon">🔓</span>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div class="text-center">
                  <span class="register-text">¿No tienes cuenta? </span>
                  <a routerLink="/auth/register" class="link">
                    <span class="link-icon">✨</span>
                    Regístrate aquí
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .login-card {
      width: 100%;
      max-width: 450px;
    }

    .login-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }

    .login-subtitle {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .login-form {
      margin-top: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--dark-color);
    }

    .label-icon {
      font-size: 1.125rem;
    }

    .form-control {
      margin-top: 0.5rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .form-options {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
    }

    .link:hover {
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .link-icon {
      font-size: 1rem;
    }

    .register-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .btn.loading {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .demo-credentials {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin: 1.5rem 0;
      text-align: center;
    }

    .demo-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: var(--primary-color);
      font-size: 0.875rem;
    }

    .demo-icon {
      font-size: 1.125rem;
    }

    .demo-info {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .demo-info p {
      margin: 0.25rem 0;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        max-width: 100%;
      }

      .login-icon {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 0.5rem;
      }

      .form-label {
        font-size: 0.875rem;
      }

      .link {
        font-size: 0.875rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.setUserData(response.data);
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.notificationService.showError('Error al iniciar sesión. Verifica tus credenciales.');
        this.loading = false;
      }
    });
  }
}
