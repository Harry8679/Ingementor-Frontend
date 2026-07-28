import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  CalendarIcon,
  BookOpenIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET /lessons/me?status=...  → { lessons: [...], total }
//  Cours : { id, teacher{fullName}, student{fullName}, subject{name},
//            scheduledAt ("Y-m-d H:i"), duration, status, price, notes }
//  status : SCHEDULED | COMPLETED | CANCELLED
//  DELETE /lessons/{id}  → annuler
// ============================================================================

interface Lesson {
  id: number;
  teacher: { id: number; fullName: string };
  student: { id: number; fullName: string };
  subject: { id: number; name: string };
  scheduledAt: string | null;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string;
  price: number;
  notes: string | null;
}

type Filter = 'all' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

const statusConfig: Record<
  string,
  { label: string; badge: string; icon: typeof CheckCircleIcon }
> = {
  SCHEDULED: { label: 'Programmé', badge: 'bg-blue-100 text-blue-700', icon: CalendarIcon },
  COMPLETED: { label: 'Terminé', badge: 'bg-green-100 text-green-700', icon: CheckCircleIcon },
  CANCELLED: { label: 'Annulé', badge: 'bg-red-100 text-red-700', icon: XCircleIcon },
};

// "2026-02-05 14:00" → { date: "05/02/2026", time: "14:00" }
const formatSchedule = (raw: string | null) => {
  if (!raw) return { date: '—', time: '' };
  const d = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return { date: raw, time: '' };
  return {
    date: d.toLocaleDateString('fr-FR'),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
};

const TeacherLessons: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/lessons/me');
      const list = res.data?.lessons ?? [];
      setLessons(Array.isArray(list) ? list : []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos cours.'
        : 'Impossible de charger vos cours.';
      setError(msg);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      upcoming: lessons.filter((l) => l.status === 'SCHEDULED').length,
      completed: lessons.filter((l) => l.status === 'COMPLETED').length,
      cancelled: lessons.filter((l) => l.status === 'CANCELLED').length,
    }),
    [lessons],
  );

  const filtered = useMemo(
    () => (filter === 'all' ? lessons : lessons.filter((l) => l.status === filter)),
    [lessons, filter],
  );

  const handleCancel = async (id: number) => {
    if (!window.confirm('Annuler ce cours ?')) return;
    setCancellingId(id);
    try {
      await api.delete(`/lessons/${id}`);
      loadLessons();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erreur lors de l'annulation"
        : "Erreur lors de l'annulation";
      alert(msg);
    } finally {
      setCancellingId(null);
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Cours 📅</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Planning et historique des cours
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/teacher/lessons/new')}>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                Planifier un cours
              </Button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700">{error}</p>
                  <button
                    onClick={loadLessons}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">À venir</p>
                    <p className="text-3xl font-black text-gray-900">{stats.upcoming}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Complétés</p>
                    <p className="text-3xl font-black text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-red-500 to-pink-500 p-4 rounded-2xl">
                    <XCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Annulés</p>
                    <p className="text-3xl font-black text-gray-900">{stats.cancelled}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              {([
                ['all', 'Tous'],
                ['SCHEDULED', 'Programmé'],
                ['COMPLETED', 'Terminé'],
                ['CANCELLED', 'Annulé'],
              ] as [Filter, string][]).map(([value, txt]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-colors ${
                    filter === value
                      ? 'bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Liste des cours */}
            {filtered.length === 0 ? (
              <Card>
                <div className="py-16 text-center">
                  <CalendarIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">
                    {lessons.length === 0
                      ? 'Aucun cours planifié'
                      : 'Aucun cours dans cette catégorie'}
                  </p>
                  {lessons.length === 0 && (
                    <button
                      onClick={() => navigate('/dashboard/teacher/lessons/new')}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Planifier un cours
                    </button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filtered.map((lesson) => {
                  const cfg = statusConfig[lesson.status] ?? {
                    label: lesson.status,
                    badge: 'bg-gray-100 text-gray-600',
                    icon: CalendarIcon,
                  };
                  const StatusIcon = cfg.icon;
                  const when = formatSchedule(lesson.scheduledAt);

                  return (
                    <Card key={lesson.id}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl shrink-0">
                          <BookOpenIcon className="h-7 w-7 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black text-gray-900">
                            {lesson.subject?.name ?? '—'}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-1.5">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              {lesson.student?.fullName ?? '—'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {when.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              {when.time} ({lesson.duration}min)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                          </span>

                          {lesson.status === 'SCHEDULED' && (
                            <button
                              onClick={() => handleCancel(lesson.id)}
                              disabled={cancellingId === lesson.id}
                              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                              title="Annuler ce cours"
                            >
                              {cancellingId === lesson.id ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <TrashIcon className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {lesson.notes && (
                        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 font-medium">
                          {lesson.notes}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
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

export default TeacherLessons;