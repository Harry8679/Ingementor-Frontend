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

// ---- Types alignés sur AdminCouponController::serializeCoupon ----

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

interface RefItem {
  id: number;
  name: string;
}
interface ParentRef {
  id: number;
  fullName: string;
  email: string;
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

  // Edit (uniquement la date d'expiration : 1 coupon = 1h, pas d'heures à changer)
  const [editForm, setEditForm] = useState({ expiresAt: '' });
  const [saving, setSaving] = useState(false);

  // Création
  const [creating, setCreating] = useState(false);
  const [parents, setParents] = useState<ParentRef[]>([]);
  const [grades, setGrades] = useState<RefItem[]>([]);
  const [subjects, setSubjects] = useState<RefItem[]>([]);
  const [createForm, setCreateForm] = useState({
    parent_id: '',
    grade_id: '',
    subject_id: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Charge les listes déroulantes quand la modale de création s'ouvre
  useEffect(() => {
    if (!showCreateModal) return;
    const loadRefs = async () => {
      try {
        const [p, g, s] = await Promise.all([
          api.get('/api/admin/parents'),
          api.get('/api/admin/stats/grades'),
          api.get('/api/admin/stats/subjects'),
        ]);
        setParents(p.data.data || []);
        setGrades(g.data.data || []);
        setSubjects(s.data.data || []);
      } catch (err) {
        console.error('Erreur chargement listes:', err);
      }
    };
    loadRefs();
  }, [showCreateModal]);

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

  // ---- Édition (date d'expiration) ----

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

  // ---- Annulation ----

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

  // ---- Création ----

  const handleCreateCoupon = async () => {
    if (!createForm.parent_id || !createForm.grade_id || !createForm.subject_id) {
      alert('Parent, niveau et matière sont obligatoires.');
      return;
    }
    setCreating(true);
    try {
      const res = await api.post('/api/admin/coupons/create', {
        parent_id: Number(createForm.parent_id),
        grade_id: Number(createForm.grade_id),
        subject_id: Number(createForm.subject_id),
        quantity: Number(createForm.quantity),
      });
      alert(res.data.message);
      setShowCreateModal(false);
      setCreateForm({ parent_id: '', grade_id: '', subject_id: '', quantity: 1 });
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

  // ---- Filtrage ----

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
                {status === 'all'
                  ? 'Tous'
                  : statusConfig[status as Coupon['status']]?.label}
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

      {/* Coupons table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Niveau / Matière</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Parent</th>
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
                          <p className="text-xs text-gray-500">{coupon.parent.email}</p>
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

      {/* ==================== CREATE MODAL ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="h-6 w-6 text-red-500" />
                Créer des coupons
              </h2>
              <p className="text-sm text-gray-500 mt-1">Vente en agence — 1 coupon = 1 heure</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent *</label>
                <select
                  value={createForm.parent_id}
                  onChange={(e) => setCreateForm({ ...createForm, parent_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sélectionner un parent...</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} — {p.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                  <select
                    value={createForm.grade_id}
                    onChange={(e) => setCreateForm({ ...createForm, grade_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité (nombre d'heures) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={createForm.quantity}
                  onChange={(e) => setCreateForm({ ...createForm, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">Entre 1 et 50 coupons générés en une fois.</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                Un tarif doit exister pour ce couple niveau/matière, sinon la création échoue.
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
                onClick={handleCreateCoupon}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
              >
                {creating ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT MODAL (expiration) ==================== */}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
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