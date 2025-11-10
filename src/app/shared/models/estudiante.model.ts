// src/app/shared/models/estudiante.model.ts

export interface Estudiante {
  id: string;
  nombre: string;
  carrera: string;
  email: string;
  telefono: string;
  semestre: number;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateEstudianteRequest {
  nombre: string;
  carrera: string;
  email: string;
  telefono: string;
  semestre: number;
  activo?: boolean;
}

export interface UpdateEstudianteRequest {
  nombre?: string;
  carrera?: string;
  email?: string;
  telefono?: string;
  semestre?: number;
  activo?: boolean;
}

export interface EstudianteFilters {
  nombre?: string;
  carrera?: string;
  activo?: boolean;
}
