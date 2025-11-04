import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Periodo, CreatePeriodoRequest, PeriodoFilters } from '../../shared/models/periodo.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private apiUrl = `${environment.apiUrl}/periodos/`;

  constructor(private http: HttpClient) {}

  /**
   * ✅ Obtener lista de periodos con paginación y filtros.
   */
  getPeriodos(
    pagination?: { page: number; limit: number },
    filters?: PeriodoFilters
  ): Observable<PaginatedResponse<Periodo[]>> {
    let params = new HttpParams();

    // 📄 Paginación
    if (pagination) {
      params = params
        .set('page', pagination.page.toString())
        .set('limit', pagination.limit.toString());
    }

    // 🔍 Filtros opcionales
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<Periodo[]>>(this.apiUrl, { params });
  }

  /**
   * ✅ Obtener un periodo por ID.
   */
  getPeriodoById(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Crear nuevo periodo.
   */
  createPeriodo(periodo: CreatePeriodoRequest): Observable<Periodo> {
    return this.http.post<Periodo>(this.apiUrl, periodo);
  }

  /**
   * ✅ Actualizar periodo existente.
   */
  updatePeriodo(id: number, periodo: Partial<CreatePeriodoRequest>): Observable<Periodo> {
    return this.http.put<Periodo>(`${this.apiUrl}/${id}`, periodo);
  }

  /**
   * ✅ Eliminar un periodo.
   */
  deletePeriodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
