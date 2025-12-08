import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  HomeIcon,
  BookOpenIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { authAPI, gradesAPI, type Grade } from '../services/api';
import { useAuthStore } from '../store/authStore';

type UserType = 'teacher' | 'student' | 'parent';

interface RegisterForm {
  userType: UserType;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  experience?: string;
  address?: string;
  gradeId?: number;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  const [grades, setGrades] = useState<Grade[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await gradesAPI.getAll();
        setGrades(response.data['hydra:member'] || []);
      } catch (err: unknown) {
        console.error('Erreur chargement niveaux:', err);
      }
    };
    loadGrades();
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError('');

      let response;

      if (userType === 'teacher') {
        response = await authAPI.register({
          userType: 'teacher',
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          bio: data.bio,
          experience: data.experience,
        });
      } else if (userType === 'student') {
        response = await authAPI.register({
          userType: 'student',
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          gradeId: data.gradeId!,
        });
      } else {
        response = await authAPI.register({
          userType: 'parent',
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
        });
      }

      const { token, user } = response.data;
      login(token, user);

      switch (userType) {
        case 'teacher':
          navigate('/dashboard/teacher');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        case 'parent':
          navigate('/dashboard/parent');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error ||
                            'Une erreur est survenue lors de l\'inscription';
        setError(errorMessage);
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      type: 'student' as UserType,
      icon: AcademicCapIcon,
      title: 'Élève',
      description: 'Je veux progresser',
      emoji: '🎓',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'teacher' as UserType,
      icon: BookOpenIcon,
      title: 'Professeur',
      description: 'Je veux enseigner',
      emoji: '👨‍🏫',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      type: 'parent' as UserType,
      icon: UserIcon,
      title: 'Parent',
      description: 'Pour mes enfants',
      emoji: '👨‍👩‍👧',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IngéMentor
            </span>
          </Link>
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Rejoins-nous ! 🚀
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Déjà inscrit ?{' '}
            <Link
              to="/login"
              className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Connecte-toi →
            </Link>
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {userTypes.map((type) => (
            <button
              key={type.type}
              type="button"
              onClick={() => setUserType(type.type)}
              className={`group relative p-8 rounded-3xl border-3 transition-all duration-300 ${
                userType === type.type
                  ? 'bg-white border-transparent shadow-2xl scale-105'
                  : 'bg-white/60 border-white hover:bg-white hover:shadow-xl hover:scale-102'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 ${userType === type.type ? 'opacity-10' : ''} rounded-3xl transition-opacity`}></div>
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl mb-4 shadow-lg ${userType === type.type ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl mb-3">{type.emoji}</div>
                <div className="text-2xl font-black text-gray-900 mb-2">{type.title}</div>
                <div className="text-sm font-medium text-gray-600">{type.description}</div>
                {userType === type.type && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium flex items-start space-x-3 mb-6">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Prénom *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    {...register('firstName', { required: 'Le prénom est requis' })}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                    placeholder="Jean"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600 font-medium">❌ {errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Nom *</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Le nom est requis' })}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                  placeholder="Dupont"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 font-medium">❌ {errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Email *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                  placeholder="ton@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 font-medium">❌ {errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Téléphone (optionnel)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            {/* Champs conditionnels */}
            {userType === 'student' && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Niveau scolaire *</label>
                <select
                  {...register('gradeId', {
                    required: 'Le niveau scolaire est requis',
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                >
                  <option value="">📚 Sélectionne ton niveau</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
                {errors.gradeId && (
                  <p className="text-sm text-red-600 font-medium">❌ {errors.gradeId.message}</p>
                )}
              </div>
            )}

            {userType === 'teacher' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-900">Expérience (optionnel)</label>
                  <input
                    type="text"
                    {...register('experience')}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                    placeholder="ex: 5 ans d'expérience"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-900">Bio (optionnel)</label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium resize-none"
                    placeholder="Parle-nous de ton parcours et de tes spécialités..."
                  />
                </div>
              </>
            )}

            {userType === 'parent' && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Adresse (optionnel)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <HomeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                    placeholder="10 rue de la Paix, 75001 Paris"
                  />
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Mot de passe *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères',
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium">❌ {errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Confirmer *</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirme ton mot de passe',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas',
                  })}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 font-medium">❌ {errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-6 w-6 mr-2" />
                    Créer mon compte
                    <ArrowRightIcon className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <p className="text-xs text-gray-600 text-center font-medium">
              En créant un compte, tu acceptes nos{' '}
              <a href="#" className="font-bold text-blue-600 hover:underline">
                CGU
              </a>{' '}
              et notre{' '}
              <a href="#" className="font-bold text-blue-600 hover:underline">
                Politique de confidentialité
              </a>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;