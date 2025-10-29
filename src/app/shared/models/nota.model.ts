export interface Nota {
  id: number;
  materia_id: number;
  estudiante_id: number;
  profesor_id: number;
  valor: number;
  fecha_creacion: string;
  activo: boolean;
}

export interface CreateNotaRequest {
  materia_id: number;
  estudiante_id: number;
  profesor_id: number;
  valor: number;
  activo: boolean;
}

export interface UpdateNotaRequest {
  materia_id?: number;
  estudiante_id?: number;
  profesor_id?: number;
  valor?: number;
  activo?: boolean;
}

export interface NotaFilters {
  materia_id?: number;
  estudiante_id?: number;
  profesor_id?: number;
  activo?: boolean;
}
