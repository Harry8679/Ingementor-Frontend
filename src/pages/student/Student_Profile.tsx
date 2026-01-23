import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { UserIcon, EnvelopeIcon, PhoneIcon, AcademicCapIcon, CameraIcon } from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';
import { useAuthStore } from '../../store/authStore';
import type { Student } from '../../types/common.types';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentAPI.updateProfile(formData);
      setEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ✅ Helper typé correctement avec type guard
  const getGradeName = (): string => {
    if (!user) return 'Niveau non défini';
    
    // Type guard pour vérifier si user est un Student
    if ('grade' in user) {
      const student = user as Student;
      return student.grade?.name || 'Niveau non défini';
    }
    
    return 'Niveau non défini';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mon Profil 👤
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérez vos informations personnelles
                </p>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)}>
                  Modifier
                </Button>
              )}
            </div>

            {/* Photo de profil */}
            <Card>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-white" />
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border-2 border-blue-500 hover:bg-blue-50 transition-all">
                      <CameraIcon className="h-5 w-5 text-blue-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 font-medium mt-1">
                    Élève · {getGradeName()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Membre depuis {new Date(user?.createdAt || '').toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Formulaire d'édition */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Informations personnelles
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Nom
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Niveau */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Niveau scolaire
                  </label>
                  <div className="relative">
                    <AcademicCapIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={getGradeName()}
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-medium text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pour modifier votre niveau, contactez l'administration
                  </p>
                </div>

                {/* Boutons */}
                {editing && (
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Enregistrer
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setEditing(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </form>
            </Card>

            {/* Statistiques */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Mes statistiques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                  <p className="text-sm font-bold text-gray-600">Cours suivis</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">0</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                  <p className="text-sm font-bold text-gray-600">Moyenne</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">0/20</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
                  <p className="text-sm font-bold text-gray-600">Progression</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">0%</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;