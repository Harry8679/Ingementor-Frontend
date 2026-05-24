// src/components/DashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface UserWithRoles {
  roles?: string[];
  userType?: string;
}

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  console.log('🔍 User:', user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const userWithRoles = user as UserWithRoles;
  const roles: string[] = userWithRoles.roles || [];

  // Ordre de priorité : SuperAdmin > Admin > Teacher > Parent > Student
  if (roles.includes('ROLE_SUPER_ADMIN')) {
    return <Navigate to="/dashboard/super-admin" replace />;
  }

  if (roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (roles.includes('ROLE_TEACHER')) {
    return <Navigate to="/dashboard/teacher" replace />;
  }
  
  if (roles.includes('ROLE_PARENT')) {
    return <Navigate to="/dashboard/parent" replace />;
  }
  
  return <Navigate to="/dashboard/student" replace />;
}