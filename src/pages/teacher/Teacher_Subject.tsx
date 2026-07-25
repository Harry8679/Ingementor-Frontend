import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET    /api/teachers/me/subjects  → { subjects: [{ id, subjectId, name, description, icon }], total }
//  POST   /api/teachers/me/subjects  → { subjectId }
//  DELETE /api/teachers/me/subjects/{id}   (id = relation TeacherSubject)
// ============================================================================

interface TeacherSubject {
  id: number;        // ID de la relation (pour le DELETE)
  subjectId: number; // ID de la matière
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: string | null;
}

interface CatalogSubject {
  id: number;
  name: string;
}

const Subjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);

  // Modale d'ajout
  const [showModal, setShowModal] = useState(false);
  const [catalog, setCatalog] = useState<CatalogSubject[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Suppression
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  // Charge le catalogue quand la modale s'ouvre
  useEffect(() => {
    if (!showModal) return;
    const loadCatalog = async () => {
      try {
        const res = await api.get('/api/teachers/subjects/available');
        setCatalog(res.data?.data ?? []);
      } catch (err) {
        console.error('Impossible de charger le catalogue de matières:', err);
        setCatalog([]);
      }
    };
    loadCatalog();
  }, [showModal]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/teachers/me/subjects');
      const list = res.data?.subjects ?? res.data?.data ?? [];
      setSubjects(Array.isArray(list) ? list : []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos matières.'
        : 'Impossible de charger vos matières.';
      setError(msg);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setFormError(null);
    if (!selectedId) {
      setFormError('Sélectionnez une matière.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/teachers/me/subjects', { subjectId: Number(selectedId) });
      setShowModal(false);
      setSelectedId('');
      loadSubjects();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erreur lors de l'ajout"
        : "Erreur lors de l'ajout";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/teachers/me/subjects/${id}`);
      loadSubjects();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Erreur lors du retrait'
        : 'Erreur lors du retrait';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Matières du catalogue pas encore enseignées
  const availableToAdd = catalog.filter(
    (c) => !subjects.some((s) => s.subjectId === c.id),
  );

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
                <h1 className="text-5xl font-black text-gray-900">Mes Matières 📚</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Les matières que vous enseignez
                </p>
              </div>
              <Button onClick={() => setShowModal(true)}>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                Ajouter une matière
              </Button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700">{error}</p>
                  <button
                    onClick={loadSubjects}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stat unique — réelle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-purple-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Matières enseignées</p>
                    <p className="text-3xl font-black text-gray-900">{subjects.length}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl">
                    <ArrowPathIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Actualiser</p>
                    <button
                      onClick={loadSubjects}
                      className="text-lg font-black text-blue-600 hover:underline"
                    >
                      Recharger la liste
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Liste des matières */}
            {subjects.length === 0 ? (
              <Card>
                <div className="py-16 text-center">
                  <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">Aucune matière enseignée</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Ajoutez les matières que vous enseignez pour pouvoir valider les coupons correspondants.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Ajouter une matière
                  </button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((s) => (
                  <Card key={s.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-purple-500 to-indigo-500 p-3 rounded-2xl">
                          <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">{s.name}</h3>
                      </div>
                      <button
                        onClick={() => handleRemove(s.id)}
                        disabled={deletingId === s.id}
                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        title="Retirer cette matière"
                      >
                        {deletingId === s.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {s.description && (
                      <p className="mt-4 text-sm text-gray-600 font-medium">
                        {s.description}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================== MODALE D'AJOUT ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
                <PlusIcon className="h-6 w-6 text-purple-500" />
                Ajouter une matière
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
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Matière à enseigner
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="">Sélectionner...</option>
                  {availableToAdd.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {availableToAdd.length === 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                    <CheckCircleIcon className="h-4 w-4" />
                    Vous enseignez déjà toutes les matières disponibles.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                }}
                disabled={saving}
                className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !selectedId}
                className="flex-1 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-4 py-3 font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Subjects;