import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProfesorService } from '../../../core/services/profesor.service';
import {
  Profesor,
  CreateProfesorRequest,
  UpdateProfesorRequest,
  ProfesorFilters,
} from '../../../shared/models/profesor.model';

@Component({
  selector: 'app-profesor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor-list.component.html',
  styleUrls: ['./profesor-list.component.scss'],
})
export class ProfesorListComponent implements OnInit {
  profesores: Profesor[] = [];
  allProfesores: Profesor[] = []; // 👈 copia completa (para búsquedas locales)
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: ProfesorFilters = {
    nombre: '',
    activo: undefined,
  };

  // Modal
  showModal = false;
  editingProfesor: Profesor | null = null;
  profesorForm: CreateProfesorRequest = {
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    activo: true,
  };

  constructor(private profesorService: ProfesorService) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  // ================================
  // 🚀 CARGAR PROFESORES
  // ================================
  loadProfesores(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.profesorService.getProfesores(pagination, {}).subscribe({
      next: (response: any) => {
        console.log('📥 Respuesta cruda profesores:', response);

        const data =
          Array.isArray(response) ? response :
          response.data ?? response.results ?? response.profesores ?? response;

        if (!data || data.length === 0) {
          console.warn('⚠️ No se recibieron profesores. Cargando ejemplo local.');
          this.profesores = [
            {
              id: 'local-1',
              nombre: 'Dora Gómez',
              especialidad: 'Matemáticas',
              email: 'dora.gomez@example.com',
              telefono: '3101234567',
              activo: true,
              fecha_creacion: new Date().toISOString(),
              fecha_actualizacion: new Date().toISOString(),
            },
          ];
          this.allProfesores = [...this.profesores];
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        // 🔄 Mapeo del backend → frontend
        this.profesores = (data as any[]).map((p: any) => ({
          id: p.id_profesor ?? p.id ?? p.profesor_id ?? '',
          nombre: p.persona?.nombre ?? p.nombre ?? '',
          especialidad: p.especialidad ?? '',
          email: p.persona?.email ?? p.email ?? '',
          telefono: p.persona?.telefono ?? p.telefono ?? '',
          activo: p.activo ?? p.is_active ?? true,
          fecha_creacion: p.fecha_creacion ?? p.created_at ?? null,
          fecha_actualizacion: p.fecha_edicion ?? p.updated_at ?? null,
        }));

        // 👇 Guardamos copia local para filtrado sin recargar
        this.allProfesores = [...this.profesores];

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Profesores mapeados:', this.profesores);
      },
      error: (error) => {
        console.error('❌ Error al cargar profesores:', error);
        this.profesores = [];
        this.loading = false;
      },
    });
  }

  // ================================
  // 🔍 FILTROS (buscador + activo)
  // ================================
  onFilterChange(): void {
    const nombreFiltro = this.filters.nombre?.toLowerCase().trim() || '';
    const activoFiltro = this.filters.activo;

    this.profesores = this.allProfesores.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(nombreFiltro);
      const coincideActivo =
        activoFiltro === undefined ? true : p.activo === activoFiltro;
      return coincideNombre && coincideActivo;
    });
  }

  clearFilters(): void {
    this.filters = { nombre: '', activo: undefined };
    this.profesores = [...this.allProfesores];
  }

  // ================================
  // 📄 PAGINACIÓN
  // ================================
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProfesores();
    }
  }

  // ================================
  // 🧱 MODAL
  // ================================
  openCreateModal(): void {
    this.editingProfesor = null;
    this.profesorForm = {
      nombre: '',
      especialidad: '',
      email: '',
      telefono: '',
      activo: true,
    };
    this.showModal = true;
  }

  editProfesor(profesor: Profesor): void {
    this.editingProfesor = profesor;
    this.profesorForm = {
      nombre: profesor.nombre,
      especialidad: profesor.especialidad,
      email: profesor.email,
      telefono: profesor.telefono,
      activo: profesor.activo,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProfesor = null;
    this.profesorForm = {
      nombre: '',
      especialidad: '',
      email: '',
      telefono: '',
      activo: true,
    };
  }

  // ================================
  // 💾 GUARDAR
  // ================================
  saveProfesor(): void {
    if (
      !this.profesorForm.nombre.trim() ||
      !this.profesorForm.especialidad.trim() ||
      !this.profesorForm.email.trim() ||
      !this.profesorForm.telefono.trim()
    ) {
      alert('Todos los campos son requeridos');
      return;
    }

    if (this.editingProfesor) {
      const payload: UpdateProfesorRequest = { ...this.profesorForm };
      this.profesorService.updateProfesor(this.editingProfesor.id, payload).subscribe({
        next: () => {
          this.loadProfesores();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar profesor:', error);
          alert('Error al actualizar el profesor');
        },
      });
    } else {
      const payload: CreateProfesorRequest = { ...this.profesorForm };
      this.profesorService.createProfesor(payload).subscribe({
        next: () => {
          this.loadProfesores();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear profesor:', error);
          alert('Error al crear el profesor');
        },
      });
    }
  }

  // ================================
  // 🗑️ ELIMINAR
  // ================================
  deleteProfesor(profesor: Profesor): void {
    if (confirm(`¿Está seguro de eliminar al profesor "${profesor.nombre}"?`)) {
      this.profesorService.deleteProfesor(profesor.id).subscribe({
        next: () => {
          this.loadProfesores();
        },
        error: (error) => {
          console.error('Error al eliminar profesor:', error);
        },
      });
    }
  }
}
