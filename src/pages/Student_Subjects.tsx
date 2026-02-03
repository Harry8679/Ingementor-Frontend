import React, { useEffect, useState } from 'react';
// import Navbar from '../../components/layout/Navbar';
// import Sidebar from '../../components/layout/Sidebar';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
import { 
  BookOpenIcon, 
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../api/student.api';
import Spinner from '../components/common/Spinner';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface Subject {
  id: number;
  name: string;
  description?: string;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  lessonCount?: number;
  averageGrade?: number;
  nextLesson?: string;
}

const Subjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await studentAPI.getSubjects();
      setSubjects(response.data['hydra:member'] || []);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
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
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mes Matières 📚
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste de vos matières suivies
                </p>
              </div>
              <Button onClick={() => alert('Fonctionnalité à venir')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter une matière
              </Button>
            </div>

            {/* Subjects Grid */}
            {subjects.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Aucune matière pour le moment</p>
                  <Button variant="secondary" onClick={() => alert('Fonctionnalité à venir')}>
                    Ajouter votre première matière
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Card key={subject.id}>
                    <div className="space-y-4">
                      {/* Icon & Title */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                            <BookOpenIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-900">{subject.name}</h3>
                            {subject.teacher && (
                              <p className="text-sm text-gray-600 font-medium">
                                Prof. {subject.teacher.firstName} {subject.teacher.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Description */}
                      {subject.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {subject.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-blue-50 rounded-xl">
                          <AcademicCapIcon className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 font-bold">{subject.lessonCount || 0} cours</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-xl">
                          <StarIcon className="h-4 w-4 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 font-bold">{subject.averageGrade || 0}/20</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-xl">
                          <ClockIcon className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 font-bold">Actif</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="secondary" className="flex-1 text-sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Summary Stats */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Total matières</p>
                  <p className="text-4xl font-black text-gray-900">{subjects.length}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Moyenne générale</p>
                  <p className="text-4xl font-black text-gray-900">0/20</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Cours totaux</p>
                  <p className="text-4xl font-black text-gray-900">
                    {subjects.reduce((acc, s) => acc + (s.lessonCount || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Professeurs</p>
                  <p className="text-4xl font-black text-gray-900">
                    {new Set(subjects.map(s => s.teacher?.id).filter(Boolean)).size}
                  </p>
                </div>
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

export default Subjects;