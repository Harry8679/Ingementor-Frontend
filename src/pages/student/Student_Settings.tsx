import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    lessons: true,
    grades: true,
    messages: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">
                Paramètres ⚙️
              </h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Configurez votre compte et vos préférences
              </p>
            </div>

            {/* Account Info */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <CogIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-black text-gray-900">
                  Informations du compte
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Nom complet</p>
                      <p className="text-gray-900 font-medium">{user?.firstName} {user?.lastName}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-sm">
                    Modifier
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Email</p>
                      <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-sm">
                    Modifier
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <LockClosedIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Mot de passe</p>
                      <p className="text-gray-500 font-medium">••••••••</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-sm">
                    Changer
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <BellIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-black text-gray-900">
                  Notifications
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Notifications par email</p>
                    <p className="text-xs text-gray-600 mt-1">Recevez des notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Notifications push</p>
                    <p className="text-xs text-gray-600 mt-1">Recevez des notifications sur votre appareil</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Cours et rendez-vous</p>
                    <p className="text-xs text-gray-600 mt-1">Rappels de cours</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.lessons}
                      onChange={(e) => setNotifications({ ...notifications, lessons: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Nouvelles notes</p>
                    <p className="text-xs text-gray-600 mt-1">Notifications de notes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.grades}
                      onChange={(e) => setNotifications({ ...notifications, grades: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Nouveaux messages</p>
                    <p className="text-xs text-gray-600 mt-1">Notifications de messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.messages}
                      onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                {darkMode ? (
                  <MoonIcon className="h-7 w-7 text-blue-600" />
                ) : (
                  <SunIcon className="h-7 w-7 text-blue-600" />
                )}
                <h2 className="text-2xl font-black text-gray-900">
                  Apparence
                </h2>
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Langue</p>
                      <p className="text-gray-900 font-medium">
                        {language === 'fr' ? 'Français' : 'English'}
                      </p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheckIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-black text-gray-900">
                  Confidentialité et sécurité
                </h2>
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

            {/* Save Button */}
            <div className="flex gap-4">
              <Button className="flex-1">
                Enregistrer les modifications
              </Button>
              <Button variant="secondary" className="flex-1">
                Annuler
              </Button>
            </div>
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

export default Settings;