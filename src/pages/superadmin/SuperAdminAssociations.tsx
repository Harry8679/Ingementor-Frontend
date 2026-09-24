import { useEffect, useMemo, useState } from 'react';
import {
  Link2,
  Users,
  GraduationCap,
  UserPlus,
  Trash2,
  Search,
  X,
  Mail,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';

// ============================================================================
//  Partie PROF ↔ ÉLÈVE
//  GET  /api/admin/associations/teachers/available
//  GET  /api/admin/associations/teacher/{id}/students
//  GET  /api/admin/associations/students/without-teacher
//  GET  /api/admin/subjects                                (catalogue matières)
//  POST /api/admin/associations/link/student-teacher     → { student_id, teacher_id, subject_id }
//  POST /api/admin/associations/unlink/student-teacher   → { student_id, teacher_id }
//  GET  /api/admin/associations/stats
// ============================================================================

interface Teacher {
  id: number;
  name: string;
  email: string;
  subjects?: { id: number; name: string }[];
}

interface StudentLink {
  id: number;        // id de l'élève
  linkId: number;    // id de la ligne TeacherStudent (pour le unlink ciblé)
  name: string;
  email: string;
  grade?: string | null;
  subject?: string | null;
  parent?: { id: number; name: string } | null;
}

interface AvailableStudent {
  id: number;
  name: string;
  email: string;
  grade?: string | null;
}

interface SubjectRef {
  id: number;
  name: string;
}

interface Stats {
  students: { total: number; with_teacher: number; without_teacher: number };
  teachers: { total: number };
  parents: { total: number };
}

const PAGE_SIZE = 20; // élèves affichés par page dans la modale

export default function SuperAdminAssociations() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<StudentLink[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [teacherSearch, setTeacherSearch] = useState('');

  // Modale de liaison
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [subjects, setSubjects] = useState<SubjectRef[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [t, s] = await Promise.all([
        api.get('/api/admin/associations/teachers/available'),
        api.get('/api/admin/associations/stats'),
      ]);
      setTeachers(t.data?.data ?? []);
      setStats(s.data?.data ?? null);
    } catch (err) {
      console.error('Erreur chargement associations:', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const selectTeacher = async (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setLoadingStudents(true);
    try {
      const res = await api.get(`/api/admin/associations/teacher/${teacher.id}/students`);
      setStudents(res.data?.data?.students ?? []);
    } catch (err) {
      console.error('Erreur chargement élèves du prof:', err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const openLinkModal = async () => {
    setLinkError(null);
    setSelectedStudentId(null);
    setSelectedSubjectId('');
    setStudentQuery('');
    setVisibleCount(PAGE_SIZE);
    setShowLinkModal(true);
    try {
      const [st, sub] = await Promise.all([
        api.get('/api/admin/associations/students/without-teacher'),
        api.get('/api/admin/subjects'),
      ]);
      setAvailableStudents(st.data?.data ?? []);
      setSubjects(sub.data?.data ?? sub.data?.subjects ?? []);
    } catch (err) {
      console.error('Erreur chargement modale:', err);
      setAvailableStudents([]);
      setSubjects([]);
    }
  };

  const handleLink = async () => {
    if (!selectedTeacher || !selectedStudentId) {
      setLinkError('Sélectionnez un élève.');
      return;
    }
    if (!selectedSubjectId) {
      setLinkError('Sélectionnez une matière.');
      return;
    }
    setLinking(true);
    setLinkError(null);
    try {
      await api.post('/api/admin/associations/link/student-teacher', {
        student_id: selectedStudentId,
        teacher_id: selectedTeacher.id,
        subject_id: Number(selectedSubjectId),
      });
      setShowLinkModal(false);
      selectTeacher(selectedTeacher);
      loadInitial();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erreur lors de la liaison';
      setLinkError(msg);
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async (linkId: number) => {
    if (!selectedTeacher) return;
    if (!window.confirm('Retirer cette matière pour cet élève ?')) return;
    try {
      await api.delete(`/api/admin/associations/unlink/student-teacher/${linkId}`);
      selectTeacher(selectedTeacher);
      loadInitial();
    } catch (err) {
      console.error('Erreur unlink:', err);
      alert('Erreur lors du retrait');
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  // Recherche + pagination des élèves dans la modale
  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return availableStudents;
    return availableStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.grade ?? '').toLowerCase().includes(q),
    );
  }, [availableStudents, studentQuery]);

  const visibleStudents = filteredStudents.slice(0, visibleCount);

  const initials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Link2 className="h-7 w-7 text-red-500" />
          Associations Professeur ↔ Élève
        </h1>
        <p className="text-gray-500 mt-1">Rattachez les élèves à leurs professeurs</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Professeurs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.teachers.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Élèves</p>
            <p className="text-2xl font-bold text-gray-900">{stats.students.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Avec professeur</p>
            <p className="text-2xl font-bold text-green-600">{stats.students.with_teacher}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Sans professeur</p>
            <p className="text-2xl font-bold text-orange-500">{stats.students.without_teacher}</p>
          </div>
        </div>
      )}

      {/* Deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche : profs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-red-500" />
              Professeurs
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un professeur..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {filteredTeachers.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">Aucun professeur</p>
            ) : (
              filteredTeachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTeacher(t)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    selectedTeacher?.id === t.id ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-white text-sm font-medium">
                    {initials(t.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{t.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {t.subjects && t.subjects.length > 0
                        ? t.subjects.map((s) => s.name).join(', ')
                        : t.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Colonne droite : élèves du prof */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {!selectedTeacher ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Users className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">
                Sélectionnez un professeur pour voir ses élèves
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900">Élèves de {selectedTeacher.name}</h2>
                  <p className="text-xs text-gray-500">{students.length} élève(s) rattaché(s)</p>
                </div>
                <button
                  onClick={openLinkModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Associer
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {loadingStudents ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mx-auto" />
                  </div>
                ) : students.length === 0 ? (
                  <p className="p-6 text-center text-gray-400 text-sm">
                    Aucun élève rattaché à ce professeur
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {students.map((s) => (
                      <div key={s.linkId} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-teal-500 text-white text-sm font-medium">
                            {initials(s.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-gray-900 truncate">{s.name}</p>
                              {s.subject && (
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                                  {s.subject}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              {s.grade && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                                  {s.grade}
                                </span>
                              )}
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3" />
                                {s.email}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnlink(s.linkId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Retirer cette matière"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modale de liaison */}
      {showLinkModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-red-500" />
                Associer un élève à {selectedTeacher.name}
              </h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {linkError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {linkError}
                </div>
              )}

              {/* Matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sélectionner une matière...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recherche d'élève */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève sans professeur ({filteredStudents.length})
                </label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, classe..."
                    value={studentQuery}
                    onChange={(e) => {
                      setStudentQuery(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <p className="p-4 text-center text-gray-400 text-sm">
                      Aucun élève disponible
                    </p>
                  ) : (
                    <>
                      {visibleStudents.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedStudentId(s.id)}
                          className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                            selectedStudentId === s.id
                              ? 'bg-red-50 ring-1 ring-red-300'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-teal-500 text-white text-xs font-medium">
                            {initials(s.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {s.grade ? `${s.grade} · ` : ''}
                              {s.email}
                            </p>
                          </div>
                        </button>
                      ))}
                      {visibleCount < filteredStudents.length && (
                        <button
                          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                          className="w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Voir plus ({filteredStudents.length - visibleCount} restants)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowLinkModal(false)}
                disabled={linking}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleLink}
                disabled={linking || !selectedStudentId || !selectedSubjectId}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {linking ? 'Association...' : 'Associer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}