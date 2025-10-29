import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { MateriaService } from '../../../core/services/materia.service';
import {
  Materia,
  CreateMateriaRequest,
  UpdateMateriaRequest,
  MateriaFilters,
} from '../../../shared/models/materia.model';

@Component({
  selector: 'app-materia-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materia-list.component.html',
  styleUrls: ['./materia-list.component.scss'],
})
export class MateriaListComponent implements OnInit {
  materias: Materia[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: MateriaFilters = {};

  // Modal
  showModal = false;
  editingMateria: Materia | null = null;
  materiaForm: CreateMateriaRequest = {
    nombre: '',
    codigo: '',
    creditos: 0,
    activo: true,
    profesor_id: undefined, // <- agregado
  };

  constructor(private materiaService: MateriaService) {}

  ngOnInit(): void {
    // Dato de prueba
    this.materias = [
      {
        id: 1,
        nombre: 'Matemáticas I',
        codigo: 'MAT101',
        creditos: 3,
        activo: true,
        profesor_id: 1, // <- agregado
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      },
    ];
    this.totalPages = 1;
    // this.loadMaterias();
  }

  loadMaterias(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.materiaService.getMaterias(pagination, this.filters).subscribe({
      next: (response) => {
        this.materias = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadMaterias();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadMaterias();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMaterias();
    }
  }

  openCreateModal(): void {
    this.editingMateria = null;
    this.materiaForm = {
      nombre: '',
      codigo: '',
      creditos: 0,
      activo: true,
      profesor_id: undefined,
    };
    this.showModal = true;
  }

  editMateria(materia: Materia): void {
    this.editingMateria = materia;
    this.materiaForm = {
      nombre: materia.nombre,
      codigo: materia.codigo,
      creditos: materia.creditos,
      activo: materia.activo,
      profesor_id: materia.profesor_id,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingMateria = null;
    this.materiaForm = {
      nombre: '',
      codigo: '',
      creditos: 0,
      activo: true,
      profesor_id: undefined,
    };
  }

  saveMateria(): void {
    if (
      !this.materiaForm.nombre.trim() ||
      !this.materiaForm.codigo.trim() ||
      !this.materiaForm.creditos
    ) {
      alert('Todos los campos son requeridos');
      return;
    }

    if (this.editingMateria) {
      const payload: UpdateMateriaRequest = {
        nombre: this.materiaForm.nombre,
        codigo: this.materiaForm.codigo,
        creditos: this.materiaForm.creditos,
        activo: this.materiaForm.activo,
        profesor_id: this.materiaForm.profesor_id,
      };

      this.materiaService
        .updateMateria(this.editingMateria.id, payload)
        .subscribe({
          next: () => {
            this.loadMaterias();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar materia:', error);
            alert('Error al actualizar la materia');
          },
        });
    } else {
      const payload: CreateMateriaRequest = { ...this.materiaForm };
      this.materiaService.createMateria(payload).subscribe({
        next: () => {
          this.loadMaterias();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear materia:', error);
          alert('Error al crear la materia');
        },
      });
    }
  }

  deleteMateria(materia: Materia): void {
    if (confirm(`¿Está seguro de eliminar la materia "${materia.nombre}"?`)) {
      this.materiaService.deleteMateria(materia.id).subscribe({
        next: () => {
          this.loadMaterias();
        },
        error: (error) => {
          console.error('Error al eliminar materia:', error);
        },
      });
    }
  }
}
