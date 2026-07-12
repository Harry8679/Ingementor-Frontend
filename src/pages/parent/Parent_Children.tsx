import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  UserGroupIcon,
  PlusIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ---- Aligné sur ParentChildController ----
// GET  /parents/me/children  → { children: [ { id, student: {...}, relationship } ], total }
// POST /parents/me/children  → { email, password, firstName, lastName, gradeId, phone?, relationship? }

interface StudentGrade {
  id: number;
  name: string;
  level: string;
}

interface StudentInfo {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  grade: StudentGrade | null;
}

interface ChildLink {
  id: number; // ID de la relation StudentParent (pas de l'élève)
  student: StudentInfo;
  relationship: string | null;
  createdAt: string | null;
}

interface GradeRef {
  id: number;
  name: string;
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  gradeId: '',
  relationship: 'PARENT',
};

const Children: React.FC = () => {
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modale d'ajout
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [grades, setGrades] = useState<GradeRef[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchChildren();
  }, []);

  // Charge les niveaux à l'ouverture de la modale
  useEffect(() => {
    if (!showModal) return;
    const loadGrades = async () => {
      try {
        const res = await api.get('/grades');
        setGrades(res.data.data || []);
      } catch (err) {
        console.error('Erreur chargement niveaux:', err);
        setGrades([]);
      }
    };
    loadGrades();
  }, [showModal]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/parents/me/children');
      setChildren(res.data.children || []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos enfants.'
        : 'Impossible de charger vos enfants.';
      setError(msg);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.gradeId) {
      setFormError('Prénom, nom, email, mot de passe et niveau sont obligatoires.');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/parents/me/children', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gradeId: Number(form.gradeId),
        phone: form.phone || undefined,
        relationship: form.relationship,
      });
      setShowModal(false);
      setForm(emptyForm);
      fetchChildren();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erreur lors de l'ajout"
        : "Erreur lors de l'ajout";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = (student: StudentInfo) =>
    `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserGroupIcon className="h-8 w-8 text-pink-500" />
                Mes Enfants
              </h1>
              <p className="text-gray-500 mt-1">Gérez les profils de vos enfants</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter un enfant
            </Button>
          </div>

          {/* Erreur de chargement */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
              <div>
                <p>{error}</p>
                <button
                  onClick={fetchChildren}
                  className="mt-2 rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Chargement */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-8">
                <Card>
                  <div className="flex items-center gap-4 p-2">
                    <div className="rounded-xl bg-pink-100 p-3">
                      <UserGroupIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total enfants</p>
                      <p className="text-3xl font-bold text-gray-900">{children.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {children.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun enfant enregistré</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Ajoutez un enfant pour commencer à suivre sa scolarité.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((link) => {
                    const child = link.student;
                    return (
                      <Card key={link.id}>
                        <div className="p-2">
                          <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 text-xl font-bold text-white">
                              {initials(child)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {child.fullName?.trim() || child.email}
                              </h3>

                              {child.grade ? (
                                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                  <AcademicCapIcon className="h-3.5 w-3.5" />
                                  {child.grade.name}
                                </span>
                              ) : (
                                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                  <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                                  Classe non renseignée
                                </span>
                              )}

                              <p className="mt-2 text-sm text-gray-500 truncate">{child.email}</p>
                              {child.phone && <p className="text-sm text-gray-500">{child.phone}</p>}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==================== MODALE D'AJOUT ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <PlusIcon className="h-6 w-6 text-pink-500" />
                Ajouter un enfant
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prénom *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                    placeholder="Emma"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Classe / Niveau *
                </label>
                <select
                  value={form.gradeId}
                  onChange={(e) => setForm({ ...form, gradeId: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Sélectionner une classe...</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email de l'enfant *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                  placeholder="emma.dupont@exemple.fr"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Servira à l'enfant pour se connecter à son espace.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                  placeholder="Au moins 6 caractères"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Lien de parenté</label>
                <select
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-pink-500"
                >
                  <option value="PARENT">Parent</option>
                  <option value="TUTOR">Tuteur légal</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                }}
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2 font-medium text-white hover:shadow-lg disabled:opacity-50"
              >
                {saving ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Children;