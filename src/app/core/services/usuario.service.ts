import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest, UsuarioFilters } from '../../shared/models/usuario.model';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = '/usuarios';

  constructor(private apiService: ApiService) {}

  // Obtener usuarios con paginación y filtros
  getUsuarios(pagination?: PaginationParams, filters?: UsuarioFilters): Observable<ApiResponse<Usuario[]>> {
    const params: any = { ...pagination, ...filters };
    return this.apiService.get<Usuario[]>(this.endpoint, params);
  }

  // Crear usuario
  createUsuario(data: CreateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.apiService.post<Usuario>(this.endpoint, data);
  }

  // Actualizar usuario
  updateUsuario(id_usuario: string, usuario: UpdateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id_usuario}`, usuario);
  }

  // Eliminar usuario
  deleteUsuario(id_usuario: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id_usuario}`);
  }
}
