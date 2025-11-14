// src/app/shared/models/grupo.model.ts

export interface Grupo {
  id?: string;
  id_grupo?: string;

  nombre: string;
  materia_id: string;   // UUID
  profesor_id: string;  // UUID
  activo: boolean;

  materia?: MateriaRef;
  profesor?: ProfesorRef;
}

export interface CreateGrupoRequest {
  nombre: string;
  materia_id: string;
  profesor_id: string;
  activo: boolean;
}

export interface GrupoFilters {
  nombre?: string;
  materia_id?: string;
  profesor_id?: string;
  activo?: boolean | string;
}

export interface MateriaRef {
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
