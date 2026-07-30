import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  CogIcon,
  BellIcon,
  MoonIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  XMarkIcon,
  KeyIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const TeacherSettings: React.FC = () => {
  type NotificationKey = 'email' | 'push' | 'lessons' | 'messages';
  type NotificationsState = Record<NotificationKey, boolean>;
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState<NotificationsState>({
    email: true,
    push: false,
    lessons: true,
    messages: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  // ---- Changement de mot de passe (branché sur l'API) ----
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setPwdError(null);
    setPwdSuccess(null);

    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdError('Tous les champs sont obligatoires.');
      return;
    }
    if (pwd.next.length < 6) {
      setPwdError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    setPwdSaving(true);
    try {
      await api.put('/api/teachers/me/password', {
        currentPassword: pwd.current,
        newPassword: pwd.next,
      });
      setPwdSuccess('Mot de passe changé avec succès.');
      setPwd({ current: '', next: '', confirm: '' });
      setTimeout(() => {
        setShowPwdModal(false);
        setPwdSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Erreur lors du changement de mot de passe'
        : 'Erreur lors du changement de mot de passe';
      setPwdError(msg);
    } finally {
      setPwdSaving(false);
    }
  };

  const NOTIFICATIONS: Array<{ key: NotificationKey; label: string; desc: string }> = [
    { key: 'email', label: 'Notifications par email', desc: 'Recevez des notifications par email' },
    { key: 'push', label: 'Notifications push', desc: 'Recevez des notifications sur votre appareil' },
    { key: 'lessons', label: 'Cours et rendez-vous', desc: 'Rappels de cours' },
    { key: 'messages', label: 'Nouveaux messages', desc: 'Notifications de messages' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Paramètres ⚙️</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">Configuration de votre compte</p>
            </div>

            {/* Informations du compte */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <CogIcon className="h-7 w-7 text-purple-600" />
                <h2 className="text-2xl font-black text-gray-900">Informations du compte</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Nom complet</p>
                    <p className="text-gray-900 font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <Button variant="secondary" className="text-sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Email</p>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                  <Button variant="secondary" className="text-sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Mot de passe</p>
                    <p className="text-gray-500 font-medium">••••••••</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="text-sm"
                    onClick={() => {
                      setShowPwdModal(true);
                      setPwdError(null);
                      setPwdSuccess(null);
                    }}
                  >
                    Changer
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications (cosmétique — non persisté côté back) */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <BellIcon className="h-7 w-7 text-purple-600" />
                <h2 className="text-2xl font-black text-gray-900">Notifications</h2>
              </div>
              {NOTIFICATIONS.map((notif) => (
                <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{notif.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[notif.key]}
                      onChange={() =>
                        setNotifications((prev) => ({ ...prev, [notif.key]: !prev[notif.key] }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </Card>

            {/* Apparence */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <MoonIcon className="h-7 w-7 text-purple-600" />
                <h2 className="text-2xl font-black text-gray-900">Apparence</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Mode sombre</p>
                    <p className="text-xs text-gray-600 mt-1">Activez le thème sombre</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Langue</p>
                      <p className="text-gray-900 font-medium">Français</p>
                    </div>
                  </div>
                  <select className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Confidentialité */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheckIcon className="h-7 w-7 text-purple-600" />
                <h2 className="text-2xl font-black text-gray-900">Confidentialité et sécurité</h2>
              </div>

              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  Télécharger mes données
                </Button>
                <Button variant="secondary" className="w-full justify-start text-red-600">
                  Supprimer mon compte
                </Button>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1">Enregistrer les modifications</Button>
              <Button variant="secondary" className="flex-1">Annuler</Button>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== MODALE MOT DE PASSE ==================== */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
                <KeyIcon className="h-6 w-6 text-purple-500" />
                Changer le mot de passe
              </h2>
              <button
                onClick={() => setShowPwdModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {pwdError && (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="flex items-center gap-2 rounded-xl border-2 border-green-200 bg-green-50 p-3 text-sm font-bold text-green-700">
                  <CheckCircleIcon className="h-5 w-5" />
                  {pwdSuccess}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  placeholder="Au moins 6 caractères"
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 p-6">
              <button
                onClick={() => setShowPwdModal(false)}
                disabled={pwdSaving}
                className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwdSaving}
                className="flex-1 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-4 py-3 font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {pwdSaving ? 'Changement...' : 'Changer'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default TeacherSettings;