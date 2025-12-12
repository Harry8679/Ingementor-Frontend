import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  // CheckCircleIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';
import type { DashboardStats, Lesson, PaginatedResponse } from '../../types/common.types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const [statsRes, lessonsRes] = await Promise.all([
      studentAPI.getStats(),
      studentAPI.getLessons(),
    ]);

    setStats(statsRes.data);

    // Assure à TS que c’est un PaginatedResponse<Lesson>
    const lessons = lessonsRes.data as PaginatedResponse<Lesson>;

    const upcoming = lessons['hydra:member']
      .filter((lesson) => lesson.status === 'SCHEDULED')
      .slice(0, 3);

    setUpcomingLessons(upcoming);
  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animations blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Dashboard Élève 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Bienvenue dans ton espace de travail
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/student/lessons')}>
                Mes cours
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Nombre de cours */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours suivis</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats?.lessonCount || 0}
                    </p>
                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      +2 ce mois
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Moyenne générale */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Moyenne</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats?.averageGrade ? stats.averageGrade.toFixed(1) : '0'}/20
                    </p>
                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      +0.5 vs mois dernier
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Score de progression */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Progression</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats?.progressScore || 0}%
                    </p>
                    <p className="text-xs text-purple-600 font-bold mt-2 flex items-center">
                      <FireIcon className="h-4 w-4 mr-1" />
                      Excellent !
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* Professeurs */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Professeurs</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stats?.teacherCount || 0}
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-2 flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      Actifs
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Prochains cours */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                  <CalendarIcon className="h-7 w-7 mr-3 text-blue-600" />
                  Prochains cours
                </h2>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard/student/lessons')}
                >
                  Voir tout
                </Button>
              </div>

              {upcomingLessons.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucun cours programmé</p>
                  <Button 
                    variant="secondary" 
                    className="mt-4"
                    onClick={() => navigate('/dashboard/student/lessons')}
                  >
                    Planifier un cours
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => navigate(`/dashboard/student/lessons/${lesson.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                          <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900">
                            {lesson.subject?.name || 'Cours'}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            avec {lesson.teacher?.firstName} {lesson.teacher?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <ClockIcon className="h-4 w-4" />
                          {new Date(lesson.scheduledAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(lesson.scheduledAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Progression par matière */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Objectifs */}
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <TrophyIcon className="h-7 w-7 mr-3 text-yellow-600" />
                  Objectifs du mois
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Cours complétés</span>
                      <span className="text-sm font-black text-blue-600">8/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Devoirs rendus</span>
                      <span className="text-sm font-black text-green-600">12/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Heures de révision</span>
                      <span className="text-sm font-black text-purple-600">18/20h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '90%' }}></div>
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
                    onClick={() => navigate('/dashboard/student/lessons')}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left"
                  >
                    <BookOpenIcon className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Mes cours</p>
                    <p className="text-xs text-gray-600 mt-1">Voir le planning</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/student/grades')}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all text-left"
                  >
                    <AcademicCapIcon className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Notes</p>
                    <p className="text-xs text-gray-600 mt-1">Consulter</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/student/progress')}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-left"
                  >
                    <ChartBarIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Progression</p>
                    <p className="text-xs text-gray-600 mt-1">Suivre</p>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/student/messages')}
                    className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all text-left"
                  >
                    <UserGroupIcon className="h-6 w-6 text-orange-600 mb-2" />
                    <p className="text-sm font-black text-gray-900">Messages</p>
                    <p className="text-xs text-gray-600 mt-1">Contacter</p>
                  </button>
                </div>
              </Card>
            </div>

            {/* Conseils du jour */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-3 rounded-2xl">
                  <FireIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    💡 Conseil du jour
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Continue comme ça ! Tu as une progression de <strong className="text-blue-600">{stats?.progressScore || 0}%</strong> ce mois. 
                    N'oublie pas de réviser <strong>20 minutes par jour</strong> pour maximiser tes résultats. 
                    Tu as {upcomingLessons.length} cours à venir cette semaine.
                  </p>
                </div>
              </div>
            </Card>
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