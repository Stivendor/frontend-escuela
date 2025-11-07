import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { Nota, CreateNotaRequest, UpdateNotaRequest, NotaFilters } from '../../shared/models/nota.model';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private readonly endpoint = '/notas/';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las notas con paginación y filtros
   */
  getNotas(pagination: PaginationParams, filters?: NotaFilters): Observable<PaginatedResponse<Nota>> {
    return this.apiService.getPaginated<Nota>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una nota por su ID
   */
  getNotaById(id: number): Observable<ApiResponse<Nota>> {
    return this.apiService.get<Nota>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva nota
   */
  createNota(nota: CreateNotaRequest): Observable<ApiResponse<Nota>> {
    return this.apiService.post<Nota>(this.endpoint, nota);
  }

  /**
   * Actualiza una nota existente
   */
  updateNota(id: string | number, nota: any): Observable<any> {
  return this.apiService.put<any>(`${this.endpoint}/${id}`, nota);
}

  /**
   * Elimina una nota
   */
  deleteNota(id: string | number): Observable<any> {
  return this.apiService.delete<any>(`${this.endpoint}/${id}`);
}

  /**
   * Obtiene todas las notas de un estudiante específico
   */
  getNotasPorEstudiante(estudianteId: number): Observable<ApiResponse<Nota[]>> {
    return this.apiService.get<Nota[]>(`${this.endpoint}/estudiante/${estudianteId}`);
  }

  /**
   * Obtiene todas las notas de una materia específica
   */
  getNotasPorMateria(materiaId: number): Observable<ApiResponse<Nota[]>> {
    return this.apiService.get<Nota[]>(`${this.endpoint}/materia/${materiaId}`);
  }
}
