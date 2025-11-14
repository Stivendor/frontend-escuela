export interface Nota {
  id: number | string;
  id_nota?: string;
  materia_id: number | string;
  estudiante_id: number | string;
  profesor_id: number | string;
  valor: number;
  activo: boolean;

  // Relaciones opcionales
  estudiante?: {
    id: number | string;
    nombre: string;
  };
  profesor?: {
    id: number | string;
    nombre: string;
  };
  materia?: {
    id: number | string;
    nombre: string;
  };

  materia_nombre?: string;
  estudiante_nombre?: string;
  profesor_nombre?: string;

  fecha_creacion?: string;
  fecha_actualizacion?: string;
  comentario?: string;
}

export interface CreateNotaRequest {
  materia_id: string | number;
  estudiante_id: string | number;
  valor: number;

  // estos dos se dejan opcionales por compatibilidad
  profesor_id?: string | number;
  activo?: boolean;
}

export interface UpdateNotaRequest {
  materia_id?: number | string;
  estudiante_id?: number | string;
  profesor_id?: number | string;
  valor?: number;
  activo?: boolean;
}

export interface NotaFilters {
  materia?: string;
  estudiante?: string;
  activo?: boolean | string;
}
