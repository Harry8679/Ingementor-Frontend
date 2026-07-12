import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Ticket,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Euro,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';

// ---- Aligné sur TeacherCouponController ----
// GET  /api/teachers/me/coupons/search?code=...   → { success, data: {...} }
// POST /api/teachers/me/coupons/{id}/validate     → { success, message, data: {...} }
// GET  /api/teachers/me/coupons/validated         → coupons déjà validés
// GET  /api/teachers/me/earnings                  → total à percevoir

interface CouponFound {
  id: number;
  code: string;
  status: 'available' | 'used' | 'expired' | 'cancelled';
  status_label: string;
  student: { id: number; name: string } | null;
  subject: string | null;
  grade: string | null;
  price_teacher: number;
  expires_at: string | null;
  days_until_expiration: number;
}

interface ValidatedCoupon {
  id: number;
  code: string;
  student?: string | null;
  subject?: string | null;
  price_teacher?: number;
  used_at?: string | null;
}

export default function TeacherCoupons() {
  const [code, setCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [validating, setValidating] = useState(false);

  const [coupon, setCoupon] = useState<CouponFound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [validated, setValidated] = useState<ValidatedCoupon[]>([]);
  const [earnings, setEarnings] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchValidated();
  }, []);

  const fetchValidated = async () => {
    try {
      setLoadingList(true);
      const [v, e] = await Promise.all([
        api.get('/api/teachers/me/coupons/validated'),
        api.get('/api/teachers/me/earnings'),
      ]);
      setValidated(v.data.data || []);
      // Le format exact des earnings peut varier : on tente plusieurs clés
      const raw = e.data.data ?? e.data;
      const total =
        raw?.total_to_pay ?? raw?.pending ?? raw?.total ?? raw?.amount ?? null;
      setEarnings(total !== null ? Number(total) : null);
    } catch (err) {
      console.error('Erreur chargement coupons validés:', err);
      setValidated([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearch = async () => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned.length < 4) {
      setError('Le code doit contenir au moins 4 caractères.');
      return;
    }

    setSearching(true);
    setError(null);
    setSuccess(null);
    setCoupon(null);

    try {
      const res = await api.get('/api/teachers/me/coupons/search', {
        params: { code: cleaned },
      });
      setCoupon(res.data.data);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Coupon introuvable'
        : 'Coupon introuvable';
      setError(msg);
    } finally {
      setSearching(false);
    }
  };

  const handleValidate = async () => {
    if (!coupon) return;

    setValidating(true);
    setError(null);

    try {
      const res = await api.post(`/api/teachers/me/coupons/${coupon.id}/validate`);
      setSuccess(
        `${res.data.message} — ${res.data.data.price_teacher.toFixed(2)} € crédités.`,
      );
      setCoupon(null);
      setCode('');
      fetchValidated();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Erreur lors de la validation'
        : 'Erreur lors de la validation';
      setError(msg);
    } finally {
      setValidating(false);
    }
  };

  const canValidate = coupon?.status === 'available';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Ticket className="h-7 w-7 text-blue-500" />
          Valider un coupon
        </h1>
        <p className="text-gray-500 mt-1">
          Saisis le code que le parent te remet après le cours.
        </p>
      </div>

      {/* Total à percevoir */}
      {earnings !== null && (
        <div className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-50">À percevoir ce mois</p>
              <p className="mt-1 text-4xl font-bold">{earnings.toFixed(2)} €</p>
            </div>
            <Euro className="h-12 w-12 text-emerald-200" />
          </div>
        </div>
      )}

      {/* Saisie du code */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Code du coupon
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ING-XXXX-XXXX"
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 font-mono text-lg tracking-wider uppercase focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="rounded-xl bg-linear-to-r from-blue-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {searching ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Coupon trouvé */}
        {coupon && (
          <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xl font-bold text-gray-900">{coupon.code}</p>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    coupon.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {coupon.status === 'available' ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {coupon.status_label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Ta part</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {coupon.price_teacher.toFixed(2)} €
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-blue-200 pt-4 text-sm">
              <div>
                <p className="text-gray-500">Élève</p>
                <p className="font-medium text-gray-900">
                  {coupon.student?.name ?? 'Non assigné'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Niveau</p>
                <p className="font-medium text-gray-900">{coupon.grade ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Matière</p>
                <p className="font-medium text-gray-900">{coupon.subject ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Expire le</p>
                <p className="font-medium text-gray-900">
                  {coupon.expires_at ?? '—'}
                  {coupon.days_until_expiration >= 0 && coupon.days_until_expiration <= 7 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="h-3 w-3" />
                      {coupon.days_until_expiration} j
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleValidate}
              disabled={!canValidate || validating}
              className="mt-6 w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 font-medium text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {validating
                ? 'Validation...'
                : canValidate
                  ? 'Valider ce coupon'
                  : 'Ce coupon ne peut pas être validé'}
            </button>
          </div>
        )}
      </div>

      {/* Coupons validés */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Mes coupons validés ({validated.length})
          </h2>
          <button
            onClick={fetchValidated}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>

        {loadingList ? (
          <div className="p-6">
            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
          </div>
        ) : validated.length === 0 ? (
          <div className="py-12 text-center">
            <Ticket className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Aucun coupon validé pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Élève</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Matière</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {validated.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{c.code}</td>
                    <td className="px-6 py-4 text-gray-700">{c.student ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{c.subject ?? '—'}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {c.price_teacher !== undefined ? `${c.price_teacher.toFixed(2)} €` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}