import { useEffect, useState } from 'react';
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

interface PricingTier {
  id: number;
  gradeLevel: string;
  gradeName: string;
  hourlyRate: number;
  teacherShare: number; // percentage
  agencyShare: number; // percentage
  isActive: boolean;
}

export default function SuperAdminPricing() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    gradeLevel: '',
    gradeName: '',
    hourlyRate: 35,
    teacherShare: 75,
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/pricing');
      setPricingTiers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      // Mock data
      setPricingTiers([
        { id: 1, gradeLevel: '6eme', gradeName: '6ème', hourlyRate: 30, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 2, gradeLevel: '5eme', gradeName: '5ème', hourlyRate: 30, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 3, gradeLevel: '4eme', gradeName: '4ème', hourlyRate: 32, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 4, gradeLevel: '3eme', gradeName: '3ème', hourlyRate: 35, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 5, gradeLevel: '2nde', gradeName: 'Seconde', hourlyRate: 38, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 6, gradeLevel: '1ere', gradeName: 'Première', hourlyRate: 40, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 7, gradeLevel: 'term', gradeName: 'Terminale', hourlyRate: 45, teacherShare: 75, agencyShare: 25, isActive: true },
        { id: 8, gradeLevel: 'sup', gradeName: 'Supérieur', hourlyRate: 50, teacherShare: 70, agencyShare: 30, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tier: PricingTier) => {
    setEditingId(tier.id);
    setFormData({
      gradeLevel: tier.gradeLevel,
      gradeName: tier.gradeName,
      hourlyRate: tier.hourlyRate,
      teacherShare: tier.teacherShare,
    });
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/api/super-admin/pricing/${id}`, {
        hourlyRate: formData.hourlyRate,
        teacherShare: formData.teacherShare,
      });
      setEditingId(null);
      fetchPricing();
    } catch (err) {
      console.error('Error saving pricing:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/api/super-admin/pricing', formData);
      setShowCreateModal(false);
      setFormData({ gradeLevel: '', gradeName: '', hourlyRate: 35, teacherShare: 75 });
      fetchPricing();
    } catch (err) {
      console.error('Error creating pricing:', err);
      alert('Erreur lors de la création');
    }
  };

  const handleDelete = async () => {
    if (!selectedTier) return;
    try {
      await api.delete(`/api/super-admin/pricing/${selectedTier.id}`);
      setShowDeleteModal(false);
      setSelectedTier(null);
      fetchPricing();
    } catch (err) {
      console.error('Error deleting pricing:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const calculatePrices = (hourlyRate: number, teacherShare: number, hours: number = 10) => {
    const total = hourlyRate * hours;
    const teacher = (total * teacherShare) / 100;
    const agency = total - teacher;
    return { total, teacher, agency };
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
              SUPER ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Configurer les tarifs par niveau scolaire
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30"
        >
          <Plus className="h-5 w-5" />
          Nouveau tarif
        </button>
      </div>

      {/* Info box */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Répartition des revenus</h3>
            <p className="text-green-700 mt-1">
              Par défaut : <strong>75%</strong> pour le professeur, <strong>25%</strong> pour l'agence.
              Ce ratio peut être ajusté par niveau.
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Niveau</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tarif/heure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Part Prof</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Part Agence</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Exemple 10h</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pricingTiers.map((tier) => {
                const isEditing = editingId === tier.id;
                const prices = calculatePrices(
                  isEditing ? formData.hourlyRate : tier.hourlyRate,
                  isEditing ? formData.teacherShare : tier.teacherShare
                );

                return (
                  <tr key={tier.id} className={isEditing ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{tier.gradeName}</p>
                        <p className="text-xs text-gray-500">{tier.gradeLevel}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                            className="w-20 px-3 py-1 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            min={1}
                            step={0.5}
                          />
                          <span className="text-gray-500">€</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">{tier.hourlyRate} €</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.teacherShare}
                            onChange={(e) => setFormData({ ...formData, teacherShare: parseInt(e.target.value) })}
                            className="w-16 px-3 py-1 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            min={50}
                            max={90}
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {tier.teacherShare}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {isEditing ? 100 - formData.teacherShare : tier.agencyShare}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Total: {prices.total} €</p>
                        <p className="text-green-600">Prof: {prices.teacher.toFixed(2)} €</p>
                        <p className="text-orange-600">Agence: {prices.agency.toFixed(2)} €</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tier.isActive ? (
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
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
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
      </div>

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code niveau
                </label>
                <input
                  type="text"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="ex: 6eme, term, sup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du niveau
                </label>
                <input
                  type="text"
                  value={formData.gradeName}
                  onChange={(e) => setFormData({ ...formData, gradeName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="ex: 6ème, Terminale, Supérieur"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarif horaire (€)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    min={1}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Part professeur (%)
                  </label>
                  <input
                    type="number"
                    value={formData.teacherShare}
                    onChange={(e) => setFormData({ ...formData, teacherShare: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    min={50}
                    max={90}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  Aperçu pour 10h : <strong>{formData.hourlyRate * 10} €</strong>
                </p>
                <p className="text-sm text-green-600">
                  Prof: {((formData.hourlyRate * 10 * formData.teacherShare) / 100).toFixed(2)} €
                </p>
                <p className="text-sm text-orange-600">
                  Agence: {((formData.hourlyRate * 10 * (100 - formData.teacherShare)) / 100).toFixed(2)} €
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg"
              >
                Créer
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Supprimer ce tarif ?
              </h3>
              <p className="text-gray-500 mb-6">
                Niveau: <strong>{selectedTier.gradeName}</strong><br />
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