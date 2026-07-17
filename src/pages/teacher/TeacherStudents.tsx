import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BookOpenIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET /api/teachers/me/students
//  { id (relation), studentId, firstName, lastName, fullName, email, phone,
//    grade: {id,name,level}|null, subject: {id,name}, status, startDate, notes }
// ============================================================================

interface TeacherStudent {
  id: number;
  studentId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  grade: { id: number; name: string; level: string } | null;
  subject: { id: number; name: string } | null;
  status: string;
  startDate: string | null;
  notes: string | null;
}

const TeacherStudents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/teachers/me/students');
      // Tolérant : { data: [...] } | { students: [...] } | [...]
      const raw = res.data?.data ?? res.data?.students ?? res.data;
      setStudents(Array.isArray(raw) ? raw : []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos élèves.'
        : 'Impossible de charger vos élèves.';
      setError(msg);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Nombre de matières distinctes enseignées
  const subjectCount = useMemo(() => {
    const set = new Set(students.map((s) => s.subject?.id).filter(Boolean));
    return set.size;
  }, [students]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.subject?.name?.toLowerCase().includes(term),
    );
  }, [students, searchTerm]);

  const initials = (s: TeacherStudent) =>
    `${s.firstName?.[0] ?? ''}${s.lastName?.[0] ?? ''}`.toUpperCase() || '?';

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
                <h1 className="text-5xl font-black text-gray-900">Mes Élèves 👥</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Les élèves qui vous sont rattachés
                </p>
              </div>
              <button
                onClick={loadStudents}
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
                    onClick={loadStudents}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stats — que du réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total élèves actifs</p>
                    <p className="text-3xl font-black text-gray-900">{students.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Matières enseignées</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </Card>

            {/* Liste des élèves */}
            {filtered.length === 0 ? (
              <Card>
                <div className="py-16 text-center">
                  <UserGroupIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">
                    {students.length === 0
                      ? 'Aucun élève rattaché'
                      : 'Aucun élève ne correspond à la recherche'}
                  </p>
                  {students.length === 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      Les élèves apparaîtront ici une fois rattachés à votre compte.
                    </p>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((s) => (
                  <Card key={s.id}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 text-lg font-black text-white">
                        {initials(s)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-gray-900 truncate">
                          {s.fullName?.trim() || s.email}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.grade && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                              <AcademicCapIcon className="h-3 w-3" />
                              {s.grade.name}
                            </span>
                          )}
                          {s.subject && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                              <BookOpenIcon className="h-3 w-3" />
                              {s.subject.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t-2 border-gray-100 pt-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 font-medium truncate">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="truncate">{s.email}</span>
                      </div>
                      {s.phone && (
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0" />
                          {s.phone}
                        </div>
                      )}
                      {s.startDate && (
                        <p className="text-xs text-gray-400 font-bold pt-1">
                          Élève depuis le {s.startDate.split('-').reverse().join('/')}
                        </p>
                      )}
                    </div>

                    {s.notes && (
                      <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 font-medium">
                        {s.notes}
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

export default TeacherStudents;