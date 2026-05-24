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
  Link2,
  Calendar,
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

interface ActivityData {
  recent_coupons: Array<{
    id: number;
    code: string;
    status: string;
    parent: string;
    created_at: string;
  }>;
  recent_purchases: Array<{
    id: number;
    reference: string;
    amount: string;
    status: string;
    parent: string;
    created_at: string;
  }>;
  recent_students: Array<{
    id: number;
    name: string;
    email: string;
    grade: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          api.get('/api/admin/dashboard'),
          api.get('/api/admin/activity'),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent" />
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
      link: '/dashboard/admin/students',
    },
    {
      label: 'Professeurs',
      value: stats?.users.teachers || 0,
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      link: '/dashboard/admin/teachers',
    },
    {
      label: 'Parents',
      value: stats?.users.parents || 0,
      icon: UserCircle,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      link: '/dashboard/admin/parents',
    },
    {
      label: 'Coupons actifs',
      value: stats?.coupons.available || 0,
      icon: Ticket,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-50',
      link: '/dashboard/admin/coupons',
    },
  ];

  const couponStats = [
    { label: 'Total', value: stats?.coupons.total || 0, color: 'text-gray-900' },
    { label: 'Disponibles', value: stats?.coupons.available || 0, color: 'text-green-600' },
    { label: 'Utilisés', value: stats?.coupons.used || 0, color: 'text-blue-600' },
    { label: 'Expirés', value: stats?.coupons.expired || 0, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Admin 🛠️
          </h1>
          <p className="text-gray-500 mt-1">
            Vue d'ensemble de la plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/admin/coupons"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all"
          >
            <Ticket className="h-5 w-5" />
            Créer des coupons
          </Link>
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
                <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('purple') ? '#8b5cf6' : stat.color.includes('pink') ? '#ec4899' : '#06b6d4' }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-cyan-600 group-hover:text-cyan-700">
              Voir détails
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue & Coupons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenus</h2>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <span className="text-gray-600">Chiffre d'affaires</span>
              <span className="text-2xl font-bold text-green-600">{stats?.revenue.total || '0,00 €'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
              <span className="text-gray-600">Marge agence</span>
              <span className="text-2xl font-bold text-cyan-600">{stats?.revenue.agency_margin || '0,00 €'}</span>
            </div>
          </div>
        </div>

        {/* Coupons overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Coupons</h2>
            <Link
              to="/dashboard/admin/coupons"
              className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {couponStats.map((stat) => (
              <div key={stat.label} className="p-4 bg-gray-50 rounded-xl text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/admin/associations"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl hover:from-cyan-100 hover:to-teal-100 transition-colors"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Link2 className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Associations</p>
              <p className="text-sm text-gray-500">Lier élève ↔ prof</p>
            </div>
          </Link>
          <Link
            to="/dashboard/admin/coupons"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-colors"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Ticket className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Créer coupons</p>
              <p className="text-sm text-gray-500">Vente en agence</p>
            </div>
          </Link>
          <Link
            to="/dashboard/admin/pricing"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Tarifs</p>
              <p className="text-sm text-gray-500">Grille tarifaire</p>
            </div>
          </Link>
          <Link
            to="/dashboard/admin/purchases"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Commandes</p>
              <p className="text-sm text-gray-500">Historique achats</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent coupons */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Derniers coupons</h2>
            <Link
              to="/dashboard/admin/coupons"
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {activity?.recent_coupons?.length ? (
              activity.recent_coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Ticket className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{coupon.code}</p>
                      <p className="text-xs text-gray-500">{coupon.parent}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coupon.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                    coupon.status === 'Utilisé' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {coupon.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun coupon récent</p>
            )}
          </div>
        </div>

        {/* Recent students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nouveaux élèves</h2>
            <Link
              to="/dashboard/admin/students"
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {activity?.recent_students?.length ? (
              activity.recent_students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-medium">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  {student.grade && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {student.grade}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun élève récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}