import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  UserIcon,
  CameraIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    experience: '',
    hourlyRate: 0,
    address: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: API call
      // await teacherAPI.updateProfile(formData);
      alert('Profil mis à jour avec succès !');
      setEditing(false);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">
                Mon Profil 👤
              </h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Gérez vos informations personnelles
              </p>
            </div>

            {/* Photo de profil */}
            <Card>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-5xl font-black text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-purple-200">
                    <CameraIcon className="h-5 w-5 text-purple-600" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600 font-medium">Professeur</p>
                  <div className="flex items-center gap-2 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                    <span className="text-sm font-bold text-gray-700 ml-2">4.8/5</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Informations personnelles
                </h2>
                {!editing && (
                  <Button onClick={() => setEditing(true)}>
                    Modifier
                  </Button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Biographie
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                      placeholder="Parlez de vous et de votre expérience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tarif horaire (€)
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? <Spinner size="sm" /> : 'Enregistrer'}
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
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Nom complet</p>
                      <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Email</p>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Téléphone</p>
                      <p className="text-gray-900 font-medium">{user.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Compétences */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Matières enseignées
              </h2>
              <div className="flex flex-wrap gap-3">
                {['Mathématiques', 'Physique', 'Chimie'].map((subject) => (
                  <span
                    key={subject}
                    className="px-4 py-2 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl text-sm font-bold text-gray-900"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </Card>
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