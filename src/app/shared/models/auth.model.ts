export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id_usuario: string;
    username: string;
    rol: string;
  };
}
