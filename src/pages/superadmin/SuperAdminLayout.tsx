import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  Ticket,
  CreditCard,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  DollarSign,
  BarChart3,
  Shield,
  ShieldCheck,
  UserCog,
  Database,
  Activity,
} from 'lucide-react';

interface AdminUser {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: string[];
  department?: string;
  isSuperAdmin?: boolean;
}

const superAdminNavItems = [
  { name: 'Dashboard', href: '/dashboard/super-admin', icon: LayoutDashboard },
  { name: 'Gestion Admins', href: '/dashboard/super-admin/admins', icon: UserCog, superOnly: true },
  { name: 'Associations', href: '/dashboard/super-admin/associations', icon: Link2 },
  { name: 'Coupons', href: '/dashboard/super-admin/coupons', icon: Ticket },
  { name: 'Commandes', href: '/dashboard/super-admin/purchases', icon: CreditCard },
  { name: 'Professeurs', href: '/dashboard/super-admin/teachers', icon: Users },
  { name: 'Élèves', href: '/dashboard/super-admin/students', icon: GraduationCap },
  { name: 'Parents', href: '/dashboard/super-admin/parents', icon: UserCircle },
  { name: 'Tarifs', href: '/dashboard/super-admin/pricing', icon: DollarSign },
  { name: 'Paiements Profs', href: '/dashboard/super-admin/payouts', icon: CreditCard, superOnly: true },
  { name: 'Statistiques', href: '/dashboard/super-admin/stats', icon: BarChart3 },
  { name: 'Activité', href: '/dashboard/super-admin/activity', icon: Activity, superOnly: true },
  { name: 'Paramètres', href: '/dashboard/super-admin/settings', icon: Settings },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const adminUser = user as AdminUser | null;

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <Link to="/dashboard/super-admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              IngéMentor
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            Super Admin
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {superAdminNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.name}
                    {item.superOnly && (
                      <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                      }`}>
                        SA
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Database info */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
            <Database className="h-4 w-4 text-gray-400" />
            <div className="text-xs">
              <p className="font-medium text-gray-700">Base de données</p>
              <p className="text-gray-500">ingementor_prod</p>
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md px-4 shadow-sm lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex-1 lg:flex-none">
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              <span>Mode Super Admin</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Accès complet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-red-500/30">
                  {adminUser?.firstName?.[0]}{adminUser?.lastName?.[0]}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{adminUser?.fullName || 'Super Admin'}</p>
                  <p className="text-xs text-red-500 font-medium">Super Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold">
                          {adminUser?.firstName?.[0]}{adminUser?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{adminUser?.fullName || 'Super Admin'}</p>
                          <p className="text-xs text-gray-500">{adminUser?.email || ''}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="h-3 w-3 text-red-500" />
                            <span className="text-xs font-medium text-red-500">Super Admin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard/super-admin/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </Link>
                      <Link
                        to="/dashboard/super-admin/activity"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Activity className="h-4 w-4" />
                        Journal d'activité
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}