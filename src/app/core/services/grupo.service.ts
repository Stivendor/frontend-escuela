// src/app/core/services/grupo.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  Grupo,
  CreateGrupoRequest,
  GrupoFilters,
} from 'src/app/shared/models/grupo.model';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private apiUrl = `${environment.apiUrl}/grupos`;

  constructor(private http: HttpClient) {}

  getGrupos(
    pagination?: PaginationParams,
    filters?: GrupoFilters
  ): Observable<Grupo[]> {
    let params = new HttpParams();

    if (pagination) {
      params = params
        .set('page', pagination.page.toString())
        .set('limit', pagination.limit.toString());
    }

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<Grupo[]>(this.apiUrl, { params });
  }

  getGrupoById(id: string): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.apiUrl}/${id}`);
  }

  createGrupo(grupo: CreateGrupoRequest): Observable<Grupo> {
    return this.http.post<Grupo>(this.apiUrl, grupo);
  }

  updateGrupo(id: string, grupo: Partial<CreateGrupoRequest>): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/${id}`, grupo);
  }

  deleteGrupo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
