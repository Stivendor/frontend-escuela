// src/app/shared/models/profesor.model.ts

export interface Profesor {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateProfesorRequest {
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  activo?: boolean;
}

export interface UpdateProfesorRequest {
  nombre?: string;
  especialidad?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
}

export interface ProfesorFilters {
  nombre?: string;
  especialidad?: string;
  activo?: boolean;
}
