import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  template: `
    <div class="wrapper">
      <div class="sidebar" data-color="blue">
        <app-sidebar></app-sidebar>
      </div>
      <div class="main-panel">
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --sidebar-width: 260px;
      --blue-1: #0b63ff;
      --blue-2: #0059d6;
      --panel-bg: #f6f8fb;
    }

    .wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--panel-bg);
      color: #222;
      font-family: Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }

    /* Sidebar base (mejor contraste, gradiente azul, separación y ligera profundidad) */
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      width: var(--sidebar-width);
      background: linear-gradient(180deg, rgba(11,99,255,0.98) 0%, rgba(0,89,214,0.95) 100%);
      box-shadow: 0 10px 30px rgba(3,22,70,0.45);
      border-right: 1px solid rgba(255,255,255,0.05);
      backdrop-filter: blur(6px);
      transition: transform 0.28s ease, box-shadow 0.28s ease;
    }

    /* Data-color alternative para casos que dependan del atributo */
    .sidebar[data-color="blue"] {
      background: linear-gradient(180deg, #007bff 0%, #0056b3 100%);
    }

    /* Mejora visual del panel principal para que destaque sobre el sidebar */
    .main-panel {
      flex: 1;
      margin-left: var(--sidebar-width);
      background: linear-gradient(180deg, #f8fafc 0%, #f4f7fb 100%);
      min-height: 100vh;
      transition: margin-left 0.28s ease;
    }

    .content {
      padding: 24px;
    }

    /* Ajustes responsivos: ocultar/mostrar sidebar con transición más suave */
    @media (max-width: 991px) {
      .sidebar {
        transform: translate3d(-var(--sidebar-width), 0, 0);
      }

      .sidebar.show {
        transform: translate3d(0, 0, 0);
        box-shadow: 0 20px 40px rgba(3,22,70,0.55);
      }

      .main-panel {
        margin-left: 0;
      }
    }

    /* Pequeños detalles para enlaces dentro del sidebar (si el componente usa estas clases) */
    .sidebar .nav li > a {
      transition: background 0.18s ease, padding-left 0.18s ease, color 0.18s ease;
    }
    .sidebar .nav li > a:hover {
      background: rgba(255,255,255,0.04);
      padding-left: 12px;
      color: #ffffff;
    }

    /* Asegura que el contenido dentro del sidebar no se oculte por scroll en móviles */
    .sidebar .sidebar-wrapper {
      height: calc(100vh - 70px);
      overflow: auto;
      padding-bottom: 32px;
    }
  `]
})
export class AppComponent {
  title = 'frontend-angular-clean-architecture';
}
