import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    isTeacher: user?.userType === 'teacher',
    isStudent: user?.userType === 'student',
    isParent: user?.userType === 'parent',
  };
};