import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { Estudiante, CreateEstudianteRequest, UpdateEstudianteRequest, EstudianteFilters } from '../../shared/models/estudiante.model';
import { Materia, MateriaFilters } from 'src/app/shared/models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private readonly endpoint = '/estudiantes';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los estudiantes con paginación
   */
  getEstudiantes(pagination: PaginationParams, filters?: EstudianteFilters): Observable<PaginatedResponse<Estudiante>> {
    return this.apiService.getPaginated<Estudiante>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un estudiante por ID
   */
  getEstudianteById(id: string): Observable<ApiResponse<Estudiante>> {
    return this.apiService.get<Estudiante>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo estudiante
   */
  createEstudiante(estudiante: CreateEstudianteRequest): Observable<ApiResponse<Estudiante>> {
    return this.apiService.post<Estudiante>(this.endpoint, estudiante);
  }

  /**
   * Actualiza un estudiante existente
   */
  updateEstudiante(id: string, estudiante: UpdateEstudianteRequest): Observable<ApiResponse<Estudiante>> {
    return this.apiService.put<Estudiante>(`${this.endpoint}/${id}`, estudiante);
  }

  /**
   * Elimina un estudiante
   */
  deleteEstudiante(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todos los estudiantes activos (sin paginación)
   */
  getEstudiantesActivos(): Observable<ApiResponse<Estudiante[]>> {
    return this.apiService.get<Estudiante[]>(`${this.endpoint}/activos`);
  }

  /**
   * Activa o desactiva un estudiante
   */
  toggleEstudianteStatus(id: string, activo: boolean): Observable<ApiResponse<Estudiante>> {
    return this.apiService.patch<Estudiante>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
