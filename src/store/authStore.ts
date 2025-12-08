import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  roles: string[];
  userType: 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';
  bio?: string;
  experience?: string;
  isVerified?: boolean;
  rating?: string;
  grade?: {
    id: number;
    name: string;
    level: string;
  };
  address?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
      updateUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);