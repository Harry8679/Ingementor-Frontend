import api from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authAPI = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/login_check', data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/api/register', data),

  me: () =>
    api.get<AuthResponse>('/api/users/me'),
};
