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
  Heart,
} from 'lucide-react';
import api from '../../services/api';

// ============================================================================
//  PAGE ASSOCIATIONS — 2 onglets
//  A) Professeur ↔ Élève (multi-matières)
//  B) Parent ↔ Enfant   (relation Student.parent)
// ============================================================================

type Tab = 'teacher' | 'parent';

// ---- Types prof-élève ----
interface Teacher {
  id: number;
  name: string;
  email: string;
  subjects?: { id: number; name: string }[];
}
interface StudentLink {
  id: number;
  linkId: number;
  name: string;
  email: string;
  grade?: string | null;
  subject?: string | null;
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

// ---- Types parent-enfant ----
interface ParentChild {
  id: number;
  name: string;
  grade?: string | null;
}
interface Parent {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  children: ParentChild[];
  children_count: number;
}

interface Stats {
  students: {
    total: number;
    with_teacher: number;
    without_teacher: number;
    with_parent: number;
    without_parent: number;
  };
  teachers: { total: number };
  parents: { total: number };
}

const PAGE_SIZE = 20;

export default function SuperAdminAssociations() {
  const [tab, setTab] = useState<Tab>('teacher');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= PROF ↔ ÉLÈVE =================
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<StudentLink[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [subjects, setSubjects] = useState<SubjectRef[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [studentQuery, setStudentQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // ================= PARENT ↔ ENFANT =================
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [parentSearch, setParentSearch] = useState('');

  const [showChildModal, setShowChildModal] = useState(false);
  const [availableChildren, setAvailableChildren] = useState<AvailableStudent[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [childQuery, setChildQuery] = useState('');
  const [childVisibleCount, setChildVisibleCount] = useState(PAGE_SIZE);
  const [childLinking, setChildLinking] = useState(false);
  const [childError, setChildError] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [t, s, p] = await Promise.all([
        api.get('/api/admin/associations/teachers/available'),
        api.get('/api/admin/associations/stats'),
        api.get('/api/admin/parents', { params: { limit: 50 } }),
      ]);
      setTeachers(t.data?.data ?? []);
      setStats(s.data?.data ?? null);
      setParents(p.data?.data ?? []);
    } catch (err) {
      console.error('Erreur chargement associations:', err);
    } finally {
      setLoading(false);
    }
  };

  const reloadStats = async () => {
    try {
      const s = await api.get('/api/admin/associations/stats');
      setStats(s.data?.data ?? null);
    } catch (err) {
      console.error(err);
    }
  };

  const reloadParents = async () => {
    try {
      const p = await api.get('/api/admin/parents', { params: { limit: 50 } });
      const list: Parent[] = p.data?.data ?? [];
      setParents(list);
      if (selectedParent) {
        const updated = list.find((x) => x.id === selectedParent.id);
        setSelectedParent(updated ?? null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------- Prof ↔ Élève --------
  const selectTeacher = async (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setLoadingStudents(true);
    try {
      const res = await api.get(`/api/admin/associations/teacher/${teacher.id}/students`);
      setStudents(res.data?.data?.students ?? []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const openLinkModal = async () => {
    setLinkError(null);
    setSelectedStudentId(null);
    setSelectedSubjectIds([]);
    setStudentQuery('');
    setVisibleCount(PAGE_SIZE);
    setShowLinkModal(true);
    try {
      const [st, sub] = await Promise.all([
        api.get('/api/admin/associations/students/all'),
        api.get('/api/admin/subjects'),
      ]);
      setAvailableStudents(st.data?.data ?? []);
      setSubjects(sub.data?.data ?? sub.data?.subjects ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleLink = async () => {
    if (!selectedTeacher || !selectedStudentId) {
      setLinkError('Sélectionnez un élève.');
      return;
    }
    if (selectedSubjectIds.length === 0) {
      setLinkError('Sélectionnez au moins une matière.');
      return;
    }
    setLinking(true);
    setLinkError(null);

    const results = await Promise.allSettled(
      selectedSubjectIds.map((subjectId) =>
        api.post('/api/admin/associations/link/student-teacher', {
          student_id: selectedStudentId,
          teacher_id: selectedTeacher.id,
          subject_id: subjectId,
        }),
      ),
    );

    const realErrors = results.filter(
      (r) =>
        r.status === 'rejected' &&
        !String(
          (r.reason as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '',
        ).includes('déjà'),
    );

    setLinking(false);
    if (realErrors.length > 0) {
      setLinkError("Certaines matières n'ont pas pu être associées.");
      return;
    }
    setShowLinkModal(false);
    selectTeacher(selectedTeacher);
    reloadStats();
  };

  const handleUnlink = async (linkId: number) => {
    if (!selectedTeacher) return;
    if (!window.confirm('Retirer cette matière pour cet élève ?')) return;
    try {
      await api.delete(`/api/admin/associations/unlink/student-teacher/${linkId}`);
      selectTeacher(selectedTeacher);
      reloadStats();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du retrait');
    }
  };

  // -------- Parent ↔ Enfant --------
  const openChildModal = async () => {
    setChildError(null);
    setSelectedChildId(null);
    setChildQuery('');
    setChildVisibleCount(PAGE_SIZE);
    setShowChildModal(true);
    try {
      const res = await api.get('/api/admin/associations/students/without-parent');
      setAvailableChildren(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
      setAvailableChildren([]);
    }
  };

  const handleLinkChild = async () => {
    if (!selectedParent || !selectedChildId) {
      setChildError('Sélectionnez un enfant.');
      return;
    }
    setChildLinking(true);
    setChildError(null);
    try {
      await api.post('/api/admin/associations/link/parent-child', {
        parent_id: selectedParent.id,
        student_id: selectedChildId,
      });
      setShowChildModal(false);
      await reloadParents();
      reloadStats();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erreur lors de la liaison';
      setChildError(msg);
    } finally {
      setChildLinking(false);
    }
  };

  const handleUnlinkChild = async (studentId: number) => {
    if (!window.confirm('Retirer cet enfant du parent ?')) return;
    try {
      await api.post('/api/admin/associations/unlink/parent-child', {
        student_id: studentId,
      });
      await reloadParents();
      reloadStats();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du retrait');
    }
  };

  // -------- Dérivés --------
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  const filteredParents = parents.filter(
    (p) =>
      p.full_name.toLowerCase().includes(parentSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(parentSearch.toLowerCase()),
  );

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

  const filteredChildren = useMemo(() => {
    const q = childQuery.trim().toLowerCase();
    if (!q) return availableChildren;
    return availableChildren.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.grade ?? '').toLowerCase().includes(q),
    );
  }, [availableChildren, childQuery]);
  const visibleChildren = filteredChildren.slice(0, childVisibleCount);

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
          Associations
        </h1>
        <p className="text-gray-500 mt-1">Gérez les liens entre professeurs, élèves et parents</p>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('teacher')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${
            tab === 'teacher'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap className="h-4 w-4 inline mr-1.5" />
          Professeur ↔ Élève
        </button>
        <button
          onClick={() => setTab('parent')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${
            tab === 'parent'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Heart className="h-4 w-4 inline mr-1.5" />
          Parent ↔ Enfant
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tab === 'teacher' ? (
            <>
              <StatCard label="Professeurs" value={stats.teachers.total} />
              <StatCard label="Élèves" value={stats.students.total} />
              <StatCard label="Avec professeur" value={stats.students.with_teacher} color="text-green-600" />
              <StatCard label="Sans professeur" value={stats.students.without_teacher} color="text-orange-500" />
            </>
          ) : (
            <>
              <StatCard label="Parents" value={stats.parents.total} />
              <StatCard label="Élèves" value={stats.students.total} />
              <StatCard label="Avec parent" value={stats.students.with_parent} color="text-green-600" />
              <StatCard label="Sans parent" value={stats.students.without_parent} color="text-orange-500" />
            </>
          )}
        </div>
      )}

      {/* ============ ONGLET PROF ↔ ÉLÈVE ============ */}
      {tab === 'teacher' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profs */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-red-500" />
                Professeurs
              </h2>
              <SearchInput value={teacherSearch} onChange={setTeacherSearch} placeholder="Rechercher un professeur..." />
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
                    <Avatar name={t.name} from="from-purple-500" to="to-indigo-500" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{t.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {t.subjects && t.subjects.length > 0 ? t.subjects.map((s) => s.name).join(', ') : t.email}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Élèves du prof */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {!selectedTeacher ? (
              <EmptyPane text="Sélectionnez un professeur pour voir ses élèves" />
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-bold text-gray-900">Élèves de {selectedTeacher.name}</h2>
                    <p className="text-xs text-gray-500">{students.length} ligne(s)</p>
                  </div>
                  <AssocButton onClick={openLinkModal} />
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {loadingStudents ? (
                    <Spinner />
                  ) : students.length === 0 ? (
                    <p className="p-6 text-center text-gray-400 text-sm">Aucun élève rattaché</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {students.map((s) => (
                        <div key={s.linkId} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={s.name} from="from-cyan-500" to="to-teal-500" />
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
                          <DeleteBtn onClick={() => handleUnlink(s.linkId)} title="Retirer cette matière" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ ONGLET PARENT ↔ ENFANT ============ */}
      {tab === 'parent' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parents */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-red-500" />
                Parents
              </h2>
              <SearchInput value={parentSearch} onChange={setParentSearch} placeholder="Rechercher un parent..." />
            </div>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
              {filteredParents.length === 0 ? (
                <p className="p-6 text-center text-gray-400 text-sm">Aucun parent</p>
              ) : (
                filteredParents.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedParent(p)}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                      selectedParent?.id === p.id ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Avatar name={p.full_name} from="from-pink-500" to="to-rose-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{p.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.email}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium shrink-0">
                      {p.children_count} enfant{p.children_count > 1 ? 's' : ''}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Enfants du parent */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {!selectedParent ? (
              <EmptyPane text="Sélectionnez un parent pour voir ses enfants" />
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-bold text-gray-900">Enfants de {selectedParent.full_name}</h2>
                    <p className="text-xs text-gray-500">{selectedParent.children.length} enfant(s)</p>
                  </div>
                  <AssocButton onClick={openChildModal} />
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {selectedParent.children.length === 0 ? (
                    <p className="p-6 text-center text-gray-400 text-sm">Aucun enfant rattaché</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {selectedParent.children.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={c.name} from="from-cyan-500" to="to-teal-500" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{c.name}</p>
                              {c.grade && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                                  {c.grade}
                                </span>
                              )}
                            </div>
                          </div>
                          <DeleteBtn onClick={() => handleUnlinkChild(c.id)} title="Retirer cet enfant" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MODALE PROF ↔ ÉLÈVE ===== */}
      {showLinkModal && selectedTeacher && (
        <Modal title={`Associer un élève à ${selectedTeacher.name}`} onClose={() => setShowLinkModal(false)}>
          {linkError && <ErrorBox>{linkError}</ErrorBox>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matières ({selectedSubjectIds.length} sélectionnée{selectedSubjectIds.length > 1 ? 's' : ''})
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => {
                const active = selectedSubjectIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubject(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                      active ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
          <StudentPicker
            label={`Élève (${filteredStudents.length})`}
            query={studentQuery}
            onQuery={(v) => {
              setStudentQuery(v);
              setVisibleCount(PAGE_SIZE);
            }}
            visible={visibleStudents}
            total={filteredStudents.length}
            visibleCount={visibleCount}
            onMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
            selectedId={selectedStudentId}
            onSelect={setSelectedStudentId}
            initials={initials}
          />
          <ModalFooter
            onCancel={() => setShowLinkModal(false)}
            onConfirm={handleLink}
            disabled={linking || !selectedStudentId || selectedSubjectIds.length === 0}
            loading={linking}
          />
        </Modal>
      )}

      {/* ===== MODALE PARENT ↔ ENFANT ===== */}
      {showChildModal && selectedParent && (
        <Modal title={`Associer un enfant à ${selectedParent.full_name}`} onClose={() => setShowChildModal(false)}>
          {childError && <ErrorBox>{childError}</ErrorBox>}
          <StudentPicker
            label={`Enfant sans parent (${filteredChildren.length})`}
            query={childQuery}
            onQuery={(v) => {
              setChildQuery(v);
              setChildVisibleCount(PAGE_SIZE);
            }}
            visible={visibleChildren}
            total={filteredChildren.length}
            visibleCount={childVisibleCount}
            onMore={() => setChildVisibleCount((c) => c + PAGE_SIZE)}
            selectedId={selectedChildId}
            onSelect={setSelectedChildId}
            initials={initials}
          />
          <ModalFooter
            onCancel={() => setShowChildModal(false)}
            onConfirm={handleLinkChild}
            disabled={childLinking || !selectedChildId}
            loading={childLinking}
          />
        </Modal>
      )}
    </div>
  );
}

// ============================================================================
//  Composants réutilisables
// ============================================================================

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
  );
}

function Avatar({ name, from, to }: { name: string; from: string; to: string }) {
  const initials =
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${from} ${to} text-white text-sm font-medium`}>
      {initials}
    </div>
  );
}

function EmptyPane({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <Users className="h-12 w-12 text-gray-200 mb-3" />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="p-6 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mx-auto" />
    </div>
  );
}

function AssocButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-all"
    >
      <UserPlus className="h-4 w-4" />
      Associer
    </button>
  );
}

function DeleteBtn({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-red-500" />
            {title}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {children}
    </div>
  );
}

interface PickerStudent {
  id: number;
  name: string;
  email: string;
  grade?: string | null;
}
function StudentPicker({
  label,
  query,
  onQuery,
  visible,
  total,
  visibleCount,
  onMore,
  selectedId,
  onSelect,
  initials,
}: {
  label: string;
  query: string;
  onQuery: (v: string) => void;
  visible: PickerStudent[];
  total: number;
  visibleCount: number;
  onMore: () => void;
  selectedId: number | null;
  onSelect: (id: number) => void;
  initials: (n: string) => string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email, classe..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-100">
        {total === 0 ? (
          <p className="p-4 text-center text-gray-400 text-sm">Aucun élève disponible</p>
        ) : (
          <>
            {visible.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                  selectedId === s.id ? 'bg-red-50 ring-1 ring-red-300' : 'hover:bg-gray-50'
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
            {visibleCount < total && (
              <button onClick={onMore} className="w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50">
                Voir plus ({total - visibleCount} restants)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onConfirm,
  disabled,
  loading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        onClick={onCancel}
        disabled={loading}
        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Annuler
      </button>
      <button
        onClick={onConfirm}
        disabled={disabled}
        className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-all disabled:opacity-50"
      >
        {loading ? 'Association...' : 'Associer'}
      </button>
    </div>
  );
}