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
} from '@heroicons/react/24/outline';
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

      const registerData = {
        userType: userType,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        ...(userType === 'teacher' && {
          bio: data.bio,
          experience: data.experience,
        }),
        ...(userType === 'parent' && {
          address: data.address,
        }),
        ...(userType === 'student' && {
          gradeId: data.gradeId,
        }),
      };

      const response = await authAPI.register(registerData as any);
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
      description: 'Je cherche un professeur',
    },
    {
      type: 'teacher' as UserType,
      icon: BookOpenIcon,
      title: 'Professeur',
      description: 'Je veux donner des cours',
    },
    {
      type: 'parent' as UserType,
      icon: UserIcon,
      title: 'Parent',
      description: 'Pour mes enfants',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <AcademicCapIcon className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">IngéMentor</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Créez votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Connectez-vous
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {userTypes.map((type) => (
            <button
              key={type.type}
              type="button"
              onClick={() => setUserType(type.type)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                userType === type.type
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <type.icon
                className={`h-8 w-8 mx-auto mb-2 ${
                  userType === type.type ? 'text-primary-600' : 'text-gray-400'
                }`}
              />
              <div className="text-sm font-semibold text-gray-900">{type.title}</div>
              <div className="text-xs text-gray-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('firstName', { required: 'Le prénom est requis' })}
                    className="input-field pl-10"
                    placeholder="Jean"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Le nom est requis' })}
                  className="input-field"
                  placeholder="Dupont"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
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
                  className="input-field pl-10"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field pl-10"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            {userType === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau scolaire *
                </label>
                <select
                  {...register('gradeId', {
                    required: 'Le niveau scolaire est requis',
                    valueAsNumber: true,
                  })}
                  className="input-field"
                >
                  <option value="">Sélectionnez votre niveau</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
                {errors.gradeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.gradeId.message}</p>
                )}
              </div>
            )}

            {userType === 'teacher' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience (optionnel)
                  </label>
                  <input
                    type="text"
                    {...register('experience')}
                    className="input-field"
                    placeholder="ex: 5 ans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie (optionnel)
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="input-field"
                    placeholder="Parlez-nous de votre parcours et de vos spécialités..."
                  />
                </div>
              </>
            )}

            {userType === 'parent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse (optionnel)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <HomeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('address')}
                    className="input-field pl-10"
                    placeholder="10 rue de la Paix, 75001 Paris"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
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
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmez votre mot de passe',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas',
                  })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Politique de confidentialité
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;