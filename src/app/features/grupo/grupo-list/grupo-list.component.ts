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
  this.loadGrupos();
  this.loadMaterias();
  this.loadProfesores();
}


  // === Carga de datos ===
loadGrupos(): void {
  this.loading = true;

  const pagination: PaginationParams = {
    page: this.currentPage,
    limit: this.pageSize,
  };

  // Esperar a que materias y profesores estén cargados antes de procesar los grupos
  const waitForData = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (this.materias.length > 0 && this.profesores.length > 0) {
          resolve();
        } else {
          setTimeout(check, 100); // Revisa cada 100ms
        }
      };
      check();
    });

  waitForData().then(() => {
    this.grupoService.getGrupos(pagination, this.filters).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta cruda grupos:', response);

        const data = Array.isArray(response)
          ? response
          : response.data ?? response;

        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.warn('⚠️ No se recibieron grupos desde el backend.');
          this.totalPages = 1;
          this.loading = false;
          return;
        }

        this.grupos = (data as any[]).map((g: any) => {
          const materiaEncontrada = this.materias.find(
            (m) => m.id === (g.materia_id ?? g.materia?.id)
          );
          const profesorEncontrado = this.profesores.find(
            (p) => p.id === (g.profesor_id ?? g.profesor?.id)
          );

          return {
            id: g.id ?? g.id_grupo ?? 0,
            nombre: g.nombre ?? g.nombre_grupo ?? '',
            materia_id: g.materia_id ?? g.materia?.id ?? 0,
            profesor_id: g.profesor_id ?? g.profesor?.id ?? 0,
            activo: g.activo ?? g.is_active ?? true,

            materia: materiaEncontrada
              ? { id: materiaEncontrada.id, nombre: materiaEncontrada.nombre }
              : g.materia
              ? { id: g.materia.id, nombre: g.materia.nombre }
              : { id: 0, nombre: 'Sin asignar' },

            profesor: profesorEncontrado
              ? { id: profesorEncontrado.id, nombre: profesorEncontrado.nombre }
              : g.profesor
              ? { id: g.profesor.id, nombre: g.profesor.nombre }
              : { id: 0, nombre: 'Sin asignar' },
          } as Grupo;
        });

        this.totalPages = response.total_pages ?? response.totalPages ?? 1;
        this.loading = false;
        console.log('✅ Grupos cargados:', this.grupos);
      },
      error: (error) => {
        console.error('❌ Error al cargar grupos:', error);
        this.grupos = [];
        this.loading = false;
      },
    });
  });
}




  loadMaterias(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.materiaService.getMaterias(pagination, {}).subscribe({
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

loadProfesores(): void {
  this.loading = true;
  const pagination: PaginationParams = {
    page: this.currentPage,
    limit: this.pageSize,
  };

  const profesorFilters = { activo: true }; // 👈 tipo correcto

  this.profesorService.getProfesores(pagination, profesorFilters).subscribe({
    next: (response: any) => {
      const data = Array.isArray(response) ? response : response.data;

      if (!data) {
        console.error('⚠️ El backend no devolvió datos válidos:', response);
        this.loading = false;
        return;
      }

      this.profesores = data.map((p: any) => ({
        id: p.id_profesor,
        nombre: p.persona?.nombre || '',
        especialidad: p.especialidad,
        email: p.persona?.email || '',
        telefono: p.persona?.telefono || '',
        departamento: p.departamento,
        activo: p.activo ?? true,
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
