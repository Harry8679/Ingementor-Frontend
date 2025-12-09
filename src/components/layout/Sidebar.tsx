import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, UserIcon, BookOpenIcon, CalendarIcon,
  ChatBubbleLeftRightIcon, ChartBarIcon, UserGroupIcon,
  ClockIcon, Cog6ToothIcon, AcademicCapIcon 
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const teacherLinks = [
    { to: '/dashboard/teacher', icon: HomeIcon, label: 'Dashboard' },
    { to: '/dashboard/teacher/profile', icon: UserIcon, label: 'Profil' },
    { to: '/dashboard/teacher/students', icon: UserGroupIcon, label: 'Mes élèves' },
    { to: '/dashboard/teacher/subjects', icon: BookOpenIcon, label: 'Matières' },
    { to: '/dashboard/teacher/availability', icon: ClockIcon, label: 'Disponibilités' },
    { to: '/dashboard/teacher/lessons', icon: CalendarIcon, label: 'Cours' },
    { to: '/dashboard/teacher/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/dashboard/teacher/stats', icon: ChartBarIcon, label: 'Statistiques' },
    { to: '/dashboard/teacher/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
  ];

  const studentLinks = [
    { to: '/dashboard/student', icon: HomeIcon, label: 'Dashboard' },
    { to: '/dashboard/student/profile', icon: UserIcon, label: 'Profil' },
    { to: '/dashboard/student/teachers', icon: UserGroupIcon, label: 'Mes profs' },
    { to: '/dashboard/student/subjects', icon: BookOpenIcon, label: 'Matières' },
    { to: '/dashboard/student/grades', icon: AcademicCapIcon, label: 'Notes' },
    { to: '/dashboard/student/progress', icon: ChartBarIcon, label: 'Progression' },
    { to: '/dashboard/student/lessons', icon: CalendarIcon, label: 'Cours' },
    { to: '/dashboard/student/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/dashboard/student/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
  ];

  const parentLinks = [
    { to: '/dashboard/parent', icon: HomeIcon, label: 'Dashboard' },
    { to: '/dashboard/parent/profile', icon: UserIcon, label: 'Profil' },
    { to: '/dashboard/parent/children', icon: UserGroupIcon, label: 'Mes enfants' },
    { to: '/dashboard/parent/lessons', icon: CalendarIcon, label: 'Tous les cours' },
    { to: '/dashboard/parent/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/dashboard/parent/stats', icon: ChartBarIcon, label: 'Statistiques' },
    { to: '/dashboard/parent/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
  ];

  const getLinks = () => {
    switch (user?.userType) {
      case 'teacher': return teacherLinks;
      case 'student': return studentLinks;
      case 'parent': return parentLinks;
      default: return [];
    }
  };

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 min-h-screen sticky top-20">
      <nav className="p-4 space-y-2">
        {getLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;