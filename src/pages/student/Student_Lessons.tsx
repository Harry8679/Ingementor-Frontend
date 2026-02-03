import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
//   XCircleIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';

interface Lesson {
  id: number;
  subject: { name: string };
  teacher: { firstName: string; lastName: string };
  scheduledAt: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

const Lessons: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<'all' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('all');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await studentAPI.getLessons();
      const data = response.data as any;
      setLessons(data['hydra:member'] || []);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = filter === 'all' 
    ? lessons 
    : lessons.filter(l => l.status === filter);

  const upcomingLessons = lessons.filter(l => 
    l.status === 'SCHEDULED' && new Date(l.scheduledAt) > new Date()
  ).length;

  const completedLessons = lessons.filter(l => l.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Programmé';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mes Cours 📅
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérez votre planning de cours
                </p>
              </div>
              <Button onClick={() => alert('Fonctionnalité à venir')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Réserver un cours
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours à venir</p>
                    <p className="text-4xl font-black text-gray-900">{upcomingLessons}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours complétés</p>
                    <p className="text-4xl font-black text-gray-900">{completedLessons}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Total cours</p>
                    <p className="text-4xl font-black text-gray-900">{lessons.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Filtrer:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilter('SCHEDULED')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'SCHEDULED'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    Programmés
                  </button>
                  <button
                    onClick={() => setFilter('COMPLETED')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'COMPLETED'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    Terminés
                  </button>
                  <button
                    onClick={() => setFilter('CANCELLED')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'CANCELLED'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Annulés
                  </button>
                </div>
              </div>
            </Card>

            {/* Lessons List */}
            {filteredLessons.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Aucun cours pour le moment</p>
                  <Button variant="secondary" onClick={() => alert('Fonctionnalité à venir')}>
                    Planifier un cours
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredLessons.map((lesson) => {
                  const color = getStatusColor(lesson.status);
                  const date = new Date(lesson.scheduledAt);
                  
                  return (
                    <Card key={lesson.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 p-4 rounded-2xl`}>
                            <BookOpenIcon className="h-8 w-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-black text-gray-900">
                                {lesson.subject.name}
                              </h3>
                              <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 text-xs font-bold rounded-full`}>
                                {getStatusLabel(lesson.status)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1 font-medium">
                                <UserIcon className="h-4 w-4" />
                                {lesson.teacher.firstName} {lesson.teacher.lastName}
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <CalendarIcon className="h-4 w-4" />
                                {date.toLocaleDateString('fr-FR', { 
                                  weekday: 'long',
                                  day: 'numeric', 
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <ClockIcon className="h-4 w-4" />
                                {date.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} ({lesson.duration}min)
                              </span>
                            </div>
                            
                            {lesson.notes && (
                              <p className="text-sm text-gray-600 mt-2">{lesson.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="secondary" className="text-sm">
                            Détails
                          </Button>
                          {lesson.status === 'SCHEDULED' && (
                            <Button variant="secondary" className="text-sm text-red-600">
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
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

export default Lessons;