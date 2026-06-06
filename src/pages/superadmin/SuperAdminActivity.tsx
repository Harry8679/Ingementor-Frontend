import { useEffect, useState } from 'react';
import {
  Activity,
  Search,
//   Filter,
  RefreshCw,
  User,
  Ticket,
  CreditCard,
//   Settings,
  UserCog,
  DollarSign,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import api from '../../services/api';

interface ActivityLog {
  id: number;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'refund' | 'payout';
  entity: 'user' | 'coupon' | 'purchase' | 'pricing' | 'admin' | 'payout' | 'auth';
  entityId?: number;
  description: string;
  user: {
    id: number;
    fullName: string;
    role: string;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

const actionTypeConfig = {
  create: { icon: Plus, color: 'text-green-600 bg-green-100' },
  update: { icon: Edit, color: 'text-blue-600 bg-blue-100' },
  delete: { icon: Trash2, color: 'text-red-600 bg-red-100' },
  view: { icon: Eye, color: 'text-gray-600 bg-gray-100' },
  login: { icon: LogIn, color: 'text-green-600 bg-green-100' },
  logout: { icon: LogOut, color: 'text-orange-600 bg-orange-100' },
  refund: { icon: CreditCard, color: 'text-purple-600 bg-purple-100' },
  payout: { icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
};

const entityConfig = {
  user: { icon: User, label: 'Utilisateur' },
  coupon: { icon: Ticket, label: 'Coupon' },
  purchase: { icon: CreditCard, label: 'Commande' },
  pricing: { icon: DollarSign, label: 'Tarif' },
  admin: { icon: UserCog, label: 'Admin' },
  payout: { icon: DollarSign, label: 'Paiement' },
  auth: { icon: LogIn, label: 'Auth' },
};

export default function SuperAdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityFilter, actionFilter]);

  const fetchLogs = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      const response = await api.get('/api/super-admin/activity', {
        params: {
          page: loadMore ? page + 1 : 1,
          entity: entityFilter !== 'all' ? entityFilter : undefined,
          action: actionFilter !== 'all' ? actionFilter : undefined,
        },
      });
      const newLogs = response.data.data || [];
      if (loadMore) {
        setLogs((prev) => [...prev, ...newLogs]);
        setPage((p) => p + 1);
      } else {
        setLogs(newLogs);
        setPage(1);
      }
      setHasMore(newLogs.length >= 20);
    } catch (err) {
      console.error('Error fetching logs:', err);
      // Mock data
      setLogs([
        {
          id: 1,
          action: 'Connexion réussie',
          actionType: 'login',
          entity: 'auth',
          description: 'Super Admin s\'est connecté',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 10:30:00',
        },
        {
          id: 2,
          action: 'Création admin',
          actionType: 'create',
          entity: 'admin',
          entityId: 3,
          description: 'Nouvel admin créé: Marie Dupont',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 10:35:00',
        },
        {
          id: 3,
          action: 'Modification coupon',
          actionType: 'update',
          entity: 'coupon',
          entityId: 45,
          description: 'Coupon ING-ABC1-XYZ2 modifié: heures 10→12',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 11:00:00',
        },
        {
          id: 4,
          action: 'Remboursement',
          actionType: 'refund',
          entity: 'purchase',
          entityId: 78,
          description: 'Commande CMD-2026-0003 remboursée: 280,00 €',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 11:30:00',
        },
        {
          id: 5,
          action: 'Paiement professeur',
          actionType: 'payout',
          entity: 'payout',
          entityId: 12,
          description: 'Paiement validé pour Prof Martin: 78,75 €',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 14:00:00',
        },
        {
          id: 6,
          action: 'Modification tarif',
          actionType: 'update',
          entity: 'pricing',
          entityId: 5,
          description: 'Tarif Seconde modifié: 38€/h → 40€/h',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-24 15:00:00',
        },
        {
          id: 7,
          action: 'Connexion réussie',
          actionType: 'login',
          entity: 'auth',
          description: 'Admin Principal s\'est connecté',
          user: { id: 2, fullName: 'Admin Principal', role: 'ROLE_ADMIN' },
          ipAddress: '192.168.1.105',
          createdAt: '2026-05-24 09:00:00',
        },
        {
          id: 8,
          action: 'Création coupon',
          actionType: 'create',
          entity: 'coupon',
          entityId: 50,
          description: 'Coupon ING-NEW1-NEW2 créé pour Sophie Bernard',
          user: { id: 2, fullName: 'Admin Principal', role: 'ROLE_ADMIN' },
          ipAddress: '192.168.1.105',
          createdAt: '2026-05-24 09:30:00',
        },
        {
          id: 9,
          action: 'Suppression admin',
          actionType: 'delete',
          entity: 'admin',
          entityId: 4,
          description: 'Admin Jean Test supprimé',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-23 16:00:00',
        },
        {
          id: 10,
          action: 'Déconnexion',
          actionType: 'logout',
          entity: 'auth',
          description: 'Super Admin s\'est déconnecté',
          user: { id: 1, fullName: 'Super Admin', role: 'ROLE_SUPER_ADMIN' },
          ipAddress: '192.168.1.100',
          createdAt: '2026-05-23 18:00:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && logs.length === 0) {
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
            <Activity className="h-7 w-7 text-red-500" />
            Journal d'Activité
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              SUPER ADMIN
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Historique de toutes les actions administratives
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchLogs()}
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

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Entité</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes</option>
              <option value="auth">Authentification</option>
              <option value="admin">Admin</option>
              <option value="coupon">Coupon</option>
              <option value="purchase">Commande</option>
              <option value="pricing">Tarif</option>
              <option value="payout">Paiement</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes</option>
              <option value="create">Création</option>
              <option value="update">Modification</option>
              <option value="delete">Suppression</option>
              <option value="login">Connexion</option>
              <option value="logout">Déconnexion</option>
              <option value="refund">Remboursement</option>
              <option value="payout">Paiement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const actionConfig = actionTypeConfig[log.actionType];
            const ActionIcon = actionConfig.icon;
            const entityInfo = entityConfig[log.entity];
            const EntityIcon = entityInfo.icon;

            return (
              <div
                key={log.id}
                className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${actionConfig.color}`}>
                  <ActionIcon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{log.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {/* User */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <User className="h-3.5 w-3.5" />
                      <span>{log.user.fullName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        log.user.role === 'ROLE_SUPER_ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {log.user.role === 'ROLE_SUPER_ADMIN' ? 'SA' : 'Admin'}
                      </span>
                    </div>

                    {/* Entity */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <EntityIcon className="h-3.5 w-3.5" />
                      <span>{entityInfo.label}</span>
                      {log.entityId && (
                        <span className="text-gray-400">#{log.entityId}</span>
                      )}
                    </div>

                    {/* IP */}
                    {log.ipAddress && (
                      <span className="text-xs text-gray-400 font-mono">
                        {log.ipAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité trouvée</p>
          </div>
        )}

        {hasMore && filteredLogs.length > 0 && (
          <div className="text-center pt-6">
            <button
              onClick={() => fetchLogs(true)}
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}