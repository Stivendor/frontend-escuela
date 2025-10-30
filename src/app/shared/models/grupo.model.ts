/**
 * Representa un grupo académico dentro del sistema.
 */
export interface Grupo {
  id: number;
  nombre: string;
  materia_id: number;
  periodo_id: number;
  profesor_id: number;
  activo: boolean;

  // Relaciones opcionales (para mostrar nombres en vez de IDs)
  materia?: MateriaRef;
  periodo?: PeriodoRef;
  profesor?: ProfesorRef;
}

/**
 * Datos requeridos para crear un nuevo grupo.
 */
export interface CreateGrupoRequest {
  nombre: string;
  materia_id: number;
  periodo_id: number;
  profesor_id: number;
  activo: boolean;
}

/**
 * Filtros usados en la búsqueda/listado de grupos.
 */
export interface GrupoFilters {
  nombre?: string;
  materia_id?: number;
  periodo_id?: number;
  profesor_id?: number;
  activo?: boolean | string;
}

/**
 * Tipos de referencia ligeros para relaciones (evita duplicar estructuras).
 */
export interface MateriaRef {
  id: number;
  nombre: string;
}

export interface PeriodoRef {
  id: number;
  nombre: string;
}

export interface ProfesorRef {
  id: number;
  nombre: string;
}
