import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/categoria/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./features/producto/producto-list/producto-list.component').then(m => m.ProductoListComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent)
  },
  {
    path: 'materias',
    loadComponent: () => import('./features/materia/materia-list/materia-list.component').then(m => m.MateriaListComponent)
  },
  {
    path: 'grupos',
    loadComponent: () => import('./features/grupo/grupo-list/grupo-list.component').then(m => m.GrupoListComponent)
  },
  {
    path: 'periodos',
    loadComponent: () => import('./features/periodo/periodo-list/periodo-list.component').then(m => m.PeriodoListComponent)
  },
  {
    path: 'estudiantes',
    loadComponent: () => import('./features/estudiante/estudiante-list/estudiante-list.component').then(m => m.EstudianteListComponent)
  },
  {
    path: 'profesores',
    loadComponent: () => import('./features/profesor/profesor-list/profesor-list.component').then(m => m.ProfesorListComponent)
  },
  {
    path: 'notas',
    loadComponent: () => import('./features/notas/notas-list/notas-list.component').then(m => m.NotasListComponent)
  },
  {
    path: 'auditorias',
    loadComponent: () => import('./features/auditoria/auditoria-list/auditoria-list.component').then(m => m.AuditoriaListComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
