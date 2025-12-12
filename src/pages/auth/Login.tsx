import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/solid';
import { authAPI } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      login(token, user);
      
      switch (user.userType) {
        case 'teacher': navigate('/dashboard/teacher'); break;
        case 'student': navigate('/dashboard/student'); break;
        case 'parent': navigate('/dashboard/parent'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '...');
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                IngéMentor
              </span>
            </Link>
            <h2 className="mt-8 text-4xl font-black text-gray-900">
              Content de te revoir ! 👋
            </h2>
            <p className="mt-3 text-base text-gray-600 font-medium">
              Pas encore inscrit ?{' '}
              <Link to="/inscription" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Créer un compte →
              </Link>
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium">
                  <span className="text-2xl mr-2">⚠️</span>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    placeholder="ton@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Mot de passe</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Connexion...' : (
                  <>
                    Se connecter
                    <ArrowRightIcon className="inline h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100">
              <p className="text-xs font-black text-gray-700 mb-3">🎯 Comptes de test :</p>
              <div className="space-y-2 text-xs font-medium text-gray-600">
                <p><strong>Prof :</strong> prof1@acadomia.com / password</p>
                <p><strong>Élève :</strong> eleve1_1@gmail.com / password</p>
                <p><strong>Parent :</strong> parent1@gmail.com / password</p>
              </div>
            </div>
          </div>
        </div>
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

export default LoginPage;