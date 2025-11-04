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
    // Cargar desde backend (robusto) al iniciar
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.materiaService.getMaterias(pagination, this.filters).subscribe({
      next: (response: any) => {
        console.log('Respuesta cruda materias:', response);

        // Aceptar array directo o objeto { data, ... }
        const data = Array.isArray(response) ? response : response.data ?? response;

        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.warn('No se recibieron materias desde el backend. Usando fallback temporal.');
          // Fallback temporal para ver la UI mientras debuggeas
          this.materias = [
            {
              id: 'local-1',
              nombre: 'Matemáticas Básicas',
              codigo: 'MAT-101',
              creditos: 4,
              profesor_id: null,
              profesor_nombre: '',
              activo: true,
              fecha_creacion: new Date().toISOString(),
              fecha_actualizacion: new Date().toISOString()
            }
          ] as any;
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        // Mapear campos a nuestro modelo frontal (resiliente a diferentes nombres desde backend)
        this.materias = (data as any[]).map((m: any) => ({
          id: m.id_materia ?? m.id ?? m.idMateria ?? '',
          nombre: m.nombre ?? m.titulo ?? m.nombre_materia ?? '',
          codigo: m.codigo ?? m.sigla ?? m.codigo_materia ?? '',
          creditos: m.creditos ?? m.creditos_horas ?? m.creditos_totales ?? 0,
          profesor_id: m.profesor_id ?? m.profesor?.id ?? m.docente_id ?? null,
          profesor_nombre: m.profesor?.persona?.nombre ?? m.profesor?.nombre ?? m.docente?.nombre ?? '',
          activo: m.activo ?? m.is_active ?? true,
          fecha_creacion: m.fecha_creacion ?? m.created_at,
          fecha_actualizacion: m.fecha_edicion ?? m.updated_at
        })) as Materia[];

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Materias mapeadas:', this.materias);
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.materias = [];
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
