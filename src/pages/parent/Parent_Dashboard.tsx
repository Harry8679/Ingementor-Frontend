import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  TicketIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET /parents/me/stats           → { totalChildren, totalLessons, totalTeachers }
//  GET /parents/me/children        → { children: [{ id, student:{...}, relationship }], total }
//  GET /parents/me/lessons/upcoming→ { lessons: [...], total }
//  GET /api/parents/me/coupons     → { data: [{ ..., status, priceClient }], total }
//  ⚠️ routes parent SANS /api, sauf coupons qui l'ont.
// ============================================================================

interface Grade {
  id: number;
  name: string;
  level?: string;
}
interface ChildStudent {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  grade: Grade | null;
}
interface ChildLink {
  id: number;
  student: ChildStudent;
  relationship: string | null;
}
interface UpcomingLesson {
  id: number;
  teacher: { id: number; fullName: string };
  student: { id: number; fullName: string };
  subject: { id: number; name: string };
  scheduledAt: string | null;
  duration: number;
}
interface ParentCoupon {
  status: string;
  priceClient: number;
}

const formatSchedule = (raw: string | null) => {
  if (!raw) return { date: '—', time: '' };
  const d = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return { date: raw, time: '' };
  return {
    date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
};

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ totalChildren: 0, totalLessons: 0, totalTeachers: 0 });
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [lessons, setLessons] = useState<UpcomingLesson[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState(0);
  const [couponValue, setCouponValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, c, l, cp] = await Promise.allSettled([
        api.get('/parents/me/stats'),
        api.get('/parents/me/children'),
        api.get('/parents/me/lessons/upcoming'),
        api.get('/api/parents/me/coupons'),
      ]);

      if (s.status === 'fulfilled') {
        setStats({
          totalChildren: s.value.data?.totalChildren ?? 0,
          totalLessons: s.value.data?.totalLessons ?? 0,
          totalTeachers: s.value.data?.totalTeachers ?? 0,
        });
      }
      if (c.status === 'fulfilled') {
        setChildren(c.value.data?.children ?? []);
      }
      if (l.status === 'fulfilled') {
        setLessons(l.value.data?.lessons ?? []);
      }
      if (cp.status === 'fulfilled') {
        const list: ParentCoupon[] = cp.value.data?.data ?? [];
        const avail = list.filter((x) => x.status === 'available');
        setAvailableCoupons(avail.length);
        setCouponValue(avail.reduce((sum, x) => sum + (Number(x.priceClient) || 0), 0));
      }
    } catch (error) {
      console.error('Erreur dashboard parent:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Dashboard Parent 👨‍👩‍👧‍👦</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">Suivez la scolarité de vos enfants</p>
              </div>
              <Button onClick={() => navigate('/dashboard/parent/children')}>Mes enfants</Button>
            </div>

            {/* Stats — réelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Enfants suivis</p>
                    <p className="text-4xl font-black text-gray-900">{stats.totalChildren}</p>
                  </div>
                  <div className="bg-linear-to-br from-pink-500 to-rose-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Professeurs</p>
                    <p className="text-4xl font-black text-gray-900">{stats.totalTeachers}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours planifiés</p>
                    <p className="text-4xl font-black text-gray-900">{stats.totalLessons}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Coupons dispo.</p>
                    <p className="text-4xl font-black text-gray-900">{availableCoupons}</p>
                    <p className="text-xs text-rose-600 font-bold mt-2">{couponValue.toFixed(2)} € de crédit</p>
                  </div>
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <TicketIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Mes enfants — vrais */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                  <UserGroupIcon className="h-7 w-7 mr-3 text-pink-600" />Mes enfants
                </h2>
                <Button variant="secondary" onClick={() => navigate('/dashboard/parent/children')}>
                  Voir détails
                </Button>
              </div>

              {children.length === 0 ? (
                <div className="py-10 text-center">
                  <UserGroupIcon className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                  <p className="font-bold text-gray-500">Aucun enfant enregistré</p>
                  <button
                    onClick={() => navigate('/dashboard/parent/children')}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all"
                  >
                    Ajouter un enfant
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((link) => {
                    const child = link.student;
                    return (
                      <div
                        key={link.id}
                        className="p-4 bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-100 hover:border-pink-300 transition-all cursor-pointer"
                        onClick={() => navigate('/dashboard/parent/children')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-white">
                              {child.firstName?.[0]?.toUpperCase() ?? '?'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-gray-900 truncate">{child.fullName}</h3>
                            {child.grade ? (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                                <AcademicCapIcon className="h-3 w-3" />
                                {child.grade.name}
                              </span>
                            ) : (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                                Classe non renseignée
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Prochains cours — vrais */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                  <CalendarIcon className="h-7 w-7 mr-3 text-blue-600" />
                  Prochains cours ({lessons.length})
                </h2>
                <Button variant="secondary" onClick={() => navigate('/dashboard/parent/lessons')}>
                  Voir tout
                </Button>
              </div>

              {lessons.length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                  <p className="font-bold text-gray-500">Aucun cours planifié</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.slice(0, 5).map((lesson) => {
                    const when = formatSchedule(lesson.scheduledAt);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-3 rounded-xl shrink-0">
                            <BookOpenIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-black text-gray-900 truncate">
                              {lesson.subject?.name ?? '—'}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium truncate">
                              {lesson.student?.fullName ?? '—'} • {lesson.teacher?.fullName ?? '—'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-gray-700">
                            <ClockIcon className="h-4 w-4" />
                            {when.date}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {when.time} ({lesson.duration} min)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default ParentDashboard;