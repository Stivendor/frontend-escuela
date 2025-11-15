import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // Módulo de autenticación (login, register, forgot-password)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Rutas protegidas
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/usuario/usuario-list/usuario-list.component')
        .then(m => m.UsuarioListComponent)
  },
  {
    path: 'materias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/materia/materia-list/materia-list.component')
        .then(m => m.MateriaListComponent)
  },
  {
    path: 'grupos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/grupo/grupo-list/grupo-list.component')
        .then(m => m.GrupoListComponent)
  },
  {
    path: 'periodos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/periodo/periodo-list/periodo-list.component')
        .then(m => m.PeriodoListComponent)
  },
  {
    path: 'estudiantes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/estudiante/estudiante-list/estudiante-list.component')
        .then(m => m.EstudianteListComponent)
  },
  {
    path: 'profesores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profesor/profesor-list/profesor-list.component')
        .then(m => m.ProfesorListComponent)
  },
  {
    path: 'notas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notas/notas-list/notas-list.component')
        .then(m => m.NotasListComponent)
  },

  // Cualquier ruta rara → lleva al login
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
