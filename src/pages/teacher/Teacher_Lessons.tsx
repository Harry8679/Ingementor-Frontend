import React, { useState } from 'react';
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
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon
} from '@heroicons/react/24/solid';

interface Lesson {
  id: number;
  subject: string;
  student: string;
  date: string;
  time: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

const TeacherLessons: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<'all' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('all');

  const FILTERS: Array<'all' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'> = [
    'all',
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED',
  ];

  const [lessons] = useState<Lesson[]>([
  { id: 1, subject: 'Mathématiques', student: 'Jean Dupont', date: '2026-02-05', time: '14:00', duration: 60, status: 'SCHEDULED' },
  { id: 2, subject: 'Physique', student: 'Marie Martin', date: '2026-02-05', time: '16:00', duration: 90, status: 'SCHEDULED' },
  { id: 3, subject: 'Mathématiques', student: 'Pierre Bernard', date: '2026-02-04', time: '10:00', duration: 60, status: 'COMPLETED' },
]);

const [loading] = useState(false);


//   useEffect(() => {
//     setLessons([
//       { id: 1, subject: 'Mathématiques', student: 'Jean Dupont', date: '2026-02-05', time: '14:00', duration: 60, status: 'SCHEDULED' },
//       { id: 2, subject: 'Physique', student: 'Marie Martin', date: '2026-02-05', time: '16:00', duration: 90, status: 'SCHEDULED' },
//       { id: 3, subject: 'Mathématiques', student: 'Pierre Bernard', date: '2026-02-04', time: '10:00', duration: 60, status: 'COMPLETED' },
//     ]);
//     setLoading(false);
//   }, []);

  const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.status === filter);
  const getStatusColor = (status: string) => status === 'SCHEDULED' ? 'blue' : status === 'COMPLETED' ? 'green' : 'red';
  const getStatusLabel = (status: string) => status === 'SCHEDULED' ? 'Programmé' : status === 'COMPLETED' ? 'Terminé' : 'Annulé';

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Cours 📅</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">Planning et historique des cours</p>
              </div>
              <Button><PlusIcon className="h-5 w-5 mr-2" />Planifier un cours</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">À venir</p>
                    <p className="text-3xl font-black text-gray-900">{lessons.filter(l => l.status === 'SCHEDULED').length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Complétés</p>
                    <p className="text-3xl font-black text-gray-900">{lessons.filter(l => l.status === 'COMPLETED').length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-red-500 to-pink-500 p-4 rounded-2xl">
                    <XCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Annulés</p>
                    <p className="text-3xl font-black text-gray-900">{lessons.filter(l => l.status === 'CANCELLED').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex gap-2 mb-6">
                {/* {['all', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((f) => (
                  <button key={f} onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-xl font-bold ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {f === 'all' ? 'Tous' : getStatusLabel(f)}
                  </button>
                ))} */}
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl font-bold ${
                        filter === f
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {f === 'all' ? 'Tous' : getStatusLabel(f)}
                    </button>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              {filteredLessons.map((lesson) => {
                const color = getStatusColor(lesson.status);
                return (
                  <Card key={lesson.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`bg-linear-to-br from-${color}-500 to-${color}-600 p-4 rounded-2xl`}>
                          <BookOpenIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">{lesson.subject}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1"><UserIcon className="h-4 w-4" />{lesson.student}</span>
                            <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />{new Date(lesson.date).toLocaleDateString('fr-FR')}</span>
                            <span className="flex items-center gap-1"><ClockIcon className="h-4 w-4" />{lesson.time} ({lesson.duration}min)</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 text-xs font-bold rounded-full`}>
                        {getStatusLabel(lesson.status)}
                      </span>
                    </div>
                  </Card>
                );
              })}
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

export default TeacherLessons;