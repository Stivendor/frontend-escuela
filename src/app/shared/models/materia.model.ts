// src/app/shared/models/materia.model.ts

/**
 * Modelo principal de Materia
 * Compatible con el backend (UUIDs y campos opcionales)
 */
export interface Materia {
  id: string;                // UUID generado por el backend
  nombre: string;
  codigo: string;
  creditos: number;
  profesor_id?: string;      // también UUID o null si no asignado
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

/**
 * Estructura para crear una nueva materia
 */
export interface CreateMateriaRequest {
  nombre: string;
  codigo: string;
  creditos: number;
  profesor_id?: string;      // opcional al crear
  activo: boolean;
}

/**
 * Estructura para actualizar una materia existente
 */
export interface UpdateMateriaRequest {
  nombre?: string;
  codigo?: string;
  creditos?: number;
  profesor_id?: string;
  activo?: boolean;
}

/**
 * Filtros para búsqueda o listado de materias
 */
export interface MateriaFilters {
  nombre?: string;
  codigo?: string;
  activo?: boolean;
}

