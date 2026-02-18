import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  BookOpenIcon, 
  CalendarIcon,
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ClockIcon, 
  Cog6ToothIcon, 
  AcademicCapIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Détection automatique du rôle depuis l'URL
  const userRole = location.pathname.includes('/teacher') 
    ? 'teacher' 
    : location.pathname.includes('/parent')
    ? 'parent'
    : 'student';

  // Liens pour les enseignants (9 liens)
  const teacherLinks = [
    { to: '/dashboard/teacher', icon: HomeIcon, label: 'Dashboard' },
    { to: '/dashboard/teacher/profile', icon: UserIcon, label: 'Profil' },
    { to: '/dashboard/teacher/students', icon: UserGroupIcon, label: 'Mes élèves' },
    { to: '/dashboard/teacher/subjects', icon: BookOpenIcon, label: 'Matières' },
    { to: '/dashboard/teacher/availability', icon: ClockIcon, label: 'Disponibilités' },
    { to: '/dashboard/teacher/lessons', icon: CalendarIcon, label: 'Cours' },
    { to: '/dashboard/teacher/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/dashboard/teacher/statistics', icon: ChartBarIcon, label: 'Statistiques' },
    { to: '/dashboard/teacher/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
  ];

  // Liens pour les élèves (9 liens)
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

  // Liens pour les parents (8 liens)
  const parentLinks = [
    { to: '/dashboard/parent', icon: HomeIcon, label: 'Dashboard' },
    { to: '/dashboard/parent/children', icon: UserGroupIcon, label: 'Mes enfants' },
    { to: '/dashboard/parent/grades', icon: AcademicCapIcon, label: 'Notes' },
    { to: '/dashboard/parent/lessons', icon: CalendarIcon, label: 'Cours' },
    { to: '/dashboard/parent/teachers', icon: UserIcon, label: 'Professeurs' },
    { to: '/dashboard/parent/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/dashboard/parent/payments', icon: CurrencyDollarIcon, label: 'Paiements' },
    { to: '/dashboard/parent/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
  ];

  // Retourne les liens appropriés selon le rôle
  const getLinks = () => {
    switch (userRole) {
      case 'teacher': 
        return teacherLinks;
      case 'parent': 
        return parentLinks;
      case 'student': 
        return studentLinks;
      default: 
        return studentLinks;
    }
  };

  // Retourne les classes CSS pour le lien actif selon le rôle
  const getActiveClasses = () => {
    if (userRole === 'teacher') {
      return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg';
    } else if (userRole === 'parent') {
      return 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg';
    } else {
      return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg';
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
                  ? getActiveClasses()
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