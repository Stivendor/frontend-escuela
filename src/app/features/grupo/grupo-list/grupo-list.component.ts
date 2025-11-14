import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { GrupoService } from '../../../core/services/grupo.service';
import { MateriaService } from '../../../core/services/materia.service';
import { ProfesorService } from '../../../core/services/profesor.service';
import {
  Grupo,
  CreateGrupoRequest,
  UpdateGrupoRequest,
  GrupoFilters,
} from '../../../shared/models/grupo.model';
import { Materia } from '../../../shared/models/materia.model';
import { Profesor } from '../../../shared/models/profesor.model';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.scss'],
})
export class GrupoListComponent implements OnInit {
  grupos: Grupo[] = [];
  allGrupos: Grupo[] = []; // 👈 copia completa para filtrado local
  materias: Materia[] = [];
  profesores: Profesor[] = [];

  loading = false;
  showModal = false;
  editingGrupo: Grupo | null = null;

  // 🔢 Paginación
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // 🔍 Filtros
  filters: GrupoFilters = {
    nombre: '',
    activo: undefined,
  };

  // 📋 Formulario
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
  ) { }

  ngOnInit(): void {
    this.loadMaterias();
    this.loadProfesores();
    this.loadGrupos();
  }

  // ================================
  // 🚀 CARGAR GRUPOS
  // ================================
  loadGrupos(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.grupoService.getGrupos(pagination, {}).subscribe({
      next: (response: any) => {
        console.log('📥 Respuesta cruda grupos:', response);

        const data =
          Array.isArray(response) ? response :
            response.data ?? response.results ?? response.grupos ?? response;

        if (!data || data.length === 0) {
          console.warn('⚠️ No se recibieron grupos. Cargando ejemplo local.');

          ;
          this.allGrupos = [...this.grupos];
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        this.grupos = (data as any[]).map((g: any) => ({
          id_grupo: g.id ?? g.id_grupo ?? '',
          nombre: g.nombre ?? g.nombre_grupo ?? '',
          materia_id: g.materia_id ?? g.materia?.id ?? '',
          profesor_id: g.profesor_id ?? g.profesor?.id ?? '',
          activo: g.activo ?? g.is_active ?? true,
          materia: g.materia
            ? { id: g.materia.id, nombre: g.materia.nombre }
            : this.materias.find((m) => m.id === g.materia_id) ?? { id: '', nombre: 'Sin asignar' },
          profesor: g.profesor
            ? { id: g.profesor.id, nombre: g.profesor.nombre }
            : this.profesores.find((p) => p.id === g.profesor_id) ?? { id: '', nombre: 'Sin asignar' },
        }));

        this.allGrupos = [...this.grupos];
        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Grupos mapeados:', this.grupos);
      },
      error: (error) => {
        console.error('❌ Error al cargar grupos:', error);
        this.grupos = [];
        this.loading = false;
      },
    });
  }

  // ================================
  // 📚 CARGAR MATERIAS Y PROFESORES
  // ================================
  loadMaterias(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };
    this.materiaService.getMaterias(pagination, {}).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : response.data ?? response;
        this.materias = (data ?? []).map((m: any) => ({
          id: m.id ?? m.id_materia ?? '',
          nombre: m.nombre ?? 'Sin nombre',
        }));
        console.log('✅ Materias cargadas:', this.materias);
      },
      error: (err) => console.error('Error al cargar materias:', err),
    });
  }

  loadProfesores(): void {
    const pagination: PaginationParams = { page: 1, limit: 100 };
    this.profesorService.getProfesores(pagination, {}).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : response.data ?? response;
        this.profesores = (data ?? []).map((p: any) => ({
          id: p.id ?? p.id_profesor ?? '',
          nombre: p.persona?.nombre ?? p.nombre ?? 'Sin nombre',
        }));
        console.log('✅ Profesores cargados:', this.profesores);
      },
      error: (err) => console.error('Error al cargar profesores:', err),
    });
  }

  // ================================
  // 🔍 FILTROS (buscador + activo)
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
    this.grupos = [...this.allGrupos];
  }

  // ================================
  // 📄 PAGINACIÓN
  // ================================
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGrupos();
    }
  }

  // ================================
  // 🧱 MODAL
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
  }

  editGrupo(grupo: Grupo): void {
    this.editingGrupo = grupo;
    this.grupoForm = {
      nombre: grupo.nombre,
      materia_id: grupo.materia_id,
      profesor_id: grupo.profesor_id,
      activo: grupo.activo,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGrupo = null;
    this.grupoForm = {
      nombre: '',
      materia_id: '',
      profesor_id: '',
      activo: true,
    };
  }

  // ================================
  // 💾 GUARDAR (crear / actualizar)
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

    const payload = { ...this.grupoForm };

    if (this.editingGrupo) {
      if (!this.editingGrupo.id) {
        console.error('❌ No se encontró el ID del grupo a editar');
        alert('Error interno: falta el ID del grupo');
        return;
      }

      this.grupoService.updateGrupo(this.editingGrupo.id, payload).subscribe({
        next: () => {
          this.loadGrupos();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al actualizar grupo:', error);
          alert('Error al actualizar el grupo');
        },
      });
    } else {
      this.grupoService.createGrupo(payload).subscribe({
        next: () => {
          this.loadGrupos();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al crear grupo:', error);
          alert('Error al crear el grupo');
        },
      });
    }
  }

  // ================================
  // 🗑️ ELIMINAR
  // ================================
  deleteGrupo(grupo: Grupo): void {
    if (!grupo.id) {
      console.error('❌ No se encontró el ID del grupo a eliminar');
      alert('Error interno: falta el ID del grupo');
      return;
    }

    if (confirm(`¿Está seguro de eliminar el grupo "${grupo.nombre}"?`)) {
      this.grupoService.deleteGrupo(grupo.id).subscribe({
        next: () => this.loadGrupos(),
        error: (error) => {
          console.error('❌ Error al eliminar grupo:', error);
          alert('No se pudo eliminar el grupo');
        },
      });
    }
  }
}
