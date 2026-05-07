// src/components/DashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  
  // Si pas connecté, redirige vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }
  
  // Redirige selon le rôle
  switch (user.role) {
    case 'teacher':
    case 'ROLE_TEACHER':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'parent':
    case 'ROLE_PARENT':
      return <Navigate to="/dashboard/parent" replace />;
    case 'student':
    case 'ROLE_STUDENT':
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
}