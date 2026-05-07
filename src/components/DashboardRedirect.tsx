// src/components/DashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();

    // DEBUG - À supprimer après
  console.log('🔍 User:', user);
  console.log('🔍 userType:', user?.userType);

  // Si pas connecté, redirige vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  // Redirige selon le userType
  switch (user.userType) {
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'parent':
      return <Navigate to="/dashboard/parent" replace />;
    case 'student':
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
}