import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: UsuarioFilters = {};
  
  // Modal properties
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm = {
    nombre: '',
    password: '',
    activo: true
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    console.log('UsuarioListComponent init');
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.usuarioService.getUsuarios(pagination, this.filters).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : response.data ?? response;

        if (!data) {
          console.error('⚠️ El backend no devolvió datos válidos:', response);
          this.usuarios = [];
          this.loading = false;
          return;
        }

        // Mapear únicamente los campos necesarios para el grid
        this.usuarios = data.map((u: any) => ({
          id: u.id_usuario ?? u.id ?? u.id_user ?? '',
          nombre: u.persona?.nombre ?? u.nombre ?? u.username ?? u.user ?? '',
          activo: u.activo ?? u.is_active ?? u.estado ?? true,
          ultimo_acceso: u.ultimo_acceso ?? u.last_login ?? u.last_access ?? u.ultima_conexion ?? null
        })) as any; // casteo corto para evitar errores de tipos si tu modelo incluye más campos

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm = {
      nombre: '',
      password: '',
      activo: true
    };
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm = {
      nombre: usuario.nombre,
      password: '',
      activo: usuario.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm = {
      nombre: '',
      password: '',
      activo: true
    };
  }

  saveUsuario(): void {
    if (!this.usuarioForm.nombre.trim()) {
      alert('Nombre es requerido');
      return;
    }

    if (!this.editingUsuario && !this.usuarioForm.password.trim()) {
      alert('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (this.editingUsuario) {
      // Actualizar usuario existente
      const updateData: any = {
        nombre: this.usuarioForm.nombre,
        activo: this.usuarioForm.activo
      };
      
      // Solo incluir password si se proporcionó
      if (this.usuarioForm.password.trim()) {
        updateData.password = this.usuarioForm.password;
      }
      
      this.usuarioService.updateUsuario(this.editingUsuario.id, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      // Crear nuevo usuario
      const newUsuario = {
        nombre: this.usuarioForm.nombre,
        password: this.usuarioForm.password,
        activo: this.usuarioForm.activo
      };
      
      this.usuarioService.createUsuario(newUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          alert('Error al crear el usuario');
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar el usuario "${usuario.nombre}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
