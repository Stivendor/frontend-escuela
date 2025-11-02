import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { Estudiante, CreateEstudianteRequest, UpdateEstudianteRequest, EstudianteFilters } from '../../../shared/models/estudiante.model';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.scss']
})
export class EstudianteListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: EstudianteFilters = {};

  // Modal
  showModal = false;
  editingEstudiante: Estudiante | null = null;
  estudianteForm: CreateEstudianteRequest = {
    nombre: '',
    carrera: '',
    email: '',
    telefono: '',
    semestre: 1,
    activo: true
  };

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
  this.loadEstudiantes(); // ✅ Ahora sí carga los datos reales del backend
}


  loadEstudiantes(): void {
  this.loading = true;
  const pagination: PaginationParams = {
    page: this.currentPage,
    limit: this.pageSize
  };

  this.estudianteService.getEstudiantes(pagination, this.filters).subscribe({
    next: (response: any) => {
      // Si el backend devuelve un objeto con 'data', úsalo. Si devuelve un array, úsalo directamente.
      const data = Array.isArray(response) ? response : response.data;

      if (!data) {
        console.error('⚠️ El backend no devolvió datos válidos:', response);
        this.loading = false;
        return;
      }

      // Adaptar los datos al modelo del front
      this.estudiantes = data.map((e: any) => ({
        id: e.id_estudiante,
        nombre: e.persona?.nombre || '',
        carrera: e.carrera,
        email: e.persona?.email || '',
        telefono: e.persona?.telefono || '',
        semestre: e.semestre,
        activo: true,
        fecha_creacion: e.persona?.fecha_creacion,
        fecha_actualizacion: e.persona?.fecha_edicion
      }));

      this.loading = false;
      console.log('✅ Estudiantes cargados desde backend:', this.estudiantes);
    },
    error: (error) => {
      console.error('❌ Error al cargar estudiantes:', error);
      this.loading = false;
    }
  });
}





  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEstudiantes();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadEstudiantes();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEstudiantes();
    }
  }

  openCreateModal(): void {
    this.editingEstudiante = null;
    this.estudianteForm = {
      nombre: '',
      carrera: '',
      email: '',
      telefono: '',
      semestre: 1,
      activo: true
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
      activo: estudiante.activo
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
      activo: true
    };
  }

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
      // UPDATE
      const payload: UpdateEstudianteRequest = {
        nombre: this.estudianteForm.nombre,
        carrera: this.estudianteForm.carrera,
        email: this.estudianteForm.email,
        telefono: this.estudianteForm.telefono,
        semestre: this.estudianteForm.semestre,
        activo: this.estudianteForm.activo
      };

      this.estudianteService.updateEstudiante(this.editingEstudiante.id, payload).subscribe({
        next: () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar estudiante:', error);
          alert('Error al actualizar el estudiante');
        }
      });
    } else {
      // CREATE
      const payload: CreateEstudianteRequest = { ...this.estudianteForm };

      this.estudianteService.createEstudiante(payload).subscribe({
        next: () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear estudiante:', error);
          alert('Error al crear el estudiante');
        }
      });
    }
  }

  deleteEstudiante(estudiante: Estudiante): void {
    if (confirm(`¿Está seguro de eliminar al estudiante "${estudiante.nombre}"?`)) {
      this.estudianteService.deleteEstudiante(estudiante.id).subscribe({
        next: () => {
          this.loadEstudiantes();
        },
        error: (error) => {
          console.error('Error al eliminar estudiante:', error);
        }
      });
    }
  }
}
