import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/usuarios', title: 'Usuarios',  icon:'users_single-02', class: '' },
    { path: '/estudiantes', title: 'Estudiantes',  icon:'users_single-02', class: '' },
    { path: '/profesores', title: 'Profesores',  icon:'users_single-02', class: '' },
    { path: '/notas', title: 'Notas',  icon:'shopping_box', class: '' },
    { path: '/materias', title: 'Materia',  icon:'shopping_box', class: '' },
    { path: '/grupos', title: 'Grupo',  icon:'shopping_box', class: '' },
    { path: '/notifications', title: 'Notificaciones',  icon:'ui-1_bell-53', class: '' },
    { path: '/upgrade', title: 'Configuración',  icon:'objects_spaceship', class: 'active active-pro' }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
