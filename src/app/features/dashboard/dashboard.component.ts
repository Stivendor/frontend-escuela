import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard fade-in">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="card glass">
          <div class="card-body text-center">
            <div class="welcome-icon">🎓</div>
            <h1 class="welcome-title text-title-contrast">Sistema de Gestión Escolar</h1>
            <p class="welcome-subtitle text-high-contrast">Administración eficiente de estudiantes, profesores y calificaciones</p>
          </div>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="modules-grid">
        <div class="module-card slide-in-up" style="animation-delay: 0.1s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">👨‍🎓</div>
              <h3 class="module-title">Estudiantes</h3>
              <p class="module-description">Gestión completa del alumnado</p>
              <div class="module-features">
                <span class="feature-tag">Inscripciones</span>
                <span class="feature-tag">Expedientes</span>
                <span class="feature-tag">Asistencia</span>
              </div>
              <a routerLink="/estudiantes" class="btn btn-primary btn-lg">
                <span class="btn-icon">📚</span>
                Gestionar Estudiantes
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.2s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">👨‍🏫</div>
              <h3 class="module-title">Profesores</h3>
              <p class="module-description">Control del personal docente</p>
              <div class="module-features">
                <span class="feature-tag">Asignaciones</span>
                <span class="feature-tag">Horarios</span>
                <span class="feature-tag">Materias</span>
              </div>
              <a routerLink="/profesores" class="btn btn-primary btn-lg">
                <span class="btn-icon">📋</span>
                Ver Profesores
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">📝</div>
              <h3 class="module-title">Notas</h3>
              <p class="module-description">Gestión de calificaciones y evaluaciones</p>
              <div class="module-features">
                <span class="feature-tag">Calificaciones</span>
                <span class="feature-tag">Boletines</span>
                <span class="feature-tag">Promedios</span>
              </div>
              <a routerLink="/notas" class="btn btn-primary btn-lg">
                <span class="btn-icon">📊</span>
                Gestionar Notas
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="card glass">
          <div class="card-header">
            <h3 class="card-title">Acciones Rápidas</h3>
          </div>
          <div class="card-body">
            <div class="actions-grid">
              <a routerLink="/estudiantes/nuevo" class="action-btn">
                <span class="action-icon">👨‍🎓</span>
                <span class="action-text">Nuevo Estudiante</span>
              </a>
              <a routerLink="/profesores/nuevo" class="action-btn">
                <span class="action-icon">👨‍🏫</span>
                <span class="action-text">Nuevo Profesor</span>
              </a>
              <a routerLink="/grupos/nuevo" class="action-btn">
                <span class="action-icon">👥</span>
                <span class="action-text">Nuevo Grupo</span>
              </a>
              <a routerLink="/materias" class="action-btn">
                <span class="action-icon">📚</span>
                <span class="action-text">Materias</span>
              </a>
              <a routerLink="/periodos" class="action-btn">
                <span class="action-icon">📅</span>
                <span class="action-text">Periodos</span>
              </a>
              <a routerLink="/notas/registro" class="action-btn">
                <span class="action-icon">✏️</span>
                <span class="action-text">Registrar Notas</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 0;
    }

    .welcome-section {
      margin-bottom: 3rem;
    }

    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 0;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }


    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .module-card {
      transition: transform 0.3s ease;
    }

    .module-card:hover {
      transform: translateY(-5px);
    }

    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .module-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .module-description {
      color: #475569;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-weight: 500;
    }

    .module-features {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .quick-actions {
      margin-top: 2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-md);
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .action-text {
      font-weight: 500;
      font-size: 0.875rem;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2rem;
      }

      .stats-row {
        gap: 1rem;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .modules-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .dashboard {
        padding: 1rem 0;
      }

      .welcome-title {
        font-size: 1.75rem;
      }

      .stats-row {
        flex-direction: column;
        gap: 0.5rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: var(--radius-lg);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .module-card .card {
      height: 100%;
      transition: all 0.3s ease;
    }

    .module-card .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .feature-tag {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(26, 35, 126, 0.2);
    }

    .action-btn {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      border: none;
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.25);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .welcome-section .card {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
    }

    .welcome-title {
      color: white;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
