import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // <- Esto es clave
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // <- Agregado CommonModule
  template: `
<header class="app-header">
  <h1>Escuela</h1>

  <div class="header-buttons">
    <!-- Botón Volver al Dashboard (solo si está autenticado) -->
    <button 
      *ngIf="isLoggedIn" 
      class="btn-dashboard" 
      (click)="goToDashboard()">
      🏠 Dashboard
    </button>

    <!-- Botón Iniciar/Cerrar Sesión -->
    <button class="btn-session" (click)="handleSession()">
      {{ isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión' }}
    </button>
  </div>
</header>

<router-outlet></router-outlet>
  `,
  styles: [`
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-session, .btn-dashboard {
  background: white;
  color: #3b82f6;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-session:hover, .btn-dashboard:hover {
  background: #e0f2fe;
}
  `]
})
export class AppComponent implements OnInit {

  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Mantener estado al refrescar la página
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  handleSession() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }


  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
