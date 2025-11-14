import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card slide-in-up">
        <div class="card glass">
          <div class="card-header text-center">
            <div class="register-icon">✨</div>
            <h2 class="card-title text-title-contrast">Crear Cuenta</h2>
            <p class="register-subtitle text-high-contrast">Únete a nuestro sistema</p>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="form-group">
                <label for="username" class="form-label">
                  <span class="label-icon">📧</span>
                  Nombre de usuario
                </label>
                <input 
                  type="text"
                  id="username"
                  class="form-control"
                  [(ngModel)]="registerData.username"
                  name="username"
                  required
                  minlength="3"
                  placeholder="Ej: juan123"
                  #username="ngModel"
                  [class.is-invalid]="username.invalid && username.touched"
                >
                <div class="invalid-feedback" *ngIf="username.invalid && username.touched">
                  <div *ngIf="username.errors?.['required']">El nombre de usuario es obligatorio</div>
                  <div *ngIf="username.errors?.['minlength']">Debe tener al menos 3 caracteres</div>
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
                  [(ngModel)]="registerData.password"
                  name="password"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  #password="ngModel"
                  [class.is-invalid]="password.invalid && password.touched"
                >
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  <div *ngIf="password.errors?.['required']">La contraseña es requerida</div>
                  <div *ngIf="password.errors?.['minlength']">Debe tener al menos 6 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="rol" class="form-label">
                  <span class="label-icon">🛡️</span>
                  Rol
                </label>
                <select
                  id="rol"
                  class="form-control"
                  [(ngModel)]="registerData.rol"
                  name="rol"
                  required
                >
                  <option value="" disabled selected>Seleccione un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                </select>
                <div class="invalid-feedback" *ngIf="!registerData.rol">
                  Debe seleccionar un rol
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 btn-lg"
                  [disabled]="registerForm.invalid || loading"
                  [class.loading]="loading"
                >
                  <span *ngIf="loading" class="spinner"></span>
                  <span *ngIf="loading">Registrando...</span>
                  <span *ngIf="!loading">
                    <span class="btn-icon">✨</span>
                    Crear Cuenta
                  </span>
                </button>
              </div>

              <div class="form-options">
                <div class="text-center">
                  <span class="login-text">¿Ya tienes cuenta?</span>
                  <a routerLink="/auth/login" class="link">
                    <span class="link-icon">🔐</span>
                    Inicia sesión aquí
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
    /* Estilos iguales a los que tenías */
  `]
})
export class RegisterComponent implements OnInit {
  registerData: CreateUsuarioRequest = {
    username: '',
    password: '',
    rol: ''
  };
  
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loading) return;
    this.loading = true;

    this.usuarioService.createUsuario(this.registerData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.notificationService.showError('Error al registrar usuario. Intenta nuevamente.');
        this.loading = false;
      }
    });
  }
}
