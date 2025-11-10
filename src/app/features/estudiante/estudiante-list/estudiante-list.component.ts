import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { EstudianteService } from '../../../core/services/estudiante.service';
import {
  Estudiante,
  CreateEstudianteRequest,
  UpdateEstudianteRequest,
  EstudianteFilters,
} from '../../../shared/models/estudiante.model';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.scss'],
})
export class EstudianteListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  allEstudiantes: Estudiante[] = []; // 👈 copia completa
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: EstudianteFilters = {
    nombre: '',
    activo: undefined,
  };

  // Modal
  showModal = false;
  editingEstudiante: Estudiante | null = null;
  estudianteForm: CreateEstudianteRequest = {
    nombre: '',
    carrera: '',
    email: '',
    telefono: '',
    semestre: 1,
    activo: true,
  };

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  // ================================
  // 🚀 CARGAR ESTUDIANTES
  // ================================
  loadEstudiantes(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.estudianteService.getEstudiantes(pagination, {}).subscribe({
      next: (response: any) => {
        console.log('📥 Respuesta cruda estudiantes:', response);

        const data =
          Array.isArray(response) ? response :
          response.data ?? response.results ?? response.estudiantes ?? response;

        if (!data || data.length === 0) {
          console.warn('⚠️ No se recibieron estudiantes. Cargando ejemplo local.');
          this.estudiantes = [
            {
              id: 'local-1',
              nombre: 'Juan Pérez',
              carrera: 'Ingeniería de Software',
              email: 'juan.perez@example.com',
              telefono: '3001234567',
              semestre: 4,
              activo: true,
              fecha_creacion: new Date().toISOString(),
              fecha_actualizacion: new Date().toISOString(),
            },
          ];
          this.allEstudiantes = [...this.estudiantes];
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        this.estudiantes = (data as any[]).map((e: any) => ({
          id: e.id_estudiante ?? e.id ?? e.estudiante_id ?? '',
          nombre: e.persona?.nombre ?? e.nombre ?? '',
          carrera: e.carrera ?? e.programa ?? '',
          email: e.persona?.email ?? e.email ?? '',
          telefono: e.persona?.telefono ?? e.telefono ?? '',
          semestre: e.semestre ?? e.nivel ?? 1,
          activo: e.activo ?? e.is_active ?? true,
          fecha_creacion: e.fecha_creacion ?? e.created_at ?? null,
          fecha_actualizacion: e.fecha_edicion ?? e.updated_at ?? null,
        }));

        // 👇 guardamos copia para búsqueda local
        this.allEstudiantes = [...this.estudiantes];

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Estudiantes mapeados:', this.estudiantes);
      },
      error: (error) => {
        console.error('❌ Error al cargar estudiantes:', error);
        this.estudiantes = [];
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

    this.estudiantes = this.allEstudiantes.filter((e) => {
      const coincideNombre = e.nombre.toLowerCase().includes(nombreFiltro);
      const coincideActivo =
        activoFiltro === undefined ? true : e.activo === activoFiltro;
      return coincideNombre && coincideActivo;
    });
  }

  clearFilters(): void {
    this.filters = { nombre: '', activo: undefined };
    this.estudiantes = [...this.allEstudiantes];
  }

  // ================================
  // 📄 PAGINACIÓN
  // ================================
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEstudiantes();
    }
  }

  // ================================
  // 🧱 MODAL
  // ================================
  openCreateModal(): void {
    this.editingEstudiante = null;
    this.estudianteForm = {
      nombre: '',
      carrera: '',
      email: '',
      telefono: '',
      semestre: 1,
      activo: true,
    };
    this.showModal = true;
  }

  editEstudiante(estudiante: Estudiante): void {
    this.editingEstudiante = estudiante;
    this.estudianteForm = {
      nombre: estudiante.nombre,
      carrera: estudiante.carrera,
      email: estudiante.email,
      telefono: estudiante.telefono,
      semestre: estudiante.semestre,
      activo: estudiante.activo,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingEstudiante = null;
    this.estudianteForm = {
      nombre: '',
      carrera: '',
      email: '',
      telefono: '',
      semestre: 1,
      activo: true,
    };
  }

  // ================================
  // 💾 GUARDAR
  // ================================
  saveEstudiante(): void {
    if (
      !this.estudianteForm.nombre.trim() ||
      !this.estudianteForm.carrera.trim() ||
      !this.estudianteForm.email.trim() ||
      !this.estudianteForm.telefono.trim()
    ) {
      alert('Todos los campos son requeridos');
      return;
    }

    if (this.editingEstudiante) {
      const payload: UpdateEstudianteRequest = { ...this.estudianteForm };
      this.estudianteService.updateEstudiante(this.editingEstudiante.id, payload).subscribe({
        next: () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar estudiante:', error);
          alert('Error al actualizar el estudiante');
        },
      });
    } else {
      const payload: CreateEstudianteRequest = { ...this.estudianteForm };
      this.estudianteService.createEstudiante(payload).subscribe({
        next: () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear estudiante:', error);
          alert('Error al crear el estudiante');
        },
      });
    }
  }

  // ================================
  // 🗑️ ELIMINAR
  // ================================
  deleteEstudiante(estudiante: Estudiante): void {
    if (confirm(`¿Está seguro de eliminar al estudiante "${estudiante.nombre}"?`)) {
      this.estudianteService.deleteEstudiante(estudiante.id).subscribe({
        next: () => {
          this.loadEstudiantes();
        },
        error: (error) => {
          console.error('Error al eliminar estudiante:', error);
        },
      });
    }
  }
}
