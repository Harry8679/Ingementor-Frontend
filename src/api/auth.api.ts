import api from './index';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/common.types';
import type { AxiosResponse } from 'axios';

export const authAPI = {
  /**
   * Connexion d'un utilisateur
   */
  // login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
  //   api.post<AuthResponse>('/login', data),
  login: async (data: LoginRequest): Promise<AxiosResponse> => {
    const response = await api.post('/login', data);
    
    // ✅ AJOUT : Sauvegarder le token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Inscription (teacher, student ou parent)
   */
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post<AuthResponse>('/register', data),

  /**
   * Récupérer l'utilisateur connecté
   */
  me: (): Promise<AxiosResponse<AuthResponse>> =>
    api.get<AuthResponse>('/api/users/me'),

  /**
   * Mise à jour du profil utilisateur
   */
  updateProfile: (
    data: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      bio?: string;
      experience?: string;
      address?: string;
      hourlyRate?: number;
    }>
  ): Promise<AxiosResponse<AuthResponse>> =>
    api.patch<AuthResponse>('/api/users/me', data),
};