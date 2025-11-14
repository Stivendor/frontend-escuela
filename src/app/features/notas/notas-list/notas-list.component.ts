import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { NotaService } from '../../../core/services/nota.service';
import { Nota, NotaFilters, CreateNotaRequest } from '../../../shared/models/nota.model';
import { ApiService } from '../../../core/services/api.service'; //  servicio genérico para llamadas

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

  // Nuevos arreglos para las listas desplegables
  materias: any[] = [];
  estudiantes: any[] = [];
  profesores: any[] = [];

  constructor(
    private notaService: NotaService,
    private api: ApiService // Servicio para cargar materias, estudiantes y profesores
  ) {}

  ngOnInit(): void {
    this.loadNotas();
  }

  // Cargar listas relacionadas
  loadRelatedData(): void {
  this.api.get('/materias').subscribe({
    next: (res: any) => {
      this.materias = Array.isArray(res) ? res : res.data ?? [];
    },
    error: (err) => console.error('Error al cargar materias:', err)
  });

  this.api.get('/estudiantes').subscribe({
    next: (res: any) => {
      this.estudiantes = Array.isArray(res) ? res : res.data ?? [];
    },
    error: (err) => console.error('Error al cargar estudiantes:', err)
  });

  this.api.get('/profesores').subscribe({
    next: (res: any) => {
      this.profesores = Array.isArray(res) ? res : res.data ?? [];
    },
    error: (err) => console.error('Error al cargar profesores:', err)
  });
}


  // Cargar todas las notas
  loadNotas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.notaService.getNotas(pagination, this.filters).subscribe({
      next: (response: any) => {
        console.log('Respuesta cruda notas:', response);

        const data = Array.isArray(response)
          ? response
          : response.data ?? response;

        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.warn('No se recibieron notas desde el backend. Usando fallback temporal.');
          this.notas = [
            {
              id: 'local-1',
              materia_id: 0,
              estudiante_id: 0,
              profesor_id: 0,
              valor: 0,
              activo: true,
              fecha_creacion: new Date().toISOString(),
              fecha_actualizacion: new Date().toISOString()
            }
          ] as any;
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        // Mapear estructura
        this.notas = (data as any[]).map((n: any) => ({
          id: n.id_nota ?? n.id ?? '',
          materia_id: n.materia_id ?? n.id_materia ?? n.materia?.id ?? 0,
          estudiante_id: n.estudiante_id ?? n.id_estudiante ?? n.estudiante?.id ?? 0,
          profesor_id: n.profesor_id ?? n.id_profesor ?? n.profesor?.id ?? 0,
          valor: n.valor ?? n.calificacion ?? n.score ?? 0,
          comentario: n.comentario ?? n.obs ?? '',
          activo: n.activo ?? n.is_active ?? true,
          fecha_creacion: n.fecha_creacion ?? n.created_at,
          fecha_actualizacion: n.fecha_edicion ?? n.updated_at,
          materia_nombre: n.materia?.nombre ?? n.materia_nombre ?? n.nombre_materia ?? n.materia?.titulo ?? '',
          estudiante_nombre: n.estudiante?.persona?.nombre ?? n.estudiante_nombre ?? n.nombre_estudiante ?? n.estudiante?.nombre ?? '',
          profesor_nombre: n.profesor?.persona?.nombre ?? n.profesor_nombre ?? n.nombre_profesor ?? n.profesor?.nombre ?? ''
        })) as Nota[];

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log(' Notas mapeadas:', this.notas);
      },
      error: (error) => {
        console.error('Error al cargar notas:', error);
        this.notas = [];
        this.loading = false;
      }
    });
  }

  // Filtros
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

  // Abrir modal de creación
  openCreateModal(): void {
  this.editingNota = null;
  this.notaForm = {
    materia_id: 0,
    estudiante_id: 0,
    profesor_id: 0, // lo puedes dejar aquí solo para el select
    valor: 0,
    activo: true
  };
  this.loadRelatedData();
  this.showModal = true;
}

editNota(nota: Nota): void {
  this.editingNota = nota;
  this.notaForm = {
    materia_id: nota.materia_id,
    estudiante_id: nota.estudiante_id,
    profesor_id: nota.profesor_id ?? 0, // solo visual
    valor: nota.valor,
    activo: nota.activo
  };
  this.loadRelatedData();
  this.showModal = true;
}



  // Cerrar modal
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

  // Guardar nota
  saveNota(): void {
  // Validación básica antes de enviar
  if (
    !this.notaForm.materia_id ||
    !this.notaForm.estudiante_id ||
    this.notaForm.valor <= 0
  ) {
    alert('Materia, estudiante y valor son obligatorios');
    return;
  }

  // Si estamos editando una nota existente
  if (this.editingNota) {
  // Aseguramos obtener correctamente el ID de la nota
  const idNota =
    this.editingNota.id_nota ||
    this.editingNota.id ||
    (this.editingNota as any).idNota;

  if (!idNota) {
    alert('Error: No se encontró el ID de la nota para actualizar.');
    return;
  }

  // Enviamos todos los campos que el backend ahora acepta
  const payload = {
    valor: this.notaForm.valor,
    materia_id: this.notaForm.materia_id,
    estudiante_id: this.notaForm.estudiante_id,
    profesor_id: this.notaForm.profesor_id,
    activo: this.notaForm.activo
  };

  console.log('Actualizando nota ID:', idNota, 'con payload:', payload);

  this.notaService.updateNota(idNota, payload).subscribe({
    next: () => {
      alert(' Nota actualizada correctamente');
      this.loadNotas();
      this.closeModal();
    },
    error: (error) => {
      console.error('Error al actualizar la nota:', error);
      let msg = 'Error al actualizar la nota';
      if (error?.error?.detail) {
        msg =
          typeof error.error.detail === 'string'
            ? error.error.detail
            : JSON.stringify(error.error.detail);
      }
      alert(msg);
    }
  });
}


  // Si estamos creando una nueva nota
    else {
    const payload = {
      materia_id: this.notaForm.materia_id,
      estudiante_id: this.notaForm.estudiante_id,
      profesor_id: this.notaForm.profesor_id, // ← ¡AQUÍ ESTÁ LA SOLUCIÓN!
      valor: this.notaForm.valor,
      activo: this.notaForm.activo
    };

    this.notaService.createNota(payload).subscribe({
      next: () => {
        alert(' Nota creada correctamente');
        this.loadNotas();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear la nota:', error);
        let msg = 'Error al crear la nota';
        if (error?.error?.detail) {
          msg = typeof error.error.detail === 'string'
            ? error.error.detail
            : JSON.stringify(error.error.detail);
        }
        alert(msg);
      }
    });
  }
}


  // Eliminar nota
  deleteNota(nota: Nota): void {
    if (confirm(`¿Está seguro de eliminar la nota con ID ${nota.id}?`)) {
      this.notaService.deleteNota(nota.id).subscribe({
        next: () => this.loadNotas(),
        error: (error) => console.error('Error al eliminar nota:', error)
      });
    }
  }
}
