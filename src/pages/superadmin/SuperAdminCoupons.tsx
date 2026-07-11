import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Ticket,
  Search,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Plus,
} from 'lucide-react';
import api from '../../services/api';

// ==================== Types (alignés sur l'API) ====================

interface Coupon {
  id: number;
  code: string;
  status: 'available' | 'used' | 'expired' | 'cancelled';
  status_label: string;
  purchase_type: 'online' | 'agency';
  purchase_type_label: string;
  price_client: string | null;
  price_teacher: string | null;
  agency_margin: string | null;
  created_at: string | null;
  expires_at: string | null;
  days_until_expiration: number;
  parent: { id: number; name: string; email: string } | null;
  student: { id: number; name: string } | null;
  grade: { id: number; name: string } | null;
  subject: { id: number; name: string } | null;
}

interface ParentRef {
  id: number;
  fullName: string;
  email: string;
}

interface ChildRef {
  id: number;
  fullName: string;
  grade: { id: number; name: string } | null;
}

interface SubjectRef {
  id: number;
  name: string;
}

interface PriceInfo {
  hourly_rate: number;
  teacher_share: number;
  agency_share: number;
  teacher_amount: number;
  agency_amount: number;
}

const statusConfig: Record<
  Coupon['status'],
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  used: { label: 'Utilisé', color: 'bg-blue-100 text-blue-700', icon: Clock },
  expired: { label: 'Expiré', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

function money(value: string | null): string {
  if (value === null) return '—';
  return `${parseFloat(value).toFixed(2)} €`;
}

function dateOnly(value: string | null): string {
  return value ? value.slice(0, 10) : '—';
}

export default function SuperAdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editForm, setEditForm] = useState({ expiresAt: '' });
  const [saving, setSaving] = useState(false);

  // ---- Création en cascade ----
  const [creating, setCreating] = useState(false);
  const [parents, setParents] = useState<ParentRef[]>([]);
  const [children, setChildren] = useState<ChildRef[]>([]);
  const [subjects, setSubjects] = useState<SubjectRef[]>([]);

  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [loadingChildren, setLoadingChildren] = useState(false);
  const [price, setPrice] = useState<PriceInfo | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const selectedChild = children.find((c) => String(c.id) === selectedChildId) ?? null;

  // ==================== Effets ====================

  useEffect(() => {
    fetchCoupons();
  }, []);

  // À l'ouverture de la modale : parents + matières
  useEffect(() => {
    if (!showCreateModal) return;
    const loadRefs = async () => {
      try {
        const [p, s] = await Promise.all([
          api.get('/api/admin/parents'),
          api.get('/api/admin/subjects'),
        ]);
        setParents(p.data.data || []);
        setSubjects(s.data.data || []);
      } catch (err) {
        console.error('Erreur chargement listes:', err);
      }
    };
    loadRefs();
  }, [showCreateModal]);

  // Parent choisi → charge ses enfants
  useEffect(() => {
    if (!selectedParentId) {
      setChildren([]);
      setSelectedChildId('');
      return;
    }
    const loadChildren = async () => {
      setLoadingChildren(true);
      setSelectedChildId('');
      try {
        const res = await api.get(`/api/admin/associations/parent/${selectedParentId}/children`);
        setChildren(res.data.data || []);
      } catch (err) {
        console.error('Erreur chargement enfants:', err);
        setChildren([]);
      } finally {
        setLoadingChildren(false);
      }
    };
    loadChildren();
  }, [selectedParentId]);

  // Élève + matière → tarif automatique
  useEffect(() => {
    const gradeId = selectedChild?.grade?.id;
    if (!gradeId || !selectedSubjectId) {
      setPrice(null);
      setPriceError(null);
      return;
    }
    const loadPrice = async () => {
      setLoadingPrice(true);
      setPriceError(null);
      try {
        const res = await api.get('/api/admin/pricing-grid/lookup', {
          params: { grade_id: gradeId, subject_id: Number(selectedSubjectId) },
        });
        setPrice(res.data.data);
      } catch (err: unknown) {
        setPrice(null);
        setPriceError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? 'Aucun tarif pour ce couple'
            : 'Aucun tarif pour ce couple',
        );
      } finally {
        setLoadingPrice(false);
      }
    };
    loadPrice();
  }, [selectedChild, selectedSubjectId]);

  // ==================== Appels API ====================

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/coupons');
      setCoupons(response.data.data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setSelectedParentId('');
    setSelectedChildId('');
    setSelectedSubjectId('');
    setQuantity(1);
    setChildren([]);
    setPrice(null);
    setPriceError(null);
  };

  const handleCreateCoupon = async () => {
    const gradeId = selectedChild?.grade?.id;

    if (!selectedParentId || !selectedChildId || !gradeId || !selectedSubjectId) {
      alert('Parent, élève et matière sont obligatoires.');
      return;
    }
    if (!price) {
      alert("Aucun tarif n'est défini pour cette classe et cette matière.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post('/api/admin/coupons/create', {
        parent_id: Number(selectedParentId),
        student_id: Number(selectedChildId),
        grade_id: gradeId,
        subject_id: Number(selectedSubjectId),
        quantity: Number(quantity),
      });
      alert(res.data.message);
      setShowCreateModal(false);
      resetCreateForm();
      fetchCoupons();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la création'
        : 'Erreur lors de la création';
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({ expiresAt: dateOnly(coupon.expires_at) });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCoupon) return;
    setSaving(true);
    try {
      await api.put(`/api/super-admin/coupons/${selectedCoupon.id}`, {
        expiresAt: editForm.expiresAt,
      });
      setShowEditModal(false);
      fetchCoupons();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la modification'
        : 'Erreur lors de la modification';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedCoupon) return;
    try {
      await api.post(`/api/super-admin/coupons/${selectedCoupon.id}/cancel`);
      setShowCancelModal(false);
      fetchCoupons();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erreur lors de l'annulation"
        : "Erreur lors de l'annulation";
      alert(msg);
    }
  };

  const handleViewDetail = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailModal(true);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      coupon.code.toLowerCase().includes(term) ||
      coupon.parent?.name.toLowerCase().includes(term) ||
      coupon.student?.name.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Ticket className="h-7 w-7 text-red-500" />
            Gestion des Coupons
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              SUPER ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Modifier, annuler et gérer tous les coupons</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30"
          >
            <Plus className="h-5 w-5" />
            Créer Coupon
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par code, parent, élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'available', 'used', 'expired', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-linear-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tous' : statusConfig[status as Coupon['status']]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">
            {coupons.filter((c) => c.status === 'available').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Utilisés</p>
          <p className="text-2xl font-bold text-blue-600">
            {coupons.filter((c) => c.status === 'used').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Expirés/Annulés</p>
          <p className="text-2xl font-bold text-red-600">
            {coupons.filter((c) => c.status === 'expired' || c.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Niveau / Matière</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Parent / Élève</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Expiration</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => {
                const config = statusConfig[coupon.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-gray-900">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{coupon.grade?.name ?? '—'}</p>
                      <p className="text-xs text-gray-500">{coupon.subject?.name ?? '—'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.parent ? (
                        <div>
                          <p className="font-medium text-gray-900">{coupon.parent.name}</p>
                          <p className="text-xs text-gray-500">
                            {coupon.student?.name ?? 'Élève non assigné'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{money(coupon.price_client)}</p>
                      <p className="text-xs text-gray-500">Agence: {money(coupon.agency_margin)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{dateOnly(coupon.expires_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(coupon)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {coupon.status !== 'cancelled' && coupon.status !== 'used' && (
                          <>
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="Modifier l'expiration"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(coupon)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Annuler"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun coupon trouvé</p>
          </div>
        )}
      </div>

      {/* ==================== CREATE MODAL (cascade) ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="h-6 w-6 text-red-500" />
                Créer des coupons
              </h2>
              <p className="text-sm text-gray-500 mt-1">Vente en agence — 1 coupon = 1 heure</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Étape 1 : Parent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">1</span>
                  Parent *
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sélectionner un parent...</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName?.trim() ? `${p.fullName} — ${p.email}` : p.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Étape 2 : Élève */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">2</span>
                  Élève *
                </label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  disabled={!selectedParentId || loadingChildren}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!selectedParentId
                      ? "Choisis d'abord un parent"
                      : loadingChildren
                        ? 'Chargement...'
                        : children.length === 0
                          ? 'Aucun enfant rattaché'
                          : 'Sélectionner un élève...'}
                  </option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                      {c.grade ? ` — ${c.grade.name}` : ' — (classe non renseignée)'}
                    </option>
                  ))}
                </select>

                {selectedChild && (
                  <div className="mt-2">
                    {selectedChild.grade ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Classe : {selectedChild.grade.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Aucune classe renseignée pour cet élève
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Étape 3 : Matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">3</span>
                  Matière *
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  disabled={!selectedChild?.grade}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!selectedChild?.grade ? "Choisis d'abord un élève" : 'Sélectionner une matière...'}
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarif automatique */}
              {loadingPrice && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
                  Recherche du tarif...
                </div>
              )}

              {priceError && !loadingPrice && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{priceError}. Crée d'abord ce tarif dans la grille tarifaire.</span>
                </div>
              )}

              {price && !loadingPrice && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-800">
                    Tarif appliqué : {price.hourly_rate.toFixed(2)} €/h
                  </p>
                  <div className="mt-1 text-xs text-green-700 space-y-0.5">
                    <p>Part professeur ({price.teacher_share}%) : {price.teacher_amount.toFixed(2)} €/h</p>
                    <p>Part agence ({price.agency_share}%) : {price.agency_amount.toFixed(2)} €/h</p>
                  </div>
                </div>
              )}

              {/* Étape 4 : Quantité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">4</span>
                  Quantité (nombre d'heures) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={!price}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Entre 1 et 50 coupons générés en une fois.</p>
              </div>

              {/* Total */}
              {price && quantity > 0 && (
                <div className="bg-gray-900 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Total ({quantity} h × {price.hourly_rate.toFixed(2)} €)
                    </span>
                    <span className="text-2xl font-bold">
                      {(price.hourly_rate * quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                disabled={creating}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateCoupon}
                disabled={creating || !price}
                className="flex-1 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT MODAL ==================== */}
      {showEditModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit className="h-6 w-6 text-orange-500" />
                Modifier l'expiration
              </h2>
              <p className="text-sm text-gray-500 mt-1">Code : {selectedCoupon.code}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                <input
                  type="date"
                  value={editForm.expiresAt}
                  onChange={(e) => setEditForm({ expiresAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CANCEL MODAL ==================== */}
      {showCancelModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Annuler ce coupon ?</h3>
              <p className="text-gray-500 mb-2">
                Code : <strong>{selectedCoupon.code}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Le coupon ne pourra plus être utilisé.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Non, garder
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Oui, annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Détails du coupon</h2>
              <p className="font-mono text-orange-600 mt-1">{selectedCoupon.code}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="text-lg font-bold text-gray-900">{selectedCoupon.status_label}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Montant client</p>
                  <p className="text-lg font-bold text-gray-900">{money(selectedCoupon.price_client)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Part professeur</p>
                  <p className="text-lg font-bold text-green-700">{money(selectedCoupon.price_teacher)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-orange-600">Part agence</p>
                  <p className="text-lg font-bold text-orange-700">{money(selectedCoupon.agency_margin)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Niveau</span>
                  <span className="font-medium">{selectedCoupon.grade?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Matière</span>
                  <span className="font-medium">{selectedCoupon.subject?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Parent</span>
                  <span className="font-medium">{selectedCoupon.parent?.name ?? 'Non assigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Élève</span>
                  <span className="font-medium">{selectedCoupon.student?.name ?? 'Non assigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Type d'achat</span>
                  <span className="font-medium">{selectedCoupon.purchase_type_label}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Créé le</span>
                  <span className="font-medium">{dateOnly(selectedCoupon.created_at)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Expire le</span>
                  <span className="font-medium">{dateOnly(selectedCoupon.expires_at)}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}