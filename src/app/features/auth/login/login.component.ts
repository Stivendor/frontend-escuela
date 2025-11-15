import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
template: `
  <div class="login-container">
    <div class="login-card">
      <div class="card">
        <div class="card-header text-center">
          <div class="login-icon">🔒</div>
          <h2>Iniciar Sesión</h2>
          <p class="subtitle">Accede a tu cuenta para continuar</p>
        </div>
        
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">


            <!-- Usuario -->
            <div class="form-group">
              <label for="username">Usuario</label>
              <input 
                type="text" 
                id="username"
                class="form-control" 
                [(ngModel)]="loginData.username"
                name="username"
                required
                placeholder=""
                #usernameModel="ngModel"
                [class.is-invalid]="usernameModel.invalid && usernameModel.touched"
              >
            </div>

            <!-- Contraseña -->
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input 
                type="password" 
                id="password"
                class="form-control" 
                [(ngModel)]="loginData.password"
                name="password"
                required
                placeholder=""
                #passwordModel="ngModel"
                [class.is-invalid]="passwordModel.invalid && passwordModel.touched"
              >
            </div>

            <button 
              type="submit"
              class="btn w-100"
              [disabled]="loginForm.invalid || loading"
            >
              <span *ngIf="loading">Iniciando sesión...</span>
              <span *ngIf="!loading">Iniciar Sesión</span>
            </button>

            <p *ngIf="error" class="error-text">{{ error }}</p>
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
    min-height: 90vh;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    padding: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
  }

  .card {
    background: #ffffff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .card-header {
    margin-bottom: 1.5rem;
  }

  .login-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: #3b82f6;
  }

  .subtitle {
    font-size: 0.9rem;
    color: #6b7280;
  }

  .demo-credentials {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    text-align: left;
    font-size: 0.9rem;
  }

  .demo-info p {
    margin: 0.2rem 0;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 600;
    color: #374151;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .form-control:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    outline: none;
  }

  .btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-weight: 600;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .error-text {
    color: #dc2626;
    text-align: center;
    margin-top: 0.75rem;
    font-weight: 600;
  }

  /* Invalid input styling */
  .is-invalid {
    border-color: #dc2626;
    background-color: #fee2e2;
  }
`]

})
export class LoginComponent implements OnInit {

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        if (!res || !res.token || !res.userId) {
          this.error = 'Respuesta inválida del servidor';
          this.loading = false;
          return;
        }

        // Guardar sesión
        this.authService.saveSession(res.token, res.userId);
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },

      error: () => {
        this.error = 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }

}
