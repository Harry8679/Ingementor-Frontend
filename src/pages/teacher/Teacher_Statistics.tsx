import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  // ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyEuroIcon,
  TicketIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  Sources réelles :
//  /api/teachers/me/stats             → { totalStudents, totalLessons, ... }
//  /api/teachers/me/earnings          → montant à percevoir
//  /api/teachers/me/coupons/validated → coupons validés (pour répartition matières)
// ============================================================================

interface TeacherStats {
  totalStudents: number;
  totalLessons: number;
  upcomingLessons: number;
  totalSubjects: number;
  rating: number | null;
  isVerified: boolean;
}

type NameOrObject = string | { id?: number; name?: string } | null | undefined;

interface ValidatedCoupon {
  id: number;
  code: string;
  student?: NameOrObject;
  subject?: NameOrObject;
  price_teacher?: number | string;
}

const label = (value: NameOrObject): string => {
  if (!value) return 'Non précisé';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.name) return String(value.name);
  return 'Non précisé';
};

const num = (value: number | string | undefined | null): number => {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const TeacherStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalLessons: 0,
    upcomingLessons: 0,
    totalSubjects: 0,
    rating: null,
    isVerified: false,
  });
  const [earnings, setEarnings] = useState(0);
  const [validated, setValidated] = useState<ValidatedCoupon[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, e, c] = await Promise.allSettled([
        api.get('/api/teachers/me/stats'),
        api.get('/api/teachers/me/earnings'),
        api.get('/api/teachers/me/coupons/validated'),
      ]);

      if (s.status === 'fulfilled') setStats(s.value.data);
      if (e.status === 'fulfilled') {
        const raw = e.value.data?.data ?? e.value.data ?? {};
        const total =
          raw?.total_to_pay ?? raw?.pending ?? raw?.total ?? raw?.amount ?? 0;
        setEarnings(num(total));
      }
      if (c.status === 'fulfilled') {
        const list = c.value.data?.data ?? c.value.data?.coupons ?? [];
        setValidated(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    } finally {
      setLoading(false);
    }
  };

  // Répartition des coupons validés par matière
  const bySubject = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    validated.forEach((c) => {
      const key = label(c.subject);
      const cur = map.get(key) ?? { count: 0, total: 0 };
      cur.count += 1;
      cur.total += num(c.price_teacher);
      map.set(key, cur);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [validated]);

  // Répartition par élève
  const byStudent = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    validated.forEach((c) => {
      const key = label(c.student);
      const cur = map.get(key) ?? { count: 0, total: 0 };
      cur.count += 1;
      cur.total += num(c.price_teacher);
      map.set(key, cur);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [validated]);

  const maxSubjectCount = Math.max(1, ...bySubject.map((s) => s.count));

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">Statistiques 📊</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Vos chiffres réels sur la plateforme
              </p>
            </div>

            {/* 4 cartes réelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Élèves actifs</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

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

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Heures validées</p>
                    <p className="text-4xl font-black text-gray-900">{validated.length}</p>
                    <p className="text-xs text-purple-600 font-bold mt-2">1 coupon = 1h</p>
                  </div>
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <TicketIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">À percevoir</p>
                    <p className="text-4xl font-black text-gray-900">
                      {earnings.toFixed(2)}€
                    </p>
                    <p className="text-xs text-emerald-600 font-bold mt-2">Coupons validés</p>
                  </div>
                  <div className="bg-linear-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl">
                    <CurrencyEuroIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Deux colonnes : matières + élèves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par matière */}
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpenIcon className="h-7 w-7 text-purple-600" />
                  Heures par matière
                </h2>

                {bySubject.length === 0 ? (
                  <div className="py-10 text-center">
                    <BookOpenIcon className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                    <p className="font-bold text-gray-500">Aucune donnée</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les statistiques apparaîtront après vos premiers coupons validés.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bySubject.map((s) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">{s.name}</span>
                          <span className="text-sm font-black text-purple-600">
                            {s.count}h · {s.total.toFixed(2)}€
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-linear-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                            style={{ width: `${(s.count / maxSubjectCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Répartition par élève */}
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <UserGroupIcon className="h-7 w-7 text-blue-600" />
                  Élèves les plus suivis
                </h2>

                {byStudent.length === 0 ? (
                  <div className="py-10 text-center">
                    <UserGroupIcon className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                    <p className="font-bold text-gray-500">Aucune donnée</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les élèves apparaîtront après vos premiers coupons validés.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {byStudent.map((s, i) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between rounded-2xl bg-linear-to-r from-gray-50 to-slate-50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white ${
                              i === 0
                                ? 'bg-linear-to-br from-yellow-400 to-orange-500'
                                : i === 1
                                  ? 'bg-linear-to-br from-gray-300 to-gray-400'
                                  : 'bg-linear-to-br from-orange-300 to-orange-400'
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="font-bold text-gray-900">{s.name}</span>
                        </div>
                        <span className="text-sm font-black text-blue-600">
                          {s.count}h · {s.total.toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
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

export default TeacherStatistics;