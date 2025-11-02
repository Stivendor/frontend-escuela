import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

// Si tienes un modelo específico para Estudiante, puedes importarlo así:
// import { Estudiante, CreateEstudianteRequest, UpdateEstudianteRequest, EstudianteFilters } from '../../shared/models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private readonly endpoint = '/estudiantes/';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los estudiantes con paginación
   */
  getEstudiantes(pagination: PaginationParams, filters?: any): Observable<PaginatedResponse<any>> {
    return this.apiService.getPaginated<any>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un estudiante por ID
   */
  getEstudianteById(id: number): Observable<ApiResponse<any>> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo estudiante
   */
  createEstudiante(estudiante: any): Observable<ApiResponse<any>> {
    return this.apiService.post<any>(this.endpoint, estudiante);
  }

  /**
   * Actualiza un estudiante existente
   */
  updateEstudiante(id: number, estudiante: any): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, estudiante);
  }

  /**
   * Elimina un estudiante
   */
  deleteEstudiante(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todos los estudiantes activos (sin paginación)
   */
  getEstudiantesActivos(): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`${this.endpoint}/activos`);
  }

  /**
   * Activa o desactiva un estudiante
   */
  toggleEstudianteStatus(id: number, activo: boolean): Observable<ApiResponse<any>> {
    return this.apiService.patch<any>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
