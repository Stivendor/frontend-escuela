import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UsuarioFilters,
} from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss'],
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  allUsuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: UsuarioFilters = {
    username: '',
    rol: undefined,
  };

  // ================================
  // 🧱 MODAL
  // ================================
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm = {
    username: '',
    password: '',
    rol: 'profesor',
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  // ================================
  // 🚀 CARGAR USUARIOS
  // ================================
  loadUsuarios(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.usuarioService.getUsuarios(pagination, {}).subscribe({
      next: (response: any) => {
        console.log('📥 Respuesta cruda usuarios:', response);

        const data =
          Array.isArray(response)
            ? response
            : response.data ?? response.results ?? response.usuarios ?? response;

        if (!data || data.length === 0) {
          console.warn('⚠️ No se recibieron usuarios. Cargando ejemplo local.');
          this.usuarios = [
            {
              id_usuario: 'local-1',
              username: 'admin',
              rol: 'admin',
              fecha_creacion: new Date().toISOString(),
            },
          ];
          this.allUsuarios = [...this.usuarios];
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        // 🔄 Mapeo del backend → frontend
        this.usuarios = (data as any[]).map((u: any) => ({
          id_usuario: u.id_usuario ?? u.id ?? '',
          username: u.username ?? '',
          rol: u.rol ?? '',
          fecha_creacion: u.fecha_creacion ?? u.created_at ?? null,
          fecha_actualizacion: u.fecha_actualizacion ?? u.updated_at ?? null,
        }));

        this.allUsuarios = [...this.usuarios];
        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Usuarios mapeados:', this.usuarios);
      },
      error: (error) => {
        console.error('❌ Error al cargar usuarios:', error);
        this.usuarios = [];
        this.loading = false;
      },
    });
  }

  // ================================
  // 🔍 FILTROS
  // ================================
  onFilterChange(): void {
    const filtro = this.filters.username?.toLowerCase().trim() || '';
    this.usuarios = this.allUsuarios.filter((u) =>
      u.username.toLowerCase().includes(filtro)
    );
  }

  clearFilters(): void {
    this.filters = { username: '', rol: undefined };
    this.usuarios = [...this.allUsuarios];
  }

  // ================================
  // 📄 PAGINACIÓN
  // ================================
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  // ================================
  // 🧱 MODAL
  // ================================
  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm = {
      username: '',
      password: '',
      rol: 'profesor',
    };
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm = {
      username: usuario.username,
      password: '',
      rol: usuario.rol,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm = {
      username: '',
      password: '',
      rol: 'profesor',
    };
  }

  // ================================
  // 💾 GUARDAR
  // ================================
  saveUsuario(): void {
    if (!this.usuarioForm.username.trim()) {
      alert('El nombre de usuario es obligatorio');
      return;
    }

    if (!this.editingUsuario && !this.usuarioForm.password.trim()) {
      alert('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (this.editingUsuario) {
      // 🧱 Actualizar usuario existente
      const payload: UpdateUsuarioRequest = {
        username: this.usuarioForm.username,
        rol: this.usuarioForm.rol,
      };

      if (this.usuarioForm.password?.trim()) {
        payload.password = this.usuarioForm.password;
      }

      console.log('📤 Payload actualización:', payload);

      this.usuarioService
        .updateUsuario(this.editingUsuario.id_usuario, payload)
        .subscribe({
          next: () => {
            this.loadUsuarios();
            this.closeModal();
          },
          error: (error) => {
            console.error('❌ Error al actualizar usuario:', error);
            alert('Error al actualizar el usuario');
          },
        });
    } else {
      // 🆕 Crear nuevo usuario
      const payload: CreateUsuarioRequest = {
        username: this.usuarioForm.username,
        password: this.usuarioForm.password,
        rol: this.usuarioForm.rol,
      };

      console.log('📤 Payload creación:', payload);

      this.usuarioService.createUsuario(payload).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al crear usuario:', error);
          alert('Error al crear el usuario');
        },
      });
    }
  }

  // ================================
  // 🗑️ ELIMINAR
  // ================================
  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.username}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('❌ Error al eliminar usuario:', error);
        },
      });
    }
  }
}
