import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:8002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
interface RegisterData {
  userType: 'teacher' | 'student' | 'parent';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  experience?: string;
  address?: string;
  gradeId?: number;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: any;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}

// API Functions
export const authAPI = {
  register: (data: RegisterData) =>
    api.post<RegisterResponse>('/register', data),
  
  login: (data: LoginData) =>
    api.post<LoginResponse>('/login', data),
  
  me: () =>
    api.get('/me'),
};

export const teachersAPI = {
  getAll: (params?: any) =>
    api.get('/teachers', { params }),
  
  getById: (id: number) =>
    api.get(`/teachers/${id}`),
};

export const gradesAPI = {
  getAll: () =>
    api.get('/grades'),
};

export const subjectsAPI = {
  getAll: () =>
    api.get('/subjects'),
};

export default api;