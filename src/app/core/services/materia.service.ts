// src/app/core/services/materia.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { Materia, CreateMateriaRequest, UpdateMateriaRequest, MateriaFilters } from '../../shared/models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  // Sin barra final para evitar rutas dobles (//materias//id)
  private readonly endpoint = '/materias';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todas las materias con paginación y filtros
   */
  getMaterias(pagination: PaginationParams, filters?: MateriaFilters): Observable<PaginatedResponse<Materia>> {
    return this.apiService.getPaginated<Materia>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una materia por ID
   */
  getMateriaById(id: string): Observable<ApiResponse<Materia>> {
    return this.apiService.get<Materia>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva materia
   */
  createMateria(materia: CreateMateriaRequest): Observable<ApiResponse<Materia>> {
    return this.apiService.post<Materia>(this.endpoint, materia);
  }

  /**
   * Actualiza una materia existente
   */
  updateMateria(id: string, materia: UpdateMateriaRequest): Observable<ApiResponse<Materia>> {
    return this.apiService.put<Materia>(`${this.endpoint}/${id}`, materia);
  }

  /**
   * Elimina una materia
   */
  deleteMateria(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todas las materias activas (sin paginación)
   */
  getMateriasActivas(): Observable<ApiResponse<Materia[]>> {
    return this.apiService.get<Materia[]>(`${this.endpoint}/activas`);
  }

  /**
   * Activa o desactiva una materia
   */
  toggleMateriaStatus(id: string, activo: boolean): Observable<ApiResponse<Materia>> {
    return this.apiService.patch<Materia>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
