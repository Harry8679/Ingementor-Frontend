import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  BellIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const getDashboardLink = () => {
    switch (user?.userType) {
      case 'teacher': return '/dashboard/teacher';
      case 'student': return '/dashboard/student';
      case 'parent': return '/dashboard/parent';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={getDashboardLink()} className="flex items-center space-x-3 group">
            <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IngéMentor
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <Link 
                to="/profile"
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.userType}
                  </div>
                </div>
              </Link>

              <Link
                to="/settings"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;