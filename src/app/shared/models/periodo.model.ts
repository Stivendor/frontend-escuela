export interface Periodo {
  id: number;
  nombre: string;
  activo: boolean;
}

/**
 * Estructura para crear un nuevo periodo.
 */
export interface CreatePeriodoRequest {
  nombre: string;
  activo: boolean;
}

/**
 * Filtros opcionales para listar periodos.
 */
export interface PeriodoFilters {
  nombre?: string;
  activo?: boolean | string;
}

