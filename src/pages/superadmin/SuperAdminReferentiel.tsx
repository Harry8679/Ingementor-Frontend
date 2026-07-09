import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Layers,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import api from '../../services/api';

// ==================== Types ====================

interface Grade {
  id: number;
  name: string;
  level: string;
  order: number;
  description: string | null;
}

interface Subject {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

type Tab = 'grades' | 'subjects';

const emptyGradeForm = { name: '', level: '', order: 0, description: '' };
const emptySubjectForm = { name: '', description: '', icon: '' };

export default function SuperAdminReferentiel() {
  const [tab, setTab] = useState<Tab>('grades');

  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [gradeForm, setGradeForm] = useState(emptyGradeForm);
  const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);

  // ==================== Chargement ====================

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [g, s] = await Promise.all([
        api.get('/api/admin/grades'),
        api.get('/api/admin/subjects'),
      ]);
      setGrades(g.data.data || []);
      setSubjects(s.data.data || []);
    } catch (err) {
      console.error('Erreur chargement référentiel:', err);
      setGrades([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Ouverture des modales ====================

  const openCreate = () => {
    setEditingId(null);
    setGradeForm(emptyGradeForm);
    setSubjectForm(emptySubjectForm);
    setShowFormModal(true);
  };

  const openEditGrade = (g: Grade) => {
    setEditingId(g.id);
    setGradeForm({
      name: g.name,
      level: g.level,
      order: g.order,
      description: g.description ?? '',
    });
    setShowFormModal(true);
  };

  const openEditSubject = (s: Subject) => {
    setEditingId(s.id);
    setSubjectForm({
      name: s.name,
      description: s.description ?? '',
      icon: s.icon ?? '',
    });
    setShowFormModal(true);
  };

  // ==================== Enregistrement ====================

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'grades') {
        if (!gradeForm.name || !gradeForm.level) {
          alert('Le nom et le code du niveau sont obligatoires.');
          setSaving(false);
          return;
        }
        const payload = {
          name: gradeForm.name,
          level: gradeForm.level,
          order: Number(gradeForm.order) || 0,
          description: gradeForm.description || null,
        };
        if (editingId) {
          await api.put(`/api/admin/grades/${editingId}`, payload);
        } else {
          await api.post('/api/admin/grades', payload);
        }
      } else {
        if (!subjectForm.name) {
          alert('Le nom de la matière est obligatoire.');
          setSaving(false);
          return;
        }
        const payload = {
          name: subjectForm.name,
          description: subjectForm.description || null,
          icon: subjectForm.icon || null,
        };
        if (editingId) {
          await api.put(`/api/admin/subjects/${editingId}`, payload);
        } else {
          await api.post('/api/admin/subjects', payload);
        }
      }
      setShowFormModal(false);
      fetchAll();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erreur lors de l'enregistrement"
        : "Erreur lors de l'enregistrement";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // ==================== Suppression ====================

  const askDelete = (id: number, label: string) => {
    setDeleteTarget({ id, label });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint = tab === 'grades' ? 'grades' : 'subjects';
      await api.delete(`/api/admin/${endpoint}/${deleteTarget.id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchAll();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la suppression'
        : 'Erreur lors de la suppression';
      alert(msg);
    }
  };

  // ==================== Filtrage ====================

  const filteredGrades = grades.filter((g) =>
    `${g.name} ${g.level}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="h-7 w-7 text-red-500" />
            Référentiel
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Gérer les niveaux scolaires et les matières</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30"
          >
            <Plus className="h-5 w-5" />
            {tab === 'grades' ? 'Nouveau niveau' : 'Nouvelle matière'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setTab('grades');
            setSearchTerm('');
          }}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'grades'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="h-4 w-4" />
          Niveaux ({grades.length})
        </button>
        <button
          onClick={() => {
            setTab('subjects');
            setSearchTerm('');
          }}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'subjects'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Matières ({subjects.length})
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={tab === 'grades' ? 'Rechercher un niveau...' : 'Rechercher une matière...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'grades' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Ordre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Niveau</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {g.order}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{g.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-mono font-medium">
                        {g.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {g.description || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditGrade(g)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => askDelete(g.id, g.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Matière</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Icône</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.icon || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {s.description || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditSubject(s)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => askDelete(s.id, s.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {((tab === 'grades' && filteredGrades.length === 0) ||
          (tab === 'subjects' && filteredSubjects.length === 0)) && (
          <div className="text-center py-12">
            {tab === 'grades' ? (
              <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            ) : (
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            )}
            <p className="text-gray-500">
              {tab === 'grades' ? 'Aucun niveau' : 'Aucune matière'}
            </p>
          </div>
        )}
      </div>

      {/* ==================== FORM MODAL (create / edit) ==================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {tab === 'grades' ? (
                  <Layers className="h-6 w-6 text-red-500" />
                ) : (
                  <BookOpen className="h-6 w-6 text-red-500" />
                )}
                {editingId ? 'Modifier' : 'Créer'} {tab === 'grades' ? 'un niveau' : 'une matière'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {tab === 'grades' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du niveau *</label>
                    <input
                      type="text"
                      value={gradeForm.name}
                      onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="ex : Terminale"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                      <input
                        type="text"
                        value={gradeForm.level}
                        onChange={(e) => setGradeForm({ ...gradeForm, level: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                        placeholder="ex : term"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                      <input
                        type="number"
                        value={gradeForm.order}
                        onChange={(e) => setGradeForm({ ...gradeForm, order: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                        min={0}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={gradeForm.description}
                      onChange={(e) => setGradeForm({ ...gradeForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="Optionnel"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la matière *</label>
                    <input
                      type="text"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="ex : Mathématiques"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                    <input
                      type="text"
                      value={subjectForm.icon}
                      onChange={(e) => setSubjectForm({ ...subjectForm, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="Optionnel (ex : nom d'icône)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={subjectForm.description}
                      onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="Optionnel"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowFormModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE MODAL ==================== */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Supprimer {tab === 'grades' ? 'ce niveau' : 'cette matière'} ?
              </h3>
              <p className="text-gray-500 mb-6">
                <strong>{deleteTarget.label}</strong>
                <br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}