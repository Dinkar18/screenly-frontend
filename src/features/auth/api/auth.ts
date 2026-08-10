import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { AuthResponse } from '../types';

export const authApi = {
  login: async (email?: string, password?: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, { email, password });
    return data;
  },
  
  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  },
  
  getMe: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>(ENDPOINTS.AUTH.ME);
    return data;
  },

  register: async (name?: string, email?: string, password?: string): Promise<string> => {
    const { data } = await api.post<string>(ENDPOINTS.AUTH.REGISTER, { name, email, password });
    return data;
  },

  verifyEmail: async (token: string): Promise<string> => {
    const { data } = await api.post<string>(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return data;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await api.post<string>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data;
  },

  resetPassword: async (email: string, token: string, newPassword: string): Promise<string> => {
    const { data } = await api.post<string>(ENDPOINTS.AUTH.RESET_PASSWORD, { email, token, newPassword });
    return data;
  },
};
