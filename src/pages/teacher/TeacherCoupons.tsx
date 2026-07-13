import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  TicketIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  Aligné sur TeacherCouponController
//  GET  /api/teachers/me/coupons/search?code=...
//  POST /api/teachers/me/coupons/{id}/validate
//  GET  /api/teachers/me/coupons/validated
//  GET  /api/teachers/me/earnings
// ============================================================================

/** Certains endpoints renvoient {id, name}, d'autres une simple chaîne. */
type NameOrObject = string | { id?: number; name?: string } | null | undefined;

interface CouponFound {
  id: number;
  code: string;
  status: 'available' | 'used' | 'expired' | 'cancelled';
  status_label: string;
  student: NameOrObject;
  subject: NameOrObject;
  grade: NameOrObject;
  price_teacher: number;
  expires_at: string | null;
  days_until_expiration: number;
}

interface ValidatedCoupon {
  id: number;
  code: string;
  student?: NameOrObject;
  subject?: NameOrObject;
  grade?: NameOrObject;
  price_teacher?: number | string;
  used_at?: string | null;
}

/** Rend une valeur affichable, qu'elle soit une chaîne ou un objet {id, name}. */
const label = (value: NameOrObject): string => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.name) return String(value.name);
  return '—';
};

/** Convertit en nombre sûr (l'API peut renvoyer une chaîne décimale). */
const num = (value: number | string | undefined | null): number => {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const TeacherCoupons: React.FC = () => {
  const [code, setCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [coupon, setCoupon] = useState<CouponFound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [validated, setValidated] = useState<ValidatedCoupon[]>([]);
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [v, e] = await Promise.all([
        api.get('/api/teachers/me/coupons/validated'),
        api.get('/api/teachers/me/earnings'),
      ]);

      const list = v.data?.data ?? v.data?.coupons ?? [];
      setValidated(Array.isArray(list) ? list : []);

      const raw = e.data?.data ?? e.data ?? {};
      const total =
        raw?.total_to_pay ?? raw?.pending ?? raw?.total ?? raw?.amount ?? 0;
      setEarnings(num(total));
    } catch (err) {
      console.error('Erreur chargement coupons:', err);
      setValidated([]);
    } finally {
      setLoading(false);
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
      const credited = num(res.data?.data?.price_teacher);
      setSuccess(
        `${res.data?.message ?? 'Coupon validé'} — ${credited.toFixed(2)} € crédités.`,
      );
      setCoupon(null);
      setCode('');
      loadData();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Blobs décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex relative z-10">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
              <TicketIcon className="h-10 w-10 text-blue-600" />
              Valider un coupon 🎫
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Saisis le code que le parent te remet après le cours
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">À percevoir</p>
                  <p className="text-4xl font-black text-gray-900">
                    {earnings.toFixed(2)}€
                  </p>
                  <p className="text-xs text-emerald-600 font-bold mt-2">Ce mois-ci</p>
                </div>
                <div className="bg-linear-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl">
                  <CurrencyEuroIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">Coupons validés</p>
                  <p className="text-4xl font-black text-gray-900">{validated.length}</p>
                  <p className="text-xs text-blue-600 font-bold mt-2">Total</p>
                </div>
                <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                  <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">Heures données</p>
                  <p className="text-4xl font-black text-gray-900">{validated.length}</p>
                  <p className="text-xs text-purple-600 font-bold mt-2">1 coupon = 1h</p>
                </div>
                <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <ClockIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Saisie du code */}
          <Card>
            <div className="p-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Code du coupon
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="ING-XXXX-XXXX"
                    className="w-full rounded-2xl border-2 border-gray-200 py-4 pl-12 pr-4 font-mono text-lg font-bold tracking-widest uppercase focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 border-2 border-red-200 p-4">
                  <XCircleIcon className="h-6 w-6 text-red-600 shrink-0" />
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-green-50 border-2 border-green-200 p-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 shrink-0" />
                  <p className="text-sm font-bold text-green-700">{success}</p>
                </div>
              )}

              {/* Coupon trouvé */}
              {coupon && (
                <div className="mt-6 rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-2xl font-black text-gray-900 tracking-wider">
                        {coupon.code}
                      </p>
                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold ${
                          coupon.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {coupon.status === 'available' ? (
                          <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                          <ExclamationTriangleIcon className="h-4 w-4" />
                        )}
                        {coupon.status_label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-600">Ta part</p>
                      <p className="text-4xl font-black text-emerald-600">
                        {num(coupon.price_teacher).toFixed(2)}€
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-blue-200 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-br from-pink-500 to-rose-500 p-2 rounded-xl">
                        <AcademicCapIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Élève</p>
                        <p className="font-black text-gray-900">{label(coupon.student)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
                        <BookOpenIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Matière / Niveau</p>
                        <p className="font-black text-gray-900">
                          {label(coupon.subject)}
                          {coupon.grade ? ` · ${label(coupon.grade)}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-br from-orange-500 to-amber-500 p-2 rounded-xl">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Expire le</p>
                        <p className="font-black text-gray-900">
                          {coupon.expires_at ?? '—'}
                          {coupon.days_until_expiration >= 0 &&
                            coupon.days_until_expiration <= 7 && (
                              <span className="ml-2 text-xs text-orange-600">
                                (dans {coupon.days_until_expiration} j)
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleValidate}
                    disabled={!canValidate || validating}
                    className="mt-6 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 font-black text-white text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {validating
                      ? 'Validation...'
                      : canValidate
                        ? '✓ Valider ce coupon'
                        : 'Ce coupon ne peut pas être validé'}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Coupons validés */}
          <div className="mt-8">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <CheckCircleIcon className="h-7 w-7 text-emerald-500" />
                  Mes coupons validés ({validated.length})
                </h2>
                <button
                  onClick={loadData}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Actualiser
                </button>
              </div>

              {validated.length === 0 ? (
                <div className="py-16 text-center">
                  <TicketIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="text-gray-500 font-bold">
                    Aucun coupon validé pour le moment
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Saisis le code d'un coupon ci-dessus pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {validated.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-2xl bg-linear-to-r from-gray-50 to-slate-50 p-4 hover:from-blue-50 hover:to-indigo-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-linear-to-br from-emerald-500 to-teal-500 p-3 rounded-2xl">
                          <TicketIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-mono font-black text-gray-900 tracking-wide">
                            {c.code}
                          </p>
                          <p className="text-sm text-gray-600 font-bold">
                            {label(c.student)}
                            {c.subject ? ` · ${label(c.subject)}` : ''}
                          </p>
                        </div>
                      </div>
                      <p className="text-xl font-black text-emerald-600">
                        {num(c.price_teacher).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherCoupons;