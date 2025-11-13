export interface Usuario {
  id_usuario: string;
  username: string;
  rol: string;
  fecha_creacion: string;
  activo?: boolean;
  ultimo_acceso?: string;
}

export interface CreateUsuarioRequest {
  username: string;
  password: string;
  rol: string;
}

export interface UpdateUsuarioRequest {
  username?: string;
  password?: string;
  rol?: string;
  activo?: boolean;
}

export interface UsuarioFilters {
  username?: string;
  rol?: string;
}
