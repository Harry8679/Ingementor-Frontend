// src/components/DashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  console.log('🔍 User:', user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  // Utilise roles (qui est correct) au lieu de userType
  const roles: string[] = (user as any).roles || [];

  if (roles.includes('ROLE_TEACHER')) {
    return <Navigate to="/dashboard/teacher" replace />;
  }
  
  if (roles.includes('ROLE_PARENT')) {
    return <Navigate to="/dashboard/parent" replace />;
  }
  
  // Par défaut : student
  return <Navigate to="/dashboard/student" replace />;
}