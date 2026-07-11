import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api';

// ---- Aligné sur AdminPricingController::serialize (/api/admin/pricing-grid) ----

interface PricingGrid {
  id: number;
  hourly_rate: number;
  teacher_share: number;
  agency_share: number;
  teacher_amount: number;
  agency_amount: number;
  is_active: boolean;
  grade: { id: number; name: string } | null;
  subject: { id: number; name: string } | null;
}

interface RefItem {
  id: number;
  name: string;
}

export default function SuperAdminPricing() {
  const [tiers, setTiers] = useState<PricingGrid[]>([]);
  const [loading, setLoading] = useState(true);

  // Édition inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ hourly_rate: 0, teacher_share: 50 });
  const [saving, setSaving] = useState(false);

  // Création
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [grades, setGrades] = useState<RefItem[]>([]);
  const [subjects, setSubjects] = useState<RefItem[]>([]);
  const [createForm, setCreateForm] = useState({
    grade_id: '',
    subject_id: '',
    hourly_rate: 35,
    teacher_share: 50,
  });

  // Suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingGrid | null>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    if (!showCreateModal) return;
    const loadRefs = async () => {
      try {
        const [g, s] = await Promise.all([
          api.get('/api/admin/grades'),
          api.get('/api/admin/subjects'),
        ]);
        setGrades(g.data.data || []);
        setSubjects(s.data.data || []);
      } catch (err) {
        console.error('Erreur chargement listes:', err);
      }
    };
    loadRefs();
  }, [showCreateModal]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/pricing-grid');
      setTiers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      setTiers([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Édition inline ----

  const handleEdit = (tier: PricingGrid) => {
    setEditingId(tier.id);
    setEditForm({ hourly_rate: tier.hourly_rate, teacher_share: tier.teacher_share });
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      await api.put(`/api/admin/pricing-grid/${id}`, {
        hourly_rate: editForm.hourly_rate,
        teacher_share: editForm.teacher_share,
      });
      setEditingId(null);
      fetchPricing();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la sauvegarde'
        : 'Erreur lors de la sauvegarde';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // ---- Création ----

  const handleCreate = async () => {
    if (!createForm.grade_id || !createForm.subject_id) {
      alert('Niveau et matière sont obligatoires.');
      return;
    }
    setCreating(true);
    try {
      await api.post('/api/admin/pricing-grid', {
        grade_id: Number(createForm.grade_id),
        subject_id: Number(createForm.subject_id),
        hourly_rate: createForm.hourly_rate,
        teacher_share: createForm.teacher_share,
      });
      setShowCreateModal(false);
      setCreateForm({ grade_id: '', subject_id: '', hourly_rate: 35, teacher_share: 50 });
      fetchPricing();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la création'
        : 'Erreur lors de la création';
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  // ---- Suppression ----

  const handleDelete = async () => {
    if (!selectedTier) return;
    try {
      await api.delete(`/api/admin/pricing-grid/${selectedTier.id}`);
      setShowDeleteModal(false);
      setSelectedTier(null);
      fetchPricing();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la suppression'
        : 'Erreur lors de la suppression';
      alert(msg);
    }
  };

  // Répartition pour 1 heure (toutes les valeurs sont définies → plus de NaN)
  const perHour = (hourlyRate: number, teacherShare: number) => {
    const total = hourlyRate;
    const teacher = (total * teacherShare) / 100;
    const agency = total - teacher;
    // Prix "après crédit d'impôt" = 50% du prix brut (SOUS RÉSERVE d'agrément SAP)
    const afterTaxCredit = total / 2;
    return { total, teacher, agency, afterTaxCredit };
  };

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
            <DollarSign className="h-7 w-7 text-red-500" />
            Grille Tarifaire
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Un tarif par niveau et matière (fixé par l'agence)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30"
        >
          <Plus className="h-5 w-5" />
          Nouveau tarif
        </button>
      </div>

      {/* Info box */}
      <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Répartition des revenus</h3>
            <p className="text-green-700 mt-1">
              Par défaut : <strong>50%</strong> pour le professeur, <strong>50%</strong> pour l'agence.
              Ce ratio est ajustable tarif par tarif. Les prix saisis sont les prix
              <strong> bruts</strong> (avant crédit d'impôt).
            </p>
          </div>
        </div>
      </div>

      {/* Pricing table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Niveau / Matière</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tarif/heure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Part Prof</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Part Agence</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Répartition / heure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tiers.map((tier) => {
                const isEditing = editingId === tier.id;
                const rate = isEditing ? editForm.hourly_rate : tier.hourly_rate;
                const share = isEditing ? editForm.teacher_share : tier.teacher_share;
                const prices = perHour(rate, share);

                return (
                  <tr key={tier.id} className={isEditing ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{tier.grade?.name ?? '—'}</p>
                      <p className="text-xs text-gray-500">{tier.subject?.name ?? '—'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editForm.hourly_rate}
                            onChange={(e) => setEditForm({ ...editForm, hourly_rate: parseFloat(e.target.value) })}
                            className="w-20 px-3 py-1 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            min={1}
                            step={0.5}
                          />
                          <span className="text-gray-500">€</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">{tier.hourly_rate} €</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editForm.teacher_share}
                            onChange={(e) => setEditForm({ ...editForm, teacher_share: parseInt(e.target.value) })}
                            className="w-16 px-3 py-1 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            min={0}
                            max={100}
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {tier.teacher_share}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {isEditing ? 100 - editForm.teacher_share : tier.agency_share}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Total: {prices.total.toFixed(2)} €/h</p>
                        <p className="text-green-600">Prof: {prices.teacher.toFixed(2)} €</p>
                        <p className="text-orange-600">Agence: {prices.agency.toFixed(2)} €</p>
                        <p className="text-blue-600 mt-1">
                          Après crédit d'impôt: {prices.afterTaxCredit.toFixed(2)} €/h*
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tier.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSave(tier.id)}
                            disabled={saving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            title="Enregistrer"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                            title="Annuler"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(tier)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTier(tier);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun tarif défini</p>
            <p className="text-sm text-gray-400 mt-1">
              Crée un tarif pour un couple niveau / matière pour pouvoir générer des coupons.
            </p>
          </div>
        )}
      </div>

      {/* Note légale crédit d'impôt */}
      <p className="text-xs text-gray-400">
        * Prix indicatif après crédit d'impôt de 50 %, sous réserve d'éligibilité
        (agrément « services à la personne »). Le crédit d'impôt n'est applicable
        qu'une fois l'agrément obtenu — à valider avec un expert-comptable.
      </p>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                Nouveau tarif
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                  <select
                    value={createForm.grade_id}
                    onChange={(e) => setCreateForm({ ...createForm, grade_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choisir...</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
                  <select
                    value={createForm.subject_id}
                    onChange={(e) => setCreateForm({ ...createForm, subject_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choisir...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (€)</label>
                  <input
                    type="number"
                    value={createForm.hourly_rate}
                    onChange={(e) => setCreateForm({ ...createForm, hourly_rate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    min={1}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part professeur (%)</label>
                  <input
                    type="number"
                    value={createForm.teacher_share}
                    onChange={(e) => setCreateForm({ ...createForm, teacher_share: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  Prix affiché : <strong>{createForm.hourly_rate.toFixed(2)} €/h</strong>
                </p>
                <p className="text-sm text-green-600">
                  Prof: {((createForm.hourly_rate * createForm.teacher_share) / 100).toFixed(2)} €/h
                </p>
                <p className="text-sm text-orange-600">
                  Agence: {((createForm.hourly_rate * (100 - createForm.teacher_share)) / 100).toFixed(2)} €/h
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Après crédit d'impôt : {(createForm.hourly_rate / 2).toFixed(2)} €/h*
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
              >
                {creating ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer ce tarif ?</h3>
              <p className="text-gray-500 mb-6">
                <strong>
                  {selectedTier.grade?.name} / {selectedTier.subject?.name}
                </strong>
                <br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTier(null);
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