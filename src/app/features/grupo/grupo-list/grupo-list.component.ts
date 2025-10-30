import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService } from '../../../core/services/grupo.service';
import { Grupo, CreateGrupoRequest, GrupoFilters } from '../../../shared/models/grupo.model';
import { Materia } from '../../../shared/models/materia.model';
import { Profesor } from '../../../shared/models/profesor.model';
import { Periodo } from '../../../shared/models/periodo.model';
import { PaginationParams } from '../../../core/models/api-response.model';
import { MateriaService } from '../../../core/services/materia.service';
import { ProfesorService } from '../../../core/services/profesor.service';
import { PeriodoService } from '../../../core/services/periodo.service';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.scss']
})
export class GrupoListComponent implements OnInit {
  // === Datos ===
  grupos: Grupo[] = [];
  materias: Materia[] = [];
  profesores: Profesor[] = [];
  periodos: Periodo[] = [];

  // === Estado ===
  loading = false;
  showModal = false;
  editingGrupo: Grupo | null = null;

  // === Paginación ===
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // === Filtros ===
  filters: GrupoFilters = {};

  // === Formulario ===
  grupoForm: CreateGrupoRequest = {
    nombre: '',
    materia_id: 0,
    periodo_id: 0,
    profesor_id: 0,
    activo: true
  };

  constructor(
    private grupoService: GrupoService,
    private materiaService: MateriaService,
    private profesorService: ProfesorService,
    private periodoService: PeriodoService
  ) {}

  ngOnInit(): void {
  // 🧩 Datos de prueba (solo visibles sin backend)
  this.materias = [
    { id: 1, nombre: 'Matemáticas', codigo: 'MAT101', creditos: 3, profesor_id: 1, activo: true },
    { id: 2, nombre: 'Programación I', codigo: 'PRG101', creditos: 4, profesor_id: 2, activo: true },
    { id: 3, nombre: 'Bases de Datos', codigo: 'BD101', creditos: 3, profesor_id: 3, activo: false }
  ];

  this.profesores = [
    { id: 1, nombre: 'Carlos Gómez', especialidad: 'Matemáticas', email: 'carlos@ejemplo.com', telefono: '3001234567', activo: true },
    { id: 2, nombre: 'María Pérez', especialidad: 'Programación', email: 'maria@ejemplo.com', telefono: '3009876543', activo: true },
    { id: 3, nombre: 'Juan Rodríguez', especialidad: 'Bases de Datos', email: 'juan@ejemplo.com', telefono: '3014567890', activo: false }
  ];

  this.periodos = [
    { id: 1, nombre: '2025-1', activo: true },
    { id: 2, nombre: '2025-2', activo: false }
  ];

  this.grupos = [
    {
      id: 1,
      nombre: 'Grupo A',
      materia_id: 1,
      periodo_id: 1,
      profesor_id: 1,
      activo: true,
      materia: { id: 1, nombre: 'Matemáticas' },
      periodo: { id: 1, nombre: '2025-1' },
      profesor: { id: 1, nombre: 'Carlos Gómez' }
    },
    {
      id: 2,
      nombre: 'Grupo B',
      materia_id: 2,
      periodo_id: 2,
      profesor_id: 2,
      activo: false,
      materia: { id: 2, nombre: 'Programación I' },
      periodo: { id: 2, nombre: '2025-2' },
      profesor: { id: 2, nombre: 'María Pérez' }
    }
  ];

  this.totalPages = 1;

  // Descomenta esto cuando ya funcione la API:
  // this.loadGrupos();
  // this.loadMaterias();
  // this.loadProfesores();
  // this.loadPeriodos();
}


  // === Carga de datos ===
  loadGrupos(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };

    this.grupoService.getGrupos(pagination, this.filters).subscribe({
      next: (response) => {
        this.grupos = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar grupos:', error);
        this.loading = false;
      }
    });
  }

  loadMaterias(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };
    this.materiaService.getMaterias(pagination).subscribe({
      next: (res) => {
        this.materias = res.data || [];
      },
      error: (err) => console.error('❌ Error al cargar materias:', err)
    });
  }

  loadProfesores(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };
    this.profesorService.getProfesores(pagination).subscribe({
      next: (res) => {
        this.profesores = res.data || [];
      },
      error: (err) => console.error('❌ Error al cargar profesores:', err)
    });
  }

  loadPeriodos(): void {
    this.periodoService.getPeriodos().subscribe({
      next: (res) => {
        this.periodos = Array.isArray(res.data) ? res.data.flat() : [];
      },
      error: (err) => console.error('❌ Error al cargar periodos:', err)
    });
  }

  // === Filtros ===
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadGrupos();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadGrupos();
  }

  // === Modal ===
  openCreateModal(): void {
    this.editingGrupo = null;
    this.grupoForm = {
      nombre: '',
      materia_id: 0,
      periodo_id: 0,
      profesor_id: 0,
      activo: true
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGrupo = null;
  }

  // === CRUD ===
  editGrupo(grupo: Grupo): void {
    this.editingGrupo = grupo;
    this.grupoForm = {
      nombre: grupo.nombre,
      materia_id: grupo.materia_id,
      periodo_id: grupo.periodo_id,
      profesor_id: grupo.profesor_id,
      activo: grupo.activo
    };
    this.showModal = true;
  }

  saveGrupo(): void {
    if (!this.grupoForm.nombre.trim() ||
        !this.grupoForm.materia_id ||
        !this.grupoForm.periodo_id ||
        !this.grupoForm.profesor_id) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    if (this.editingGrupo) {
      this.grupoService.updateGrupo(this.editingGrupo.id, this.grupoForm).subscribe({
        next: () => {
          this.loadGrupos();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al actualizar grupo:', error);
          alert('Error al actualizar grupo');
        }
      });
    } else {
      this.grupoService.createGrupo(this.grupoForm).subscribe({
        next: () => {
          this.loadGrupos();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al crear grupo:', error);
          alert('Error al crear grupo');
        }
      });
    }
  }

  deleteGrupo(grupo: Grupo): void {
    if (confirm(`¿Está seguro de eliminar el grupo "${grupo.nombre}"?`)) {
      this.grupoService.deleteGrupo(grupo.id).subscribe({
        next: () => this.loadGrupos(),
        error: (error) => {
          console.error('❌ Error al eliminar grupo:', error);
          alert('No se pudo eliminar el grupo');
        }
      });
    }
  }

  // === Paginación ===
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGrupos();
    }
  }
}
