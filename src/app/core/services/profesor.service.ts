import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

// Si luego creas modelos específicos, reemplaza los 'any' por:
// import { Profesor, CreateProfesorRequest, UpdateProfesorRequest, ProfesorFilters } from '../../shared/models/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private readonly endpoint = '/profesores';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los profesores con paginación
   */
  getProfesores(pagination: PaginationParams, filters?: any): Observable<PaginatedResponse<any>> {
    return this.apiService.getPaginated<any>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un profesor por ID
   */
  getProfesorById(id: number): Observable<ApiResponse<any>> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo profesor
   */
  createProfesor(profesor: any): Observable<ApiResponse<any>> {
    return this.apiService.post<any>(this.endpoint, profesor);
  }

  /**
   * Actualiza un profesor existente
   */
  updateProfesor(id: number, profesor: any): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, profesor);
  }

  /**
   * Elimina un profesor
   */
  deleteProfesor(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todos los profesores activos (sin paginación)
   */
  getProfesoresActivos(): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`${this.endpoint}/activos`);
  }

  /**
   * Activa o desactiva un profesor
   */
  toggleProfesorStatus(id: number, activo: boolean): Observable<ApiResponse<any>> {
    return this.apiService.patch<any>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
