import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { Profesor, CreateProfesorRequest, UpdateProfesorRequest, ProfesorFilters } from '../../shared/models/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private readonly endpoint = '/profesores';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los profesores con paginación
   */
  getProfesores(pagination: PaginationParams, filters?: ProfesorFilters): Observable<PaginatedResponse<Profesor>> {
    return this.apiService.getPaginated<Profesor>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un profesor por ID
   */
  getProfesorById(id: string): Observable<ApiResponse<Profesor>> {
    return this.apiService.get<Profesor>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo profesor
   */
  createProfesor(profesor: CreateProfesorRequest): Observable<ApiResponse<Profesor>> {
    return this.apiService.post<Profesor>(this.endpoint, profesor);
  }

  /**
   * Actualiza un profesor existente
   */
  updateProfesor(id: string, profesor: UpdateProfesorRequest): Observable<ApiResponse<Profesor>> {
    return this.apiService.put<Profesor>(`${this.endpoint}/${id}`, profesor);
  }

  /**
   * Elimina un profesor
   */
  deleteProfesor(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todos los profesores activos (sin paginación)
   */
  getProfesoresActivos(): Observable<ApiResponse<Profesor[]>> {
    return this.apiService.get<Profesor[]>(`${this.endpoint}/activos`);
  }

  /**
   * Activa o desactiva un profesor
   */
  toggleProfesorStatus(id: string, activo: boolean): Observable<ApiResponse<Profesor>> {
    return this.apiService.patch<Profesor>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
