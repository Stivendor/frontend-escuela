import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { EstudianteService } from '../../../core/services/estudiante.service';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.scss']
})
export class EstudianteListComponent implements OnInit {
  estudiantes: any[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: any = {};

  // Modal
  showModal = false;
  editingEstudiante: any | null = null;
  estudianteForm = {
    nombre: '',
    carrera: '',
    email: '',
    telefono: '',
    semestre: 1,
    activo: true
  };

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    // Dato de prueba
    this.estudiantes = [
      {
        id: 1,
        nombre: 'María López',
        carrera: 'Ingeniería de Sistemas',
        email: 'maria.lopez@example.com',
        telefono: '3004567890',
        semestre: 5,
        activo: true
      }
    ];
    this.totalPages = 1;
    // this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.estudianteService.getEstudiantes(pagination, this.filters).subscribe({
      next: (response) => {
        this.estudiantes = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
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

  editEstudiante(estudiante: any): void {
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
    // UPDATE: mapeamos los campos del estudiante al modelo de usuario
    const payloadUsuario: any = {
      email: this.estudianteForm.email,
      nombre: this.estudianteForm.nombre,
      // Usamos 'apellido' para almacenar la carrera (temporalmente)
      apellido: this.estudianteForm.carrera,
      activo: this.estudianteForm.activo
      // Teléfono y semestre no existen en el DTO original del usuario
    };

    this.estudianteService.updateEstudiante(this.editingEstudiante.id, payloadUsuario).subscribe({
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
    // CREATE: mapeamos los datos al formato esperado por el servicio
    const payloadUsuario: any = {
      email: this.estudianteForm.email,
      nombre: this.estudianteForm.nombre,
      apellido: this.estudianteForm.carrera, // mapeo temporal
      password: 'Temporal#123',               // requerida por createUsuario
      activo: this.estudianteForm.activo
      // Teléfono y semestre no existen en el DTO original del usuario
    };

    this.estudianteService.createEstudiante(payloadUsuario).subscribe({
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



  deleteEstudiante(estudiante: any): void {
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
