import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  EnvelopeIcon
} from '@heroicons/react/24/solid';

interface DashboardStats {
  studentCount: number;
  lessonCount: number;
  upcomingLessons: number;
  unreadMessages: number;
  averageRating: number;
  totalEarnings: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    studentCount: 0,
    lessonCount: 0,
    upcomingLessons: 0,
    unreadMessages: 0,
    averageRating: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: Appel API pour récupérer les stats
      // const response = await teacherAPI.getStats();
      // setStats(response.data);
      
      // Données fictives pour l'instant
      setStats({
        studentCount: 24,
        lessonCount: 156,
        upcomingLessons: 8,
        unreadMessages: 3,
        averageRating: 4.8,
        totalEarnings: 4500,
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Dashboard Professeur 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Bienvenue dans votre espace enseignant
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/teacher/lessons/new')}>
                Planifier un cours
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Élèves */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Élèves actifs</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.studentCount}
                    </p>
                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      +3 ce mois
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Cours total */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours donnés</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.lessonCount}
                    </p>
                    <p className="text-xs text-purple-600 font-bold mt-2 flex items-center">
                      <FireIcon className="h-4 w-4 mr-1" />
                      Excellent !
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Note moyenne */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Évaluation</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.averageRating.toFixed(1)}/5
                    </p>
                    <p className="text-xs text-yellow-600 font-bold mt-2 flex items-center">
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      Top prof !
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Revenus */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Revenus ce mois</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats.totalEarnings}€
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-2 flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      +12% vs mois dernier
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prochains cours */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center">
                    <CalendarIcon className="h-7 w-7 mr-3 text-blue-600" />
                    Prochains cours ({stats.upcomingLessons})
                  </h2>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/dashboard/teacher/lessons')}
                  >
                    Voir tout
                  </Button>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                          <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900">
                            Mathématiques
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            avec Jean Dupont
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <ClockIcon className="h-4 w-4" />
                          14:00
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Aujourd'hui</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Messages non lus */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center">
                    <EnvelopeIcon className="h-7 w-7 mr-3 text-orange-600" />
                    Messages ({stats.unreadMessages})
                  </h2>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/dashboard/teacher/messages')}
                  >
                    Voir tout
                  </Button>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-start gap-3 p-4 bg-linear-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all cursor-pointer"
                    >
                      <div className="bg-linear-to-br from-orange-500 to-red-500 p-2 rounded-full">
                        <UserGroupIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-black text-gray-900">
                          Question sur le cours
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          Bonjour, j'ai une question concernant...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Il y a 2h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Stats détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance */}
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <ChartBarIcon className="h-7 w-7 mr-3 text-purple-600" />
                  Performance ce mois
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Cours complétés</span>
                      <span className="text-sm font-black text-blue-600">32/35</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-500 h-3 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Taux de satisfaction</span>
                      <span className="text-sm font-black text-green-600">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Taux de réponse</span>
                      <span className="text-sm font-black text-purple-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-linear-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions rapides */}
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Actions rapides ⚡
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/dashboard/teacher/students')}
                    className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left"
                  >
                    <UserGroupIcon className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Mes élèves</p>
                    <p className="text-xs text-gray-600 mt-1">Gérer</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/teacher/subjects')}
                    className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all text-left"
                  >
                    <BookOpenIcon className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Matières</p>
                    <p className="text-xs text-gray-600 mt-1">Consulter</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/teacher/availability')}
                    className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-left"
                  >
                    <CalendarIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Disponibilités</p>
                    <p className="text-xs text-gray-600 mt-1">Modifier</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/teacher/statistics')}
                    className="p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all text-left"
                  >
                    <ChartBarIcon className="h-6 w-6 text-orange-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Statistiques</p>
                    <p className="text-xs text-gray-600 mt-1">Analyser</p>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Dashboard;