/**
 * Representa un grupo académico dentro del sistema.
 */
export interface Grupo {
  id?: string; // opcional para compatibilidad
  id_grupo?: string;
  nombre: string;
  materia_id: string;
  profesor_id: string;
  activo: boolean;

  // Relaciones opcionales (para mostrar nombres en vez de IDs)
  materia?: MateriaRef;
  profesor?: ProfesorRef;
}

/**
 * Datos requeridos para crear un nuevo grupo.
 */
export interface CreateGrupoRequest {
  nombre: string;
  materia_id: string;
  profesor_id: string;
  activo: boolean;
}

/**
 * Filtros usados en la búsqueda/listado de grupos.
 */
export interface GrupoFilters {
  nombre?: string;
  materia_id?: string;
  profesor_id?: string;
  activo?: boolean | string;
}

/**
 * Tipos de referencia ligeros para relaciones.
 */
export interface MateriaRef {
  id: string;
  nombre: string;
}

export interface PeriodoRef {
  id: string;
  nombre: string;
}

export interface ProfesorRef {
  id: string;
  nombre: string;
}

/**
 * Datos usados para actualizar un grupo existente.
 */
export interface UpdateGrupoRequest extends CreateGrupoRequest {
  id?: string; // UUID del grupo
}
