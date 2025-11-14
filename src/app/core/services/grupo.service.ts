import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Grupo,
  CreateGrupoRequest,
  UpdateGrupoRequest,
  GrupoFilters
} from '../../shared/models/grupo.model';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private endpoint = '/grupos/';

  constructor(private apiService: ApiService) { }

  /**
   * Obtener grupos con paginación y filtros
   */
  getGrupos(
    pagination?: PaginationParams,
    filters?: GrupoFilters
  ): Observable<ApiResponse<Grupo[]>> {
    const params: any = { ...pagination, ...filters };
    return this.apiService.get<Grupo[]>(this.endpoint, params);
  }

  /**
   *  Obtener un grupo por ID
   */
  getGrupoById(id_grupo: string): Observable<ApiResponse<Grupo>> {
    return this.apiService.get<Grupo>(`${this.endpoint}/${id_grupo}`);
  }

  /**
   *  Crear un nuevo grupo
   */
  createGrupo(data: CreateGrupoRequest): Observable<ApiResponse<Grupo>> {
    return this.apiService.post<Grupo>(this.endpoint, data);
  }

  /**
   *  Actualizar un grupo existente
   */
  updateGrupo(id_grupo: string, data: UpdateGrupoRequest): Observable<ApiResponse<Grupo>> {
    return this.apiService.put<Grupo>(`${this.endpoint}/${id_grupo}`, data);
  }

  /**
   *  Eliminar un grupo por ID
   */
  deleteGrupo(id_grupo: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id_grupo}`);
  }
}
