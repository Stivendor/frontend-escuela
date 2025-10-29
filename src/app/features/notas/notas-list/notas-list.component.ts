import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { NotaService } from '../../../core/services/nota.service';
import { Nota, NotaFilters, CreateNotaRequest } from '../../../shared/models/nota.model';

@Component({
  selector: 'app-notas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notas-list.component.html',
  styleUrls: ['./notas-list.component.scss']
})
export class NotasListComponent implements OnInit {
  notas: Nota[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: NotaFilters = {};

  // Modal
  showModal = false;
  editingNota: Nota | null = null;
  notaForm: CreateNotaRequest = {
    materia_id: 0,
    estudiante_id: 0,
    profesor_id: 0,
    valor: 0,
    activo: true
  };

  constructor(private notaService: NotaService) {}

  ngOnInit(): void {
    // Dato de prueba
    this.notas = [
      {
        id: 1,
        materia_id: 1,
        estudiante_id: 2,
        profesor_id: 3,
        valor: 4.5,
        activo: true,
        fecha_creacion: new Date().toISOString(),
        estudiante: { id: 2, nombre: 'María Lopez' },
        profesor: { id: 3, nombre: 'Juan Pérez' },
        materia: { id: 1, nombre: 'Matemáticas I' }
      }
    ];
    this.totalPages = 1;
    // this.loadNotas();
  }

  loadNotas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.notaService.getNotas(pagination, this.filters).subscribe({
      next: (response) => {
        this.notas = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar notas:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadNotas();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadNotas();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNotas();
    }
  }

  openCreateModal(): void {
    this.editingNota = null;
    this.notaForm = {
      materia_id: 0,
      estudiante_id: 0,
      profesor_id: 0,
      valor: 0,
      activo: true
    };
    this.showModal = true;
  }

  editNota(nota: Nota): void {
    this.editingNota = nota;
    this.notaForm = {
      materia_id: nota.materia_id,
      estudiante_id: nota.estudiante_id,
      profesor_id: nota.profesor_id,
      valor: nota.valor,
      activo: nota.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingNota = null;
    this.notaForm = {
      materia_id: 0,
      estudiante_id: 0,
      profesor_id: 0,
      valor: 0,
      activo: true
    };
  }

  saveNota(): void {
    if (
      !this.notaForm.materia_id ||
      !this.notaForm.estudiante_id ||
      !this.notaForm.profesor_id ||
      this.notaForm.valor <= 0
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.editingNota) {
      const updateData = { ...this.notaForm };
      this.notaService.updateNota(this.editingNota.id, updateData).subscribe({
        next: () => {
          this.loadNotas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar la nota:', error);
          alert('Error al actualizar la nota');
        }
      });
    } else {
      const newNota = { ...this.notaForm };
      this.notaService.createNota(newNota).subscribe({
        next: () => {
          this.loadNotas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear la nota:', error);
          alert('Error al crear la nota');
        }
      });
    }
  }

  deleteNota(nota: Nota): void {
    if (confirm(`¿Está seguro de eliminar la nota con ID ${nota.id}?`)) {
      this.notaService.deleteNota(nota.id).subscribe({
        next: () => this.loadNotas(),
        error: (error) => console.error('Error al eliminar nota:', error)
      });
    }
  }
}
