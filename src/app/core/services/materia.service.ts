import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

// Si luego creas modelos específicos, puedes reemplazar los 'any' por:
// import { Materia, CreateMateriaRequest, UpdateMateriaRequest, MateriaFilters } from '../../shared/models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private readonly endpoint = '/materias/';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todas las materias con paginación
   */
  getMaterias(pagination: PaginationParams, filters?: any): Observable<PaginatedResponse<any>> {
    return this.apiService.getPaginated<any>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una materia por ID
   */
  getMateriaById(id: number): Observable<ApiResponse<any>> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva materia
   */
  createMateria(materia: any): Observable<ApiResponse<any>> {
    return this.apiService.post<any>(this.endpoint, materia);
  }

  /**
   * Actualiza una materia existente
   */
  updateMateria(id: number, materia: any): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, materia);
  }

  /**
   * Elimina una materia
   */
  deleteMateria(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todas las materias activas (sin paginación)
   */
  getMateriasActivas(): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`${this.endpoint}/activas`);
  }

  /**
   * Activa o desactiva una materia
   */
  toggleMateriaStatus(id: number, activo: boolean): Observable<ApiResponse<any>> {
    return this.apiService.patch<any>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
