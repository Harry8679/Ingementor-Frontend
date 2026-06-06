import { useEffect, useState } from 'react';
import {
  CreditCard,
  Search,
  RefreshCw,
  Eye,
  Undo2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Filter,
} from 'lucide-react';
import api from '../../services/api';

interface Purchase {
  id: number;
  reference: string;
  status: 'completed' | 'pending' | 'refunded' | 'failed';
  amount: string;
  amountRaw: number;
  paymentMethod: 'stripe' | 'paypal' | 'agency';
  couponCode: string;
  hours: number;
  parent: {
    id: number;
    fullName: string;
    email: string;
  };
  createdAt: string;
  refundedAt?: string;
  refundReason?: string;
}

const statusConfig = {
  completed: { label: 'Payé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  refunded: { label: 'Remboursé', color: 'bg-purple-100 text-purple-700', icon: Undo2 },
  failed: { label: 'Échoué', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const paymentMethodLabels = {
  stripe: 'Carte bancaire',
  paypal: 'PayPal',
  agency: 'Agence',
};

export default function SuperAdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/purchases');
      setPurchases(response.data.data || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      // Mock data
      setPurchases([
        {
          id: 1,
          reference: 'CMD-2026-0001',
          status: 'completed',
          amount: '350,00 €',
          amountRaw: 350,
          paymentMethod: 'stripe',
          couponCode: 'ING-ABC1-XYZ2',
          hours: 10,
          parent: { id: 1, fullName: 'Jean Dupont', email: 'jean@example.com' },
          createdAt: '2026-05-15 14:30',
        },
        {
          id: 2,
          reference: 'CMD-2026-0002',
          status: 'completed',
          amount: '175,00 €',
          amountRaw: 175,
          paymentMethod: 'paypal',
          couponCode: 'ING-DEF3-GHI4',
          hours: 5,
          parent: { id: 2, fullName: 'Marie Martin', email: 'marie@example.com' },
          createdAt: '2026-05-14 10:15',
        },
        {
          id: 3,
          reference: 'CMD-2026-0003',
          status: 'refunded',
          amount: '280,00 €',
          amountRaw: 280,
          paymentMethod: 'stripe',
          couponCode: 'ING-JKL5-MNO6',
          hours: 8,
          parent: { id: 3, fullName: 'Pierre Durand', email: 'pierre@example.com' },
          createdAt: '2026-05-10 16:45',
          refundedAt: '2026-05-12 09:00',
          refundReason: 'Demande du client',
        },
        {
          id: 4,
          reference: 'CMD-2026-0004',
          status: 'pending',
          amount: '210,00 €',
          amountRaw: 210,
          paymentMethod: 'agency',
          couponCode: 'ING-PQR7-STU8',
          hours: 6,
          parent: { id: 4, fullName: 'Sophie Bernard', email: 'sophie@example.com' },
          createdAt: '2026-05-20 11:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async () => {
    if (!selectedPurchase || !refundReason.trim()) return;
    try {
      await api.post(`/api/super-admin/purchases/${selectedPurchase.id}/refund`, {
        reason: refundReason,
      });
      setShowRefundModal(false);
      fetchPurchases();
    } catch (err) {
      console.error('Error refunding purchase:', err);
      alert('Erreur lors du remboursement');
    }
  };

  const handleViewDetail = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.parent.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = purchases
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amountRaw, 0);

  const totalRefunded = purchases
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amountRaw, 0);

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
            <CreditCard className="h-7 w-7 text-red-500" />
            Gestion des Commandes
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              SUPER ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Consulter et rembourser les commandes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchPurchases}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">CA Total</p>
          <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Remboursements</p>
          <p className="text-2xl font-bold text-purple-600">{totalRefunded.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {purchases.filter((p) => p.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par référence, code coupon, parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'completed', 'pending', 'refunded', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Toutes' : statusConfig[status as keyof typeof statusConfig]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Purchases table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Référence</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Parent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Coupon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => {
                const config = statusConfig[purchase.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-gray-900">{purchase.reference}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.amount}</p>
                        <p className="text-xs text-gray-500">{paymentMethodLabels[purchase.paymentMethod]}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.parent.fullName}</p>
                        <p className="text-xs text-gray-500">{purchase.parent.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-600">{purchase.couponCode}</span>
                      <p className="text-xs text-gray-500">{purchase.hours}h</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{purchase.createdAt}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(purchase)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {purchase.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(purchase)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Rembourser"
                          >
                            <Undo2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPurchases.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Undo2 className="h-6 w-6 text-purple-500" />
                Rembourser la commande
              </h2>
              <p className="text-sm text-gray-500 mt-1">Réf: {selectedPurchase.reference}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Montant à rembourser</span>
                  <span className="text-2xl font-bold text-purple-700">{selectedPurchase.amount}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif du remboursement *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Ex: Demande du client, erreur de facturation..."
                  required
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Attention</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Le remboursement sera effectué via {paymentMethodLabels[selectedPurchase.paymentMethod]}</li>
                      <li>Le coupon associé sera automatiquement annulé</li>
                      <li>Le parent recevra une notification par email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRefund}
                disabled={!refundReason.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer le remboursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
              <p className="font-mono text-orange-600 mt-1">{selectedPurchase.reference}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="text-xl font-bold text-gray-900">{selectedPurchase.amount}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Heures</p>
                  <p className="text-xl font-bold text-gray-900">{selectedPurchase.hours}h</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedPurchase.status].color}`}>
                    {statusConfig[selectedPurchase.status].label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Moyen de paiement</span>
                  <span className="font-medium">{paymentMethodLabels[selectedPurchase.paymentMethod]}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Code coupon</span>
                  <span className="font-mono font-medium">{selectedPurchase.couponCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Parent</span>
                  <span className="font-medium">{selectedPurchase.parent.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-600">{selectedPurchase.parent.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Date de commande</span>
                  <span className="font-medium">{selectedPurchase.createdAt}</span>
                </div>
                {selectedPurchase.refundedAt && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Date de remboursement</span>
                      <span className="font-medium text-purple-600">{selectedPurchase.refundedAt}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Motif</span>
                      <span className="font-medium">{selectedPurchase.refundReason}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedPurchase.status === 'completed' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleRefund(selectedPurchase);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl"
                >
                  Rembourser
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}