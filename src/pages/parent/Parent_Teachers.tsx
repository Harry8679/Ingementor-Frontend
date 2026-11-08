import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon,
  StarIcon,
  BookOpenIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET /parents/me/teachers/all  (sans /api)
//  { teachers: [{ id, fullName, email, phone, rating, isVerified,
//                 teachingTo: [{ id, fullName, subject }] }], total }
// ============================================================================

interface TeachingTo {
  id: number;
  fullName: string;
  subject: string;
}
interface ParentTeacher {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  rating: number | null;
  isVerified: boolean;
  teachingTo: TeachingTo[];
}

const ParentTeachers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<ParentTeacher[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/parents/me/teachers/all');
      setTeachers(res.data?.teachers ?? []);
    } catch (err) {
      console.error('Erreur chargement professeurs:', err);
      setError('Impossible de charger les professeurs.');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Nombre de matières distinctes enseignées à mes enfants
  const subjectCount = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => t.teachingTo.forEach((s) => set.add(s.subject)));
    return set.size;
  }, [teachers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.teachingTo.some((s) => s.subject.toLowerCase().includes(q)),
    );
  }, [teachers, search]);

  const initials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Les Professeurs 👩‍🏫</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Les enseignants qui suivent vos enfants
                </p>
              </div>
              <button
                onClick={loadTeachers}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Actualiser
              </button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700">{error}</p>
                  <button
                    onClick={loadTeachers}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-pink-500 to-rose-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Professeurs</p>
                    <p className="text-3xl font-black text-gray-900">{teachers.length}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Matières suivies</p>
                    <p className="text-3xl font-black text-gray-900">{subjectCount}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recherche */}
            <Card>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou matière..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-pink-500 focus:outline-none transition-all"
                />
              </div>
            </Card>

            {/* Liste */}
            {filtered.length === 0 ? (
              <Card>
                <div className="py-16 text-center">
                  <AcademicCapIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">
                    {teachers.length === 0
                      ? 'Aucun professeur pour le moment'
                      : 'Aucun professeur ne correspond à la recherche'}
                  </p>
                  {teachers.length === 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      Les professeurs apparaîtront ici une fois vos enfants rattachés à un enseignant.
                    </p>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((t) => (
                  <Card key={t.id}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-rose-500 text-xl font-black text-white">
                        {initials(t.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-black text-gray-900 truncate">{t.fullName}</h3>
                          {t.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                              <CheckBadgeIcon className="h-3.5 w-3.5" />
                              Vérifié
                            </span>
                          )}
                        </div>

                        {t.rating !== null && t.rating > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-yellow-600">
                            <StarIcon className="h-4 w-4" />
                            {t.rating.toFixed(1)}/5
                          </div>
                        )}

                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 font-medium truncate">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="truncate">{t.email}</span>
                          </div>
                          {t.phone && (
                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                              <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0" />
                              {t.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enfants suivis par ce prof */}
                    {t.teachingTo.length > 0 && (
                      <div className="mt-4 border-t-2 border-gray-100 pt-4">
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                          <UserGroupIcon className="h-4 w-4" />
                          Suit vos enfants
                        </p>
                        <div className="space-y-1.5">
                          {t.teachingTo.map((s, i) => (
                            <div
                              key={`${s.id}-${i}`}
                              className="flex items-center justify-between rounded-xl bg-linear-to-r from-pink-50 to-rose-50 px-3 py-2"
                            >
                              <span className="text-sm font-bold text-gray-900 truncate">{s.fullName}</span>
                              <span className="ml-2 shrink-0 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                                {s.subject}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
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

export default ParentTeachers;