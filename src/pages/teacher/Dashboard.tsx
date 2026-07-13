import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  TicketIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  Sources de données (formats confirmés)
//  GET /api/teachers/me/stats            → { totalStudents, totalLessons, upcomingLessons, totalSubjects, rating, isVerified }
//  GET /lessons/me/upcoming              → { lessons: [...], total }
//  GET /api/teachers/me/coupons/validated → { data: [...] }
//  GET /api/teachers/me/earnings          → montant à percevoir
// ============================================================================

interface TeacherStats {
  totalStudents: number;
  totalLessons: number;
  upcomingLessons: number;
  totalSubjects: number;
  rating: number | null;
  isVerified: boolean;
}

interface UpcomingLesson {
  id: number;
  teacher: { id: number; fullName: string };
  student: { id: number; fullName: string };
  subject: { id: number; name: string };
  scheduledAt: string | null;
  duration: number;
  price: number;
}

type NameOrObject = string | { id?: number; name?: string } | null | undefined;

interface ValidatedCoupon {
  id: number;
  code: string;
  student?: NameOrObject;
  subject?: NameOrObject;
  price_teacher?: number | string;
}

/** Rend une valeur affichable qu'elle soit une chaîne ou un objet {id, name}. */
const label = (value: NameOrObject): string => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.name) return String(value.name);
  return '—';
};

const num = (value: number | string | undefined | null): number => {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/** "2026-07-15 14:00" → { date: "15/07/2026", time: "14:00", isToday: bool } */
const formatSchedule = (raw: string | null) => {
  if (!raw) return { date: '—', time: '', isToday: false };
  const d = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return { date: raw, time: '', isToday: false };

  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return {
    date: isToday
      ? "Aujourd'hui"
      : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    isToday,
  };
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalLessons: 0,
    upcomingLessons: 0,
    totalSubjects: 0,
    rating: null,
    isVerified: false,
  });
  const [lessons, setLessons] = useState<UpcomingLesson[]>([]);
  const [validated, setValidated] = useState<ValidatedCoupon[]>([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Promise.allSettled : une API en erreur ne casse pas tout le dashboard
      const [s, l, c, e] = await Promise.allSettled([
        api.get('/api/teachers/me/stats'),
        api.get('/lessons/me/upcoming'),
        api.get('/api/teachers/me/coupons/validated'),
        api.get('/api/teachers/me/earnings'),
      ]);

      if (s.status === 'fulfilled') {
        setStats(s.value.data);
      }

      if (l.status === 'fulfilled') {
        setLessons(l.value.data?.lessons ?? []);
      }

      if (c.status === 'fulfilled') {
        const list = c.value.data?.data ?? c.value.data?.coupons ?? [];
        setValidated(Array.isArray(list) ? list : []);
      }

      if (e.status === 'fulfilled') {
        const raw = e.value.data?.data ?? e.value.data ?? {};
        const total =
          raw?.total_to_pay ?? raw?.pending ?? raw?.total ?? raw?.amount ?? 0;
        setEarnings(num(total));
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Blobs animés */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Dashboard Professeur 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Bienvenue dans votre espace enseignant
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/teacher/lessons/new')}>
                Planifier un cours
              </Button>
            </div>

            {/* Stats — que du réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Élèves */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Élèves actifs</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.totalStudents}
                    </p>
                    <p className="text-xs text-gray-500 font-bold mt-2">
                      {stats.totalSubjects} matière{stats.totalSubjects > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Cours */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours donnés</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.totalLessons}
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-2">
                      {stats.upcomingLessons} à venir
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Heures validées (coupons) */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Heures validées</p>
                    <p className="text-4xl font-black text-gray-900">{validated.length}</p>
                    <p className="text-xs text-purple-600 font-bold mt-2">
                      1 coupon = 1 heure
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <TicketIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Revenus réels */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">À percevoir</p>
                    <p className="text-4xl font-black text-gray-900">
                      {earnings.toFixed(2)}€
                    </p>
                    <p className="text-xs text-emerald-600 font-bold mt-2">
                      Coupons validés
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl">
                    <CurrencyEuroIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prochains cours */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center">
                    <CalendarIcon className="h-7 w-7 mr-3 text-blue-600" />
                    Prochains cours ({lessons.length})
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard/teacher/lessons')}
                  >
                    Voir tout
                  </Button>
                </div>

                {lessons.length === 0 ? (
                  <div className="py-12 text-center">
                    <CalendarIcon className="mx-auto mb-4 h-14 w-14 text-gray-200" />
                    <p className="font-bold text-gray-500">Aucun cours planifié</p>
                    <button
                      onClick={() => navigate('/dashboard/teacher/lessons/new')}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Planifier un cours
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.slice(0, 4).map((lesson) => {
                      const when = formatSchedule(lesson.scheduledAt);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => navigate(`/dashboard/teacher/lessons/${lesson.id}`)}
                          className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
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
                                avec {lesson.student?.fullName ?? '—'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-gray-700">
                              <ClockIcon className="h-4 w-4" />
                              {when.time}
                            </div>
                            <p
                              className={`text-xs mt-1 font-bold ${
                                when.isToday ? 'text-blue-600' : 'text-gray-500'
                              }`}
                            >
                              {when.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Derniers coupons validés */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center">
                    <CheckCircleIcon className="h-7 w-7 mr-3 text-emerald-600" />
                    Coupons validés ({validated.length})
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard/teacher/coupons')}
                  >
                    Voir tout
                  </Button>
                </div>

                {validated.length === 0 ? (
                  <div className="py-12 text-center">
                    <TicketIcon className="mx-auto mb-4 h-14 w-14 text-gray-200" />
                    <p className="font-bold text-gray-500">Aucun coupon validé</p>
                    <button
                      onClick={() => navigate('/dashboard/teacher/coupons')}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
                    >
                      <TicketIcon className="h-5 w-5" />
                      Valider un coupon
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {validated.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="bg-linear-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shrink-0">
                            <TicketIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono font-black text-gray-900 truncate">
                              {c.code}
                            </p>
                            <p className="text-xs text-gray-600 font-bold truncate">
                              {label(c.student)}
                              {c.subject ? ` · ${label(c.subject)}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-emerald-600 shrink-0 ml-3">
                          {num(c.price_teacher).toFixed(2)}€
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Dashboard;