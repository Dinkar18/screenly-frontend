export interface AuthResponse {
  userId?: number;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
  message?: string;
}

export interface User {
  id?: number;
  name?: string;
  email: string;
  role?: string;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  name?: string;
  email?: string;
  password?: string;
}
