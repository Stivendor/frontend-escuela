import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GrupoService } from '../../../core/services/grupo.service';
import { MateriaService } from '../../../core/services/materia.service';
import { ProfesorService } from '../../../core/services/profesor.service';
import {
  Grupo,
  CreateGrupoRequest,
  GrupoFilters,
} from '../../../shared/models/grupo.model';
import { Materia } from '../../../shared/models/materia.model';
import { Profesor } from '../../../shared/models/profesor.model';
import { PaginationParams } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.scss'],
})
export class GrupoListComponent implements OnInit {
  // Datos
  grupos: Grupo[] = [];
  allGrupos: Grupo[] = []; // 👈 copia completa para filtrado local
  materias: Materia[] = [];
  profesores: Profesor[] = [];

  // Estado UI
  loading = false;
  showModal = false;
  editingGrupo: Grupo | null = null;

  // Paginación
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Filtros
  filters: GrupoFilters = {
    nombre: '',
    activo: undefined,
  };

  // Formulario
  grupoForm: CreateGrupoRequest = {
    nombre: '',
    materia_id: '',
    profesor_id: '',
    activo: true,
  };

  constructor(
    private grupoService: GrupoService,
    private materiaService: MateriaService,
    private profesorService: ProfesorService
  ) {}

  ngOnInit(): void {
    this.loadMaterias();
    this.loadProfesores();
    this.loadGrupos();
  }

  // ================================
  // Cargar grupos
  // ================================
  loadGrupos(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.grupoService.getGrupos(pagination, this.filters).subscribe({
      next: (response) => {
        console.log('📦 Grupos desde backend:', response);

        const data = Array.isArray(response)
          ? response
          : (response as any)?.data ?? response;

        this.grupos = (data ?? []).map((g: any) => {
          const id = (g.id || g.id_grupo || '') as string;
          const materiaId = (g.materia_id || g.materia?.id || '') as string;
          const profesorId = (g.profesor_id || g.profesor?.id || '') as string;

          const materiaEncontrada = this.materias.find(
            (m) => m.id === materiaId
          );
          const profesorEncontrado = this.profesores.find(
            (p) => p.id === profesorId
          );

          const grupo: Grupo = {
            id,
            id_grupo: id,
            nombre: g.nombre || g.nombre_grupo || '',
            materia_id: materiaId,
            profesor_id: profesorId,
            activo:
              typeof g.activo === 'boolean'
                ? g.activo
                : g.is_active !== undefined
                ? g.is_active
                : true,
            materia: materiaEncontrada
              ? { id: materiaEncontrada.id, nombre: materiaEncontrada.nombre }
              : g.materia
              ? { id: g.materia.id, nombre: g.materia.nombre }
              : { id: '', nombre: 'Sin asignar' },
            profesor: profesorEncontrado
              ? { id: profesorEncontrado.id, nombre: profesorEncontrado.nombre }
              : g.profesor
              ? { id: g.profesor.id, nombre: g.profesor.nombre }
              : { id: '', nombre: 'Sin asignar' },
          };

          return grupo;
        });

        this.totalPages = 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar grupos:', error);
        this.grupos = [];
        this.loading = false;
      },
    });
  }

  // ================================
  // Cargar materias
  // ================================
  loadMaterias(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };

    this.materiaService.getMaterias(pagination, {}).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response)
          ? response
          : response?.data ?? response;

        this.materias = (data ?? []).map((m: any) => ({
          id: m.id_materia ?? m.id ?? '',
          nombre: m.nombre ?? 'Sin nombre',
        })) as Materia[];

        console.log('📘 Materias:', this.materias);
      },
      error: (error) => {
        console.error('❌ Error al cargar materias:', error);
        this.materias = [];
      }
    });
  }

  // ================================
  // Cargar profesores
  // ================================
  loadProfesores(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };

    this.profesorService
      .getProfesores(pagination, { activo: true })
      .subscribe({
        next: (response: any) => {
          const data = Array.isArray(response)
            ? response
            : response?.data ?? response;

          this.profesores = (data ?? []).map((p: any) => ({
            id: p.id_profesor ?? p.id ?? '',
            nombre: p.persona?.nombre || p.nombre || '',
          })) as Profesor[];

          console.log('👨‍🏫 Profesores:', this.profesores);
        },
        error: (error) => {
          console.error('❌ Error al cargar profesores:', error);
          this.profesores = [];
        },
      });
  }

  // ================================
  // Filtros
  // ================================
  onFilterChange(): void {
    const nombreFiltro = this.filters.nombre?.toLowerCase().trim() || '';
    const activoFiltro = this.filters.activo;

    this.grupos = this.allGrupos.filter((g) => {
      const coincideNombre = g.nombre.toLowerCase().includes(nombreFiltro);
      const coincideActivo =
        activoFiltro === undefined ? true : g.activo === activoFiltro;
      return coincideNombre && coincideActivo;
    });
  }

  clearFilters(): void {
    this.filters = { nombre: '', activo: undefined };
    this.loadGrupos();
  }

  // ================================
  // Modal: crear
  // ================================
  openCreateModal(): void {
    this.editingGrupo = null;
    this.grupoForm = {
      nombre: '',
      materia_id: '',
      profesor_id: '',
      activo: true,
    };
    this.showModal = true;
    console.log('🟢 Modal crear abierto');
  }

  // ================================
  // Modal: editar
  // ================================
  editGrupo(grupo: any): void {
    console.log('📝 Editar grupo clickeado:', grupo);

    this.editingGrupo = {
      id: grupo.id ?? grupo.id_grupo ?? '',
      id_grupo: grupo.id_grupo ?? grupo.id ?? '',
      nombre: grupo.nombre || '',
      materia_id: grupo.materia_id || '',
      profesor_id: grupo.profesor_id || '',
      activo: grupo.activo ?? true,
      materia: grupo.materia,
      profesor: grupo.profesor,
    };

    this.grupoForm = {
      nombre: this.editingGrupo.nombre,
      materia_id: this.editingGrupo.materia_id,
      profesor_id: this.editingGrupo.profesor_id,
      activo: this.editingGrupo.activo,
    };

    this.showModal = true;
    console.log('🟡 Modal editar abierto, showModal =', this.showModal);
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGrupo = null;
  }

  // ================================
  // Guardar (crear / actualizar)
  // ================================
  saveGrupo(): void {
    if (
      !this.grupoForm.nombre.trim() ||
      !this.grupoForm.materia_id ||
      !this.grupoForm.profesor_id
    ) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    const payload: CreateGrupoRequest = { ...this.grupoForm };
    console.log('📨 Payload a enviar:', payload);

    // EDITAR
    if (this.editingGrupo) {
      const id = this.editingGrupo.id_grupo ?? this.editingGrupo.id;

      if (!id) {
        alert('Error interno: falta el ID del grupo');
        return;
      }

      this.grupoService.updateGrupo(id, payload).subscribe({
        next: (res) => {
          console.log('✅ Grupo actualizado:', res);
          this.loadGrupos();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al actualizar grupo:', error);
          alert(
            'Error al actualizar grupo: ' +
              (error.error?.detail ?? 'ver consola')
          );
        },
      });
      return;
    }

    // CREAR
    this.grupoService.createGrupo(payload).subscribe({
      next: (res) => {
        console.log('✅ Grupo creado:', res);
        this.loadGrupos();
        this.closeModal();
      },
      error: (error) => {
        console.error('❌ Error al crear grupo:', error);
        alert(
          'Error al crear grupo: ' +
            (error.error?.detail ?? 'ver consola')
        );
      },
    });
  }

  // ================================
  // Eliminar
  // ================================
  deleteGrupo(grupo: Grupo): void {
    const id = grupo.id_grupo ?? grupo.id;

    if (!id) {
      alert('Error interno: falta el ID del grupo');
      return;
    }

    if (confirm(`¿Eliminar el grupo "${grupo.nombre}"?`)) {
      this.grupoService.deleteGrupo(id).subscribe({
        next: () => this.loadGrupos(),
        error: (error) => {
          console.error('❌ Error al eliminar grupo:', error);
          alert('No se pudo eliminar el grupo');
        },
      });
    }
  }

  // Paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGrupos();
    }
  }
}
