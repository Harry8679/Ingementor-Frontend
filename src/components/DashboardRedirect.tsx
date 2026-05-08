// src/components/DashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Type étendu pour inclure roles
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

  // Cast vers le type avec roles
  const userWithRoles = user as UserWithRoles;
  const roles: string[] = userWithRoles.roles || [];

  if (roles.includes('ROLE_TEACHER')) {
    return <Navigate to="/dashboard/teacher" replace />;
  }
  
  if (roles.includes('ROLE_PARENT')) {
    return <Navigate to="/dashboard/parent" replace />;
  }
  
  // Par défaut : student
  return <Navigate to="/dashboard/student" replace />;
}