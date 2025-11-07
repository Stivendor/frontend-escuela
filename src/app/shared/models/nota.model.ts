export interface Nota {
  id: number | string;
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

  // 👇 Campos agregados para mostrar nombres directamente en la tabla
  materia_nombre?: string;
  estudiante_nombre?: string;
  profesor_nombre?: string;

  // Campos de auditoría (opcionalmente)
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  comentario?: string;
}

export interface CreateNotaRequest {
  materia_id: number | string;
  estudiante_id: number | string;
  profesor_id: number | string;
  valor: number;
  activo: boolean;
}

export interface UpdateNotaRequest {
  materia_id?: number | string;
  estudiante_id?: number | string;
  profesor_id?: number | string;
  valor?: number;
  activo?: boolean;
}

export interface NotaFilters {
  materia_id?: number | string;
  estudiante_id?: number | string;
  profesor_id?: number | string;
  activo?: boolean;
}
