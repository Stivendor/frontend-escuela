import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProfesorService } from '../../../core/services/profesor.service';
import { Profesor, CreateProfesorRequest, UpdateProfesorRequest, ProfesorFilters } from '../../../shared/models/profesor.model';

@Component({
  selector: 'app-profesor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor-list.component.html',
  styleUrls: ['./profesor-list.component.scss']
})
export class ProfesorListComponent implements OnInit {
  profesores: Profesor[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: ProfesorFilters = {};

  // Modal properties
  showModal = false;
  editingProfesor: Profesor | null = null;
  profesorForm: CreateProfesorRequest = {
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    activo: true
  };

constructor(private profesorService: ProfesorService) {}

ngOnInit(): void {
  this.loadProfesores(); // ✅ Carga los datos de profesores
}

loadProfesores(): void {
  this.loading = true;
  const pagination: PaginationParams = {
    page: this.currentPage,
    limit: this.pageSize
  };

  this.profesorService.getProfesores(pagination, this.filters).subscribe({
    next: (response: any) => {
      // Manejo de respuesta del backend
      const data = Array.isArray(response) ? response : response.data;

      if (!data) {
        console.error('⚠️ El backend no devolvió datos válidos:', response);
        this.loading = false;
        return;
      }

      // Adaptar los datos al modelo del front
      this.profesores = data.map((p: any) => ({
        id: p.id_profesor,
        nombre: p.persona?.nombre || '',
        especialidad: p.especialidad,
        email: p.persona?.email || '',
        telefono: p.persona?.telefono || '',
        departamento: p.departamento,
        activo: true,
        fecha_creacion: p.persona?.fecha_creacion,
        fecha_actualizacion: p.persona?.fecha_edicion
      }));

      this.loading = false;
      console.log('✅ Profesores cargados desde backend:', this.profesores);
    },
    error: (error) => {
      console.error('❌ Error al cargar profesores:', error);
      this.loading = false;
    }
  });
}

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProfesores();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadProfesores();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProfesores();
    }
  }

  openCreateModal(): void {
    this.editingProfesor = null;
    this.profesorForm = {
      nombre: '',
      especialidad: '',
      email: '',
      telefono: '',
      activo: true
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
      activo: profesor.activo
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
      activo: true
    };
  }

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
      // UPDATE
      const payload: UpdateProfesorRequest = {
        nombre: this.profesorForm.nombre,
        especialidad: this.profesorForm.especialidad,
        email: this.profesorForm.email,
        telefono: this.profesorForm.telefono,
        activo: this.profesorForm.activo
      };

      this.profesorService.updateProfesor(this.editingProfesor.id, payload).subscribe({
        next: () => {
          this.loadProfesores();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar profesor:', error);
          alert('Error al actualizar el profesor');
        }
      });
    } else {
      // CREATE
      const payload: CreateProfesorRequest = { ...this.profesorForm };

      this.profesorService.createProfesor(payload).subscribe({
        next: () => {
          this.loadProfesores();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear profesor:', error);
          alert('Error al crear el profesor');
        }
      });
    }
  }

  deleteProfesor(profesor: Profesor): void {
    if (confirm(`¿Está seguro de eliminar al profesor "${profesor.nombre}"?`)) {
      this.profesorService.deleteProfesor(profesor.id).subscribe({
        next: () => {
          this.loadProfesores();
        },
        error: (error) => {
          console.error('Error al eliminar profesor:', error);
        }
      });
    }
  }
}
