import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Grupo, CreateGrupoRequest, GrupoFilters } from 'src/app/shared/models/grupo.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = `${environment.apiUrl}/grupos`;

  constructor(private http: HttpClient) {}

  /**
   * ✅ Obtener lista de grupos con paginación y filtros.
   */
  getGrupos(
    pagination?: { page: number; limit: number },
    filters?: GrupoFilters
  ): Observable<PaginatedResponse<Grupo>> {
    let params = new HttpParams();

    // Paginación
    if (pagination) {
      params = params
        .set('page', pagination.page.toString())
        .set('limit', pagination.limit.toString());
    }

    // Filtros
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<Grupo>>(this.apiUrl, { params });
  }

  /**
   * ✅ Obtener un grupo por su ID.
   */
  getGrupoById(id: number): Observable<ApiResponse<Grupo>> {
    return this.http.get<ApiResponse<Grupo>>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Crear un nuevo grupo.
   */
  createGrupo(grupo: CreateGrupoRequest): Observable<ApiResponse<Grupo>> {
    return this.http.post<ApiResponse<Grupo>>(this.apiUrl, grupo);
  }

  /**
   * ✅ Actualizar un grupo existente.
   */
  updateGrupo(id: number, grupo: Partial<CreateGrupoRequest>): Observable<ApiResponse<Grupo>> {
    return this.http.put<ApiResponse<Grupo>>(`${this.apiUrl}/${id}`, grupo);
  }

  /**
   * ✅ Eliminar un grupo por ID.
   */
  deleteGrupo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
