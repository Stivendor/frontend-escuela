import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { PeriodoService } from '../../../core/services/periodo.service';
import { Periodo, CreatePeriodoRequest, PeriodoFilters } from '../../../shared/models/periodo.model';

@Component({
  selector: 'app-periodo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodo-list.component.html',
  styleUrls: ['./periodo-list.component.scss']
})
export class PeriodoListComponent implements OnInit {
  // === Datos ===
  periodos: Periodo[] = [];

  // === Estado ===
  loading = false;
  showModal = false;
  editingPeriodo: Periodo | null = null;

  // === Paginación ===
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // === Filtros ===
  filters: PeriodoFilters = {};

  // === Formulario ===
  periodoForm: CreatePeriodoRequest = {
    nombre: '',
    activo: true
  };

  constructor(private periodoService: PeriodoService) {}

  ngOnInit(): void {
    this.loadPeriodos(); 
  }

  loadPeriodos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.periodoService.getPeriodos(pagination, this.filters).subscribe({
      next: (response: any) => {
        // Manejo de respuesta del backend
        const data = Array.isArray(response) ? response : response.data;

        if (!data) {
          console.error('⚠️ El backend no devolvió datos válidos:', response);
          this.loading = false;
          return;
        }

        // Adaptar los datos al modelo del front
        this.periodos = data.map((p: any) => ({
          id: p.id_periodo,
          nombre: p.nombre,
          fecha_inicio: p.fecha_inicio,
          fecha_fin: p.fecha_fin,
          activo: p.activo,
          fecha_creacion: p.fecha_creacion,
          fecha_actualizacion: p.fecha_edicion
        }));

        this.totalPages = response.total_pages || 1;
        this.loading = false;
        console.log('✅ Periodos cargados desde backend:', this.periodos);
      },
      error: (error) => {
        console.error('❌ Error al cargar periodos:', error);
        this.loading = false;
      }
    });
  }

  // === Filtros ===
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPeriodos();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadPeriodos();
  }

  // === Modal ===
  openCreateModal(): void {
    this.editingPeriodo = null;
    this.periodoForm = {
      nombre: '',
      activo: true
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPeriodo = null;
    this.periodoForm = {
      nombre: '',
      activo: true
    };
  }

  // === CRUD ===
  savePeriodo(): void {
    if (!this.periodoForm.nombre.trim()) {
      alert('El nombre del periodo es obligatorio');
      return;
    }

    if (this.editingPeriodo) {
      this.periodoService.updatePeriodo(this.editingPeriodo.id, this.periodoForm).subscribe({
        next: () => {
          this.loadPeriodos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar periodo:', error);
          alert('Error al actualizar el periodo');
        }
      });
    } else {
      this.periodoService.createPeriodo(this.periodoForm).subscribe({
        next: () => {
          this.loadPeriodos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear periodo:', error);
          alert('Error al crear el periodo');
        }
      });
    }
  }

  editPeriodo(periodo: Periodo): void {
    this.editingPeriodo = periodo;
    this.periodoForm = {
      nombre: periodo.nombre,
      activo: periodo.activo
    };
    this.showModal = true;
  }

  deletePeriodo(periodo: Periodo): void {
    if (confirm(`¿Está seguro de eliminar el periodo "${periodo.nombre}"?`)) {
      this.periodoService.deletePeriodo(periodo.id).subscribe({
        next: () => this.loadPeriodos(),
        error: (error) => {
          console.error('Error al eliminar periodo:', error);
          alert('No se pudo eliminar el periodo');
        }
      });
    }
  }

  // === Paginación ===
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPeriodos();
    }
  }
}
