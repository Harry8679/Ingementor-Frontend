import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  UserCircleIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET /api/teachers/me  → profil À PLAT (pas d'enveloppe { success, data })
//  { id, email, firstName, lastName, fullName, phone, bio, experience,
//    rating, isVerified, userType, roles, createdAt }
//
//  PUT /api/teachers/me  → { firstName?, lastName?, phone?, bio?, experience? }
// ============================================================================

interface TeacherProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  bio: string | null;
  experience: string | null;
  rating: number | null;
  isVerified: boolean;
  createdAt: string | null;
}

const emptyForm = {
  firstName: '',
  lastName: '',
  phone: '',
  bio: '',
  experience: '',
};

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/teachers/me');
      // ⚠️ Réponse à plat : pas de res.data.data
      const data: TeacherProfile = res.data;
      setProfile(data);
      setForm({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        phone: data.phone ?? '',
        bio: data.bio ?? '',
        experience: data.experience ?? '',
      });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger le profil.'
        : 'Impossible de charger le profil.';
      setError(msg);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Le prénom et le nom sont obligatoires.');
      return;
    }

    setSaving(true);
    try {
      await api.put('/api/teachers/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        bio: form.bio,
        experience: form.experience,
      });
      setSuccess('Profil mis à jour avec succès.');
      setEditing(false);
      loadData();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.response?.data?.error ?? 'Erreur lors de la sauvegarde'
        : 'Erreur lors de la sauvegarde';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      phone: profile.phone ?? '',
      bio: profile.bio ?? '',
      experience: profile.experience ?? '',
    });
    setEditing(false);
    setError(null);
  };

  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex relative z-10">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mon Profil 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérer mes informations personnelles
                </p>
              </div>
              {!editing && profile && (
                <Button onClick={() => setEditing(true)}>
                  <PencilSquareIcon className="h-5 w-5 mr-2 inline" />
                  Modifier
                </Button>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <XCircleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <p className="font-bold text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-green-200 bg-green-50 p-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 shrink-0" />
                <p className="font-bold text-green-700">{success}</p>
              </div>
            )}

            {!profile ? (
              <Card>
                <div className="py-12 text-center">
                  <UserCircleIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">Impossible de charger le profil</p>
                  <button
                    onClick={loadData}
                    className="mt-4 rounded-2xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
                  >
                    Réessayer
                  </button>
                </div>
              </Card>
            ) : (
              <>
                {/* Carte identité */}
                <Card>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-indigo-500 text-4xl font-black text-white shadow-lg">
                      {initials}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <h2 className="text-3xl font-black text-gray-900">
                          {profile.fullName?.trim() || profile.email}
                        </h2>
                        {profile.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            <CheckBadgeIcon className="h-4 w-4" />
                            Vérifié
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 font-bold">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          {profile.email}
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-2 text-gray-600 font-bold">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            {profile.phone}
                          </div>
                        )}
                        {profile.rating !== null && profile.rating > 0 && (
                          <div className="flex items-center gap-2 text-yellow-600 font-bold">
                            <StarIcon className="h-4 w-4" />
                            {profile.rating.toFixed(1)}/5
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Formulaire / Informations */}
                <Card>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <BriefcaseIcon className="h-7 w-7 text-indigo-600" />
                    Informations
                  </h2>

                  {editing ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-blue-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Nom *
                          </label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-blue-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-400"
                        />
                        <p className="mt-1 text-xs text-gray-500 font-medium">
                          L'email ne peut pas être modifié ici.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Expérience
                        </label>
                        <input
                          type="text"
                          value={form.experience}
                          onChange={(e) => setForm({ ...form, experience: e.target.value })}
                          placeholder="ex : 5 ans d'enseignement en lycée"
                          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Biographie
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          rows={5}
                          placeholder="Présentez-vous aux parents et aux élèves..."
                          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-blue-500 focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="flex-1 rounded-2xl border-2 border-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            Prénom
                          </p>
                          <p className="mt-1 font-black text-gray-900">
                            {profile.firstName || '—'}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            Nom
                          </p>
                          <p className="mt-1 font-black text-gray-900">
                            {profile.lastName || '—'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Téléphone
                        </p>
                        <p className="mt-1 font-black text-gray-900">
                          {profile.phone || 'Non renseigné'}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Expérience
                        </p>
                        <p className="mt-1 font-black text-gray-900">
                          {profile.experience || 'Non renseignée'}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Biographie
                        </p>
                        <p className="mt-1 font-medium text-gray-700 whitespace-pre-line">
                          {profile.bio || 'Aucune biographie'}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Profile;