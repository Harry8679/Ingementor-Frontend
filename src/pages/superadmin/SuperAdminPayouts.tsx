import { useEffect, useState } from 'react';
import {
//   CreditCard,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Send,
  Eye,
  RefreshCw,
  Banknote,
} from 'lucide-react';
import api from '../../services/api';

interface TeacherPayout {
  id: number;
  teacher: {
    id: number;
    fullName: string;
    email: string;
    iban?: string;
    bic?: string;
    bankName?: string;
  };
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  couponCode: string;
  hoursWorked: number;
  lessonDate: string;
  createdAt: string;
  paidAt?: string;
  transactionRef?: string;
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  completed: { label: 'Payé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  failed: { label: 'Échoué', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function SuperAdminPayouts() {
  const [payouts, setPayouts] = useState<TeacherPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayout, setSelectedPayout] = useState<TeacherPayout | null>(null);
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processingBatch, setProcessingBatch] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/super-admin/payouts');
      setPayouts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching payouts:', err);
      // Mock data
      setPayouts([
        {
          id: 1,
          teacher: {
            id: 1,
            fullName: 'Prof Martin',
            email: 'martin@example.com',
            iban: 'FR76 1234 5678 9012 3456 7890 123',
            bic: 'BNPAFRPP',
            bankName: 'BNP Paribas',
          },
          amount: 78.75,
          status: 'pending',
          couponCode: 'ING-ABC1-XYZ2',
          hoursWorked: 3,
          lessonDate: '2026-05-20',
          createdAt: '2026-05-21',
        },
        {
          id: 2,
          teacher: {
            id: 2,
            fullName: 'Prof Bernard',
            email: 'bernard@example.com',
            iban: 'FR76 9876 5432 1098 7654 3210 987',
            bic: 'CRLYFRPP',
            bankName: 'Crédit Lyonnais',
          },
          amount: 131.25,
          status: 'pending',
          couponCode: 'ING-DEF3-GHI4',
          hoursWorked: 5,
          lessonDate: '2026-05-19',
          createdAt: '2026-05-20',
        },
        {
          id: 3,
          teacher: {
            id: 1,
            fullName: 'Prof Martin',
            email: 'martin@example.com',
            iban: 'FR76 1234 5678 9012 3456 7890 123',
            bic: 'BNPAFRPP',
            bankName: 'BNP Paribas',
          },
          amount: 52.50,
          status: 'completed',
          couponCode: 'ING-OLD1-OLD2',
          hoursWorked: 2,
          lessonDate: '2026-05-10',
          createdAt: '2026-05-11',
          paidAt: '2026-05-15',
          transactionRef: 'VIR-2026-0001',
        },
        {
          id: 4,
          teacher: {
            id: 3,
            fullName: 'Prof Durand',
            email: 'durand@example.com',
          },
          amount: 105.00,
          status: 'pending',
          couponCode: 'ING-NEW1-NEW2',
          hoursWorked: 4,
          lessonDate: '2026-05-22',
          createdAt: '2026-05-23',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPayout = (id: number) => {
    setSelectedPayouts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const pendingIds = payouts.filter((p) => p.status === 'pending').map((p) => p.id);
    if (selectedPayouts.length === pendingIds.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(pendingIds);
    }
  };

  const handleProcessBatch = async () => {
    setProcessingBatch(true);
    try {
      await api.post('/api/super-admin/payouts/batch', {
        payoutIds: selectedPayouts,
      });
      setShowConfirmModal(false);
      setSelectedPayouts([]);
      fetchPayouts();
    } catch (err) {
      console.error('Error processing batch:', err);
      alert('Erreur lors du traitement');
    } finally {
      setProcessingBatch(false);
    }
  };

  const handleProcessSingle = async (payout: TeacherPayout) => {
    try {
      await api.post(`/api/super-admin/payouts/${payout.id}/process`);
      fetchPayouts();
    } catch (err) {
      console.error('Error processing payout:', err);
      alert('Erreur lors du traitement');
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.couponCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingTotal = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const selectedTotal = payouts
    .filter((p) => selectedPayouts.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

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
            <Banknote className="h-7 w-7 text-red-500" />
            Paiements Professeurs
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              SUPER ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Valider et traiter les paiements des professeurs
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchPayouts}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export SEPA
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total paiements</p>
          <p className="text-2xl font-bold text-gray-900">{payouts.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {payouts.filter((p) => p.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Montant en attente</p>
          <p className="text-2xl font-bold text-orange-600">{pendingTotal.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Payés ce mois</p>
          <p className="text-2xl font-bold text-green-600">
            {payouts.filter((p) => p.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Batch action bar */}
      {selectedPayouts.length > 0 && (
        <div className="bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">{selectedPayouts.length} paiement(s) sélectionné(s)</p>
              <p className="text-sm text-white/80">Montant total: {selectedTotal.toFixed(2)} €</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedPayouts([])}
              className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-white text-green-600 rounded-xl font-medium hover:bg-green-50"
            >
              <Send className="h-4 w-4 inline mr-2" />
              Traiter les paiements
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par professeur ou code coupon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'processing', 'completed', 'failed'].map((status) => (
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

      {/* Payouts table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.length === payouts.filter((p) => p.status === 'pending').length && selectedPayouts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Professeur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Coupon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Heures</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Banque</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayouts.map((payout) => {
                const config = statusConfig[payout.status];
                const StatusIcon = config.icon;
                const isSelected = selectedPayouts.includes(payout.id);
                const hasBankInfo = payout.teacher.iban && payout.teacher.bic;

                return (
                  <tr key={payout.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-green-50' : ''}`}>
                    <td className="px-6 py-4">
                      {payout.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectPayout(payout.id)}
                          className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{payout.teacher.fullName}</p>
                        <p className="text-xs text-gray-500">{payout.teacher.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-gray-900">{payout.amount.toFixed(2)} €</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-600">{payout.couponCode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{payout.hoursWorked}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasBankInfo ? (
                        <div className="text-sm">
                          <p className="text-gray-900">{payout.teacher.bankName}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            {payout.teacher.iban?.slice(-8)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          RIB manquant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedPayout(payout);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {payout.status === 'pending' && hasBankInfo && (
                          <button
                            onClick={() => handleProcessSingle(payout)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Traiter"
                          >
                            <Send className="h-4 w-4" />
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

        {filteredPayouts.length === 0 && (
          <div className="text-center py-12">
            <Banknote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement trouvé</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Détails du paiement</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-white font-medium">
                  {selectedPayout.teacher.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedPayout.teacher.fullName}</p>
                  <p className="text-sm text-gray-500">{selectedPayout.teacher.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Montant</p>
                  <p className="text-2xl font-bold text-green-700">{selectedPayout.amount.toFixed(2)} €</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Heures travaillées</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedPayout.hoursWorked}h</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Coupon</span>
                  <span className="font-mono font-medium">{selectedPayout.couponCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Date du cours</span>
                  <span className="font-medium">{selectedPayout.lessonDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedPayout.status].color}`}>
                    {statusConfig[selectedPayout.status].label}
                  </span>
                </div>
                {selectedPayout.paidAt && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Payé le</span>
                    <span className="font-medium text-green-600">{selectedPayout.paidAt}</span>
                  </div>
                )}
              </div>

              {selectedPayout.teacher.iban && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Coordonnées bancaires</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-blue-600">Banque:</span> {selectedPayout.teacher.bankName}</p>
                    <p><span className="text-blue-600">IBAN:</span> <span className="font-mono">{selectedPayout.teacher.iban}</span></p>
                    <p><span className="text-blue-600">BIC:</span> <span className="font-mono">{selectedPayout.teacher.bic}</span></p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedPayout.status === 'pending' && selectedPayout.teacher.iban && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleProcessSingle(selectedPayout);
                  }}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl"
                >
                  Traiter le paiement
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Batch Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirmer les paiements ?
              </h3>
              <p className="text-gray-500 mb-2">
                Vous êtes sur le point de traiter <strong>{selectedPayouts.length}</strong> paiement(s)
              </p>
              <p className="text-2xl font-bold text-green-600 mb-6">
                {selectedTotal.toFixed(2)} €
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={processingBatch}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleProcessBatch}
                  disabled={processingBatch}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl disabled:opacity-50"
                >
                  {processingBatch ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}