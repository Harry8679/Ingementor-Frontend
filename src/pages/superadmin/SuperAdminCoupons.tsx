import { useEffect, useState } from 'react';
import {
  Ticket,
  Search,
//   Filter,
//   MoreVertical,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
//   Download,
  Plus,
} from 'lucide-react';
import api from '../../services/api';

interface Coupon {
  id: number;
  code: string;
  status: 'available' | 'used' | 'expired' | 'cancelled';
  hours: number;
  remainingHours: number;
  totalPrice: string;
  teacherShare: string;
  agencyShare: string;
  parent: {
    id: number;
    fullName: string;
    email: string;
  } | null;
  student: {
    id: number;
    fullName: string;
  } | null;
  teacher: {
    id: number;
    fullName: string;
  } | null;
  expiresAt: string;
  createdAt: string;
}

const statusConfig = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  used: { label: 'Utilisé', color: 'bg-blue-100 text-blue-700', icon: Clock },
  expired: { label: 'Expiré', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function SuperAdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    hours: 0,
    expiresAt: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/coupons');
      setCoupons(response.data.data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      // Mock data
      setCoupons([
        {
          id: 1,
          code: 'ING-ABC1-XYZ2',
          status: 'available',
          hours: 10,
          remainingHours: 10,
          totalPrice: '350,00 €',
          teacherShare: '262,50 €',
          agencyShare: '87,50 €',
          parent: { id: 1, fullName: 'Jean Dupont', email: 'jean@example.com' },
          student: { id: 1, fullName: 'Lucas Dupont' },
          teacher: { id: 1, fullName: 'Prof Martin' },
          expiresAt: '2026-12-31',
          createdAt: '2026-01-15',
        },
        {
          id: 2,
          code: 'ING-DEF3-GHI4',
          status: 'used',
          hours: 5,
          remainingHours: 2,
          totalPrice: '175,00 €',
          teacherShare: '131,25 €',
          agencyShare: '43,75 €',
          parent: { id: 2, fullName: 'Marie Martin', email: 'marie@example.com' },
          student: { id: 2, fullName: 'Emma Martin' },
          teacher: { id: 2, fullName: 'Prof Bernard' },
          expiresAt: '2026-06-30',
          createdAt: '2026-02-01',
        },
        {
          id: 3,
          code: 'ING-JKL5-MNO6',
          status: 'expired',
          hours: 8,
          remainingHours: 3,
          totalPrice: '280,00 €',
          teacherShare: '210,00 €',
          agencyShare: '70,00 €',
          parent: { id: 3, fullName: 'Pierre Durand', email: 'pierre@example.com' },
          student: null,
          teacher: null,
          expiresAt: '2026-01-01',
          createdAt: '2025-07-15',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({
      hours: coupon.hours,
      expiresAt: coupon.expiresAt,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCoupon) return;
    try {
      await api.put(`/api/super-admin/coupons/${selectedCoupon.id}`, editForm);
      setShowEditModal(false);
      fetchCoupons();
    } catch (err) {
      console.error('Error updating coupon:', err);
      alert('Erreur lors de la modification');
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
    } catch (err) {
      console.error('Error cancelling coupon:', err);
      alert('Erreur lors de l\'annulation');
    }
  };

  const handleViewDetail = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailModal(true);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.parent?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
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
          <p className="text-gray-500 mt-1">
            Modifier, annuler et gérer tous les coupons
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30">
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
          <div className="flex gap-2">
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
                {status === 'all' ? 'Tous' : statusConfig[status as keyof typeof statusConfig]?.label}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Heures</th>
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
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{coupon.remainingHours}</span>
                        <span className="text-gray-500">/{coupon.hours}h</span>
                      </div>
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-linear-to-r from-red-500 to-orange-500 rounded-full"
                          style={{ width: `${(coupon.remainingHours / coupon.hours) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.parent ? (
                        <div>
                          <p className="font-medium text-gray-900">{coupon.parent.fullName}</p>
                          <p className="text-xs text-gray-500">{coupon.parent.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{coupon.totalPrice}</p>
                      <p className="text-xs text-gray-500">Agence: {coupon.agencyShare}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{coupon.expiresAt}</span>
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
                        {coupon.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="Modifier"
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

      {/* Edit Modal */}
      {showEditModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit className="h-6 w-6 text-orange-500" />
                Modifier le coupon
              </h2>
              <p className="text-sm text-gray-500 mt-1">Code: {selectedCoupon.code}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'heures
                </label>
                <input
                  type="number"
                  value={editForm.hours}
                  onChange={(e) => setEditForm({ ...editForm, hours: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'expiration
                </label>
                <input
                  type="date"
                  value={editForm.expiresAt}
                  onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Les modifications seront enregistrées dans l'historique
                  et le parent sera notifié par email.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Annuler ce coupon ?
              </h3>
              <p className="text-gray-500 mb-2">
                Code: <strong>{selectedCoupon.code}</strong>
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

      {/* Detail Modal */}
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
                  <p className="text-sm text-gray-500">Heures</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedCoupon.remainingHours}/{selectedCoupon.hours}h
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Montant total</p>
                  <p className="text-xl font-bold text-gray-900">{selectedCoupon.totalPrice}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Part professeur (75%)</p>
                  <p className="text-lg font-bold text-green-700">{selectedCoupon.teacherShare}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-orange-600">Part agence (25%)</p>
                  <p className="text-lg font-bold text-orange-700">{selectedCoupon.agencyShare}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Parent</span>
                  <span className="font-medium">{selectedCoupon.parent?.fullName || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Élève</span>
                  <span className="font-medium">{selectedCoupon.student?.fullName || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Professeur</span>
                  <span className="font-medium">{selectedCoupon.teacher?.fullName || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Créé le</span>
                  <span className="font-medium">{selectedCoupon.createdAt}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Expire le</span>
                  <span className="font-medium">{selectedCoupon.expiresAt}</span>
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