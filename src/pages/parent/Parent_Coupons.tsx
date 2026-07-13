import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  ArrowPathIcon,
  CurrencyEuroIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  Aligné sur ParentCouponController::listCoupons
//  GET /api/parents/me/coupons  → { success, data: [...], total }
// ============================================================================

interface ParentCoupon {
  id: number;
  code: string;
  status: 'available' | 'used' | 'expired' | 'cancelled';
  statusLabel: string;
  statusColor: string;
  child: { id: number | null; name: string | null };
  subject: string | null;
  grade: string | null;
  priceClient: number;
  expiresAt: string | null;
  daysUntilExpiration: number;
  usedAt: string | null;
  teacher: string | null;
  createdAt: string | null;
}

type Filter = 'all' | 'available' | 'used' | 'expired';

const statusStyles: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  used: 'bg-blue-100 text-blue-700',
  expired: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Parent_Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<ParentCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/parents/me/coupons');
      setCoupons(res.data.data || []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos coupons.'
        : 'Impossible de charger vos coupons.';
      setError(msg);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const available = coupons.filter((c) => c.status === 'available');
    const used = coupons.filter((c) => c.status === 'used');
    const remainingValue = available.reduce((sum, c) => sum + (c.priceClient || 0), 0);
    return { available: available.length, used: used.length, remainingValue };
  }, [coupons]);

  // Filtrage
  const filtered = useMemo(
    () => (filter === 'all' ? coupons : coupons.filter((c) => c.status === filter)),
    [coupons, filter],
  );

  // Regroupement par enfant
  const grouped = useMemo(() => {
    const map = new Map<string, ParentCoupon[]>();
    filtered.forEach((c) => {
      const key = c.child?.name ?? 'Élève non assigné';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center p-8">
            <Spinner />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob print:hidden"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 print:hidden"></div>

      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="flex relative z-10">
        <div className="print:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                <TicketIcon className="h-10 w-10 text-pink-500" />
                Mes Coupons 🎫
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Donnez le code au professeur après chaque cours
              </p>
            </div>
            <div className="flex gap-3 print:hidden">
              <button
                onClick={fetchCoupons}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Actualiser
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all"
              >
                <PrinterIcon className="h-5 w-5" />
                Imprimer
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-red-700">{error}</p>
                <button
                  onClick={fetchCoupons}
                  className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">Disponibles</p>
                  <p className="text-4xl font-black text-gray-900">{stats.available}</p>
                  <p className="text-xs text-green-600 font-bold mt-2">1 coupon = 1 heure</p>
                </div>
                <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                  <TicketIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">Utilisés</p>
                  <p className="text-4xl font-black text-gray-900">{stats.used}</p>
                  <p className="text-xs text-blue-600 font-bold mt-2">Cours effectués</p>
                </div>
                <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                  <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">Valeur restante</p>
                  <p className="text-4xl font-black text-gray-900">
                    {stats.remainingValue.toFixed(2)}€
                  </p>
                  <p className="text-xs text-purple-600 font-bold mt-2">Crédit disponible</p>
                </div>
                <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <CurrencyEuroIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-8 print:hidden">
            {([
              ['all', 'Tous'],
              ['available', 'Disponibles'],
              ['used', 'Utilisés'],
              ['expired', 'Expirés'],
            ] as [Filter, string][]).map(([value, txt]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-colors ${
                  filter === value
                    ? 'bg-linear-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {txt}
              </button>
            ))}
          </div>

          {/* Liste des coupons */}
          {filtered.length === 0 ? (
            <Card>
              <div className="py-16 text-center">
                <TicketIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                <p className="font-bold text-gray-500">Aucun coupon</p>
                <p className="text-sm text-gray-400 mt-1">
                  Vos coupons apparaîtront ici après un achat en agence ou en ligne.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-10">
              {grouped.map(([childName, childCoupons]) => (
                <div key={childName}>
                  {/* Nom de l'enfant */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-linear-to-br from-pink-500 to-rose-500 p-2 rounded-xl">
                      <AcademicCapIcon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">{childName}</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      {childCoupons.length} coupon{childCoupons.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Tickets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {childCoupons.map((c) => (
                      <div
                        key={c.id}
                        className={`relative overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-sm print:break-inside-avoid ${
                          c.status === 'available'
                            ? 'border-green-300'
                            : 'border-gray-200 opacity-75'
                        }`}
                      >
                        {/* Encoches de ticket */}
                        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-pink-50 print:hidden"></div>
                        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-pink-50 print:hidden"></div>

                        <div className="flex items-start justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              statusStyles[c.status] ?? 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {c.status === 'available' ? (
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                            ) : c.status === 'used' ? (
                              <ClockIcon className="h-3.5 w-3.5" />
                            ) : (
                              <XCircleIcon className="h-3.5 w-3.5" />
                            )}
                            {c.statusLabel}
                          </span>
                          <p className="text-2xl font-black text-gray-900">
                            {c.priceClient.toFixed(2)}€
                          </p>
                        </div>

                        {/* LE CODE — l'élément principal */}
                        <div className="my-6 rounded-2xl bg-linear-to-r from-gray-50 to-slate-50 py-5 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            Code à donner au professeur
                          </p>
                          <p className="font-mono text-3xl font-black tracking-widest text-gray-900">
                            {c.code}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t-2 border-dashed border-gray-200 pt-4 text-sm">
                          <div>
                            <p className="font-black text-gray-900">
                              {c.subject ?? '—'}
                            </p>
                            <p className="text-gray-500 font-bold">{c.grade ?? '—'}</p>
                          </div>
                          <div className="text-right">
                            {c.status === 'used' ? (
                              <>
                                <p className="text-xs font-bold text-gray-400">Validé par</p>
                                <p className="font-bold text-gray-700">{c.teacher ?? '—'}</p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs font-bold text-gray-400">Expire le</p>
                                <p className="font-bold text-gray-700">
                                  {c.expiresAt ?? '—'}
                                </p>
                                {c.daysUntilExpiration >= 0 &&
                                  c.daysUntilExpiration <= 30 && (
                                    <p className="text-xs font-bold text-orange-600 mt-0.5">
                                      dans {c.daysUntilExpiration} jours
                                    </p>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Parent_Coupons;