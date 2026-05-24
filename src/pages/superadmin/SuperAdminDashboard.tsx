import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  UserCircle,
  Ticket,
//   TrendingUp,
  ArrowRight,
  AlertCircle,
//   CheckCircle2,
//   Clock,
  DollarSign,
//   Link2,
//   Calendar,
  ShieldCheck,
  UserCog,
//   Activity,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import api from '../../services/api';

interface DashboardStats {
  users: {
    students: number;
    teachers: number;
    parents: number;
  };
  coupons: {
    total: number;
    available: number;
    used: number;
    expired: number;
  };
  revenue: {
    total: string;
    agency_margin: string;
    total_raw: number;
    margin_raw: number;
  };
  purchases: {
    total: number;
    completed: number;
    pending: number;
  };
  lessons: {
    total: number;
  };
}

interface AdminInfo {
  id: number;
  name: string;
  email: string;
  department: string;
  lastActive: string;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock admins data (à remplacer par un appel API)
  const admins: AdminInfo[] = [
    { id: 1, name: 'Admin Principal', email: 'admin@ingementor.fr', department: 'Gestion', lastActive: 'Il y a 2h' },
    { id: 2, name: 'Marie Dupont', email: 'gestionnaire@ingementor.fr', department: 'Commercial', lastActive: 'Il y a 5h' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/dashboard');
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Élèves',
      value: stats?.users.students || 0,
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      link: '/dashboard/super-admin/students',
    },
    {
      label: 'Professeurs',
      value: stats?.users.teachers || 0,
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      link: '/dashboard/super-admin/teachers',
    },
    {
      label: 'Parents',
      value: stats?.users.parents || 0,
      icon: UserCircle,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      link: '/dashboard/super-admin/parents',
    },
    {
      label: 'Coupons actifs',
      value: stats?.coupons.available || 0,
      icon: Ticket,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      link: '/dashboard/super-admin/coupons',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Super Admin
            </h1>
            <span className="px-3 py-1 bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30">
              🔥 FULL ACCESS
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Contrôle total de la plateforme IngéMentor
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/super-admin/admins"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            <UserCog className="h-5 w-5" />
            Gérer Admins
          </Link>
          <Link
            to="/dashboard/super-admin/coupons"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-all"
          >
            <Ticket className="h-5 w-5" />
            Gérer Coupons
          </Link>
        </div>
      </div>

      {/* Super Admin Alert */}
      <div className="bg-linear-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-red-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Mode Super Administrateur</h2>
            <p className="text-white/80 mt-1">
              Vous avez un accès complet à toutes les fonctionnalités : modification des coupons, 
              remboursements, gestion des admins, et configuration des tarifs.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Modifier coupons</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Rembourser commandes</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Gérer admins</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Configurer tarifs</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Paiements profs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('purple') ? '#8b5cf6' : stat.color.includes('pink') ? '#ec4899' : '#f97316' }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600 group-hover:text-orange-700">
              Gérer
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue & Admins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenus globaux</h2>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <span className="text-gray-600">Chiffre d'affaires total</span>
              <span className="text-2xl font-bold text-green-600">{stats?.revenue.total || '0,00 €'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <span className="text-gray-600">Marge agence</span>
              <span className="text-2xl font-bold text-orange-600">{stats?.revenue.agency_margin || '0,00 €'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-gray-900">{stats?.purchases.completed || 0}</p>
                <p className="text-xs text-gray-500">Commandes payées</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats?.purchases.pending || 0}</p>
                <p className="text-xs text-gray-500">En attente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admins overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Administrateurs</h2>
            <Link
              to="/dashboard/super-admin/admins"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              Gérer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-white text-sm font-medium">
                    {admin.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{admin.name}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                    {admin.department}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{admin.lastActive}</p>
                </div>
              </div>
            ))}
            <Link
              to="/dashboard/super-admin/admins"
              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              <UserCog className="h-5 w-5" />
              Ajouter un admin
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions for SuperAdmin */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Super Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/super-admin/coupons"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-colors border border-red-100"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Ticket className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Modifier Coupons</p>
              <p className="text-sm text-gray-500">Annuler, éditer</p>
            </div>
          </Link>
          <Link
            to="/dashboard/super-admin/purchases"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-colors border border-purple-100"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Remboursements</p>
              <p className="text-sm text-gray-500">Gérer commandes</p>
            </div>
          </Link>
          <Link
            to="/dashboard/super-admin/pricing"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-100"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Tarifs</p>
              <p className="text-sm text-gray-500">Modifier grille</p>
            </div>
          </Link>
          <Link
            to="/dashboard/super-admin/payouts"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-100"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Paiements Profs</p>
              <p className="text-sm text-gray-500">Valider virements</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Alerts / Warnings */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">Alertes système</h3>
            <ul className="mt-2 space-y-1 text-sm text-yellow-700">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                {stats?.coupons.expired || 0} coupon(s) expiré(s) ce mois
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                {stats?.purchases.pending || 0} commande(s) en attente de validation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}