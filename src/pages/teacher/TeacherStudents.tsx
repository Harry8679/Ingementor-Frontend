import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  EnvelopeIcon,
  EyeIcon
} from '@heroicons/react/24/solid';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  averageGrade: number;
  lessonCount: number;
  lastLesson: string;
  attendance: number;
}

const TeacherStudents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // TODO: API call
      // const response = await teacherAPI.getStudents();
      // setStudents(response.data);
      
      // Données fictives
      setStudents([
        {
          id: 1,
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          grade: '3ème',
          averageGrade: 14.5,
          lessonCount: 12,
          lastLesson: '2026-02-03',
          attendance: 95
        },
        {
          id: 2,
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@email.com',
          grade: 'Terminale',
          averageGrade: 16.8,
          lessonCount: 18,
          lastLesson: '2026-02-04',
          attendance: 100
        },
        {
          id: 3,
          firstName: 'Pierre',
          lastName: 'Bernard',
          email: 'pierre.bernard@email.com',
          grade: '1ère',
          averageGrade: 12.3,
          lessonCount: 8,
          lastLesson: '2026-02-02',
          attendance: 87
        }
      ]);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mes Élèves 👥
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérez vos élèves et suivez leur progression
                </p>
              </div>
              <Button onClick={() => alert('Fonctionnalité à venir')}>
                Inviter un élève
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total élèves</p>
                    <p className="text-3xl font-black text-gray-900">{students.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Moyenne classe</p>
                    <p className="text-3xl font-black text-gray-900">14.5/20</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Cours donnés</p>
                    <p className="text-3xl font-black text-gray-900">156</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Assiduité</p>
                    <p className="text-3xl font-black text-gray-900">94%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un élève..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>
                
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
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    Actifs
                  </button>
                  <button
                    onClick={() => setFilter('inactive')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'inactive'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Inactifs
                  </button>
                </div>
              </div>
            </Card>

            {/* Students List */}
            {filteredStudents.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucun élève trouvé</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xl font-black text-white">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-gray-900">
                            {student.firstName} {student.lastName}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 font-medium">
                              {student.email}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                              {student.grade}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">
                              {student.averageGrade}/20
                            </p>
                            <p className="text-xs text-gray-600 font-bold">Moyenne</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">
                              {student.lessonCount}
                            </p>
                            <p className="text-xs text-gray-600 font-bold">Cours</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">
                              {student.attendance}%
                            </p>
                            <p className="text-xs text-gray-600 font-bold">Assiduité</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <Button variant="secondary" className="text-sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="secondary" className="text-sm">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
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

export default TeacherStudents;