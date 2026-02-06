import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, AcademicCapIcon, CalendarIcon,
  BookOpenIcon, ClockIcon, ArrowTrendingUpIcon, BellIcon
} from '@heroicons/react/24/solid';

interface Child {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  averageGrade: number;
}

interface DashboardStats {
  childrenCount: number;
  totalLessons: number;
  averageGrade: number;
  upcomingLessons: number;
  notifications: number;
}

interface UpcomingLesson {
  id: number;
  childName: string;
  subject: string;
  teacher: string;
  date: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    childrenCount: 0, totalLessons: 0, averageGrade: 0, upcomingLessons: 0, notifications: 0
  });
  const [children, setChildren] = useState<Child[]>([]);
  const [upcomingLessons, setUpcomingLessons] = useState<UpcomingLesson[]>([]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setStats({ childrenCount: 2, totalLessons: 48, averageGrade: 14.8, upcomingLessons: 5, notifications: 3 });
        setChildren([
          { id: 1, firstName: 'Emma', lastName: 'Dupont', grade: '3ème', averageGrade: 15.2 },
          { id: 2, firstName: 'Lucas', lastName: 'Dupont', grade: 'Terminale', averageGrade: 14.4 }
        ]);
        setUpcomingLessons([
          { id: 1, childName: 'Emma', subject: 'Mathématiques', teacher: 'M. Martin', date: '2026-02-05', time: '14:00' },
          { id: 2, childName: 'Lucas', subject: 'Physique', teacher: 'Mme Dubois', date: '2026-02-05', time: '16:00' }
        ]);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Dashboard Parent 👨‍👩‍👧‍👦</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">Suivez la scolarité de vos enfants</p>
              </div>
              <Button onClick={() => navigate('/dashboard/parent/children')}>Mes enfants</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Enfants suivis</p>
                    <p className="text-4xl font-black text-gray-900">{stats.childrenCount}</p>
                  </div>
                  <div className="bg-linear-to-br from-pink-500 to-rose-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Moyenne générale</p>
                    <p className="text-4xl font-black text-gray-900">{stats.averageGrade.toFixed(1)}/20</p>
                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />+0.3 vs mois dernier
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours ce mois</p>
                    <p className="text-4xl font-black text-gray-900">{stats.totalLessons}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Notifications</p>
                    <p className="text-4xl font-black text-gray-900">{stats.notifications}</p>
                  </div>
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <BellIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                  <UserGroupIcon className="h-7 w-7 mr-3 text-pink-600" />Mes enfants
                </h2>
                <Button variant="secondary" onClick={() => navigate('/dashboard/parent/children')}>Voir détails</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child) => (
                  <div key={child.id} className="p-4 bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-100 hover:border-pink-300 transition-all cursor-pointer"
                    onClick={() => navigate(`/dashboard/parent/children/${child.id}`)}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-black text-white">{child.firstName[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-gray-900">{child.firstName} {child.lastName}</h3>
                        <p className="text-sm text-gray-600 font-medium">{child.grade}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-bold text-gray-700">Moyenne:</span>
                          <span className="text-sm font-black text-green-600">{child.averageGrade}/20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                  <CalendarIcon className="h-7 w-7 mr-3 text-blue-600" />Prochains cours ({stats.upcomingLessons})
                </h2>
                <Button variant="secondary" onClick={() => navigate('/dashboard/parent/lessons')}>Voir tout</Button>
              </div>
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                        <BookOpenIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{lesson.subject}</h3>
                        <p className="text-sm text-gray-600 font-medium">{lesson.childName} • {lesson.teacher}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <ClockIcon className="h-4 w-4" />{new Date(lesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{lesson.time}</p>
                    </div>
                  </div>
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

export default Dashboard;