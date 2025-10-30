// src/app/shared/models/materia.model.ts

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  profesor_id: number;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateMateriaRequest {
  nombre: string;
  codigo: string;
  creditos: number;
  profesor_id?: number; // <- 🔹 hazlo opcional
  activo: boolean;
}


export interface UpdateMateriaRequest {
  nombre?: string;
  codigo?: string;
  creditos?: number;
  profesor_id?: number;
  activo?: boolean;
}

export interface MateriaFilters {
  nombre?: string;
  codigo?: string;
  activo?: boolean;
}
