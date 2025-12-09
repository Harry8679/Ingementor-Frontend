import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://127.0.0.1:8002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur → ajouter automatiquement le token JWT
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur → si token expiré → logout automatique
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;