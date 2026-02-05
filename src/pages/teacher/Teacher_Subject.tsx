import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  AcademicCapIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/solid';

interface Subject {
  id: number;
  name: string;
  description: string;
  level: string;
  hourlyRate: number;
  studentCount: number;
  lessonCount: number;
}

const Subjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      // TODO: API call
      setSubjects([
        {
          id: 1,
          name: 'Mathématiques',
          description: 'Algèbre, géométrie, analyse',
          level: 'Collège - Lycée',
          hourlyRate: 35,
          studentCount: 12,
          lessonCount: 48
        },
        {
          id: 2,
          name: 'Physique-Chimie',
          description: 'Mécanique, thermodynamique, chimie organique',
          level: 'Lycée',
          hourlyRate: 40,
          studentCount: 8,
          lessonCount: 32
        },
        {
          id: 3,
          name: 'Sciences de la Vie et de la Terre',
          description: 'Biologie, géologie',
          level: 'Collège - Lycée',
          hourlyRate: 35,
          studentCount: 6,
          lessonCount: 24
        }
      ]);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette matière ?')) return;
    
    try {
      // TODO: API call
      setSubjects(subjects.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
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
                  Mes Matières 📚
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Matières que vous enseignez
                </p>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter une matière
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Matières</p>
                    <p className="text-3xl font-black text-gray-900">{subjects.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Élèves total</p>
                    <p className="text-3xl font-black text-gray-900">
                      {subjects.reduce((acc, s) => acc + s.studentCount, 0)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <CurrencyEuroIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Tarif moyen</p>
                    <p className="text-3xl font-black text-gray-900">
                      {(subjects.reduce((acc, s) => acc + s.hourlyRate, 0) / subjects.length).toFixed(0)}€/h
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subjects List */}
            {subjects.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Aucune matière ajoutée</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    Ajouter votre première matière
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Card key={subject.id}>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-linear-to-br from-purple-500 to-indigo-500 p-3 rounded-xl">
                            <BookOpenIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-900">
                              {subject.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {subject.level}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                            <PencilIcon className="h-4 w-4 text-purple-600" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {subject.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <p className="text-2xl font-black text-gray-900">
                            {subject.studentCount}
                          </p>
                          <p className="text-xs text-gray-600 font-bold mt-1">Élèves</p>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <p className="text-2xl font-black text-gray-900">
                            {subject.lessonCount}
                          </p>
                          <p className="text-xs text-gray-600 font-bold mt-1">Cours</p>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                          <p className="text-2xl font-black text-gray-900">
                            {subject.hourlyRate}€
                          </p>
                          <p className="text-xs text-gray-600 font-bold mt-1">/ heure</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button variant="secondary" className="w-full text-sm">
                        Voir les élèves
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Total Revenue */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">
                    Revenus estimés par matière
                  </h2>
                  <p className="text-gray-600">Basé sur les cours donnés ce mois</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                {subjects.map((subject) => {
                  const revenue = subject.lessonCount * subject.hourlyRate;
                  const percentage = (revenue / subjects.reduce((acc, s) => acc + (s.lessonCount * s.hourlyRate), 0)) * 100;
                  
                  return (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">{subject.name}</span>
                        <span className="text-sm font-black text-purple-600">{revenue}€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-linear-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <Card className="w-full max-w-lg">
                <h2 className="text-2xl font-black mb-4">Ajouter une matière</h2>

                <p className="text-gray-600 mb-6">
                    Formulaire à venir…
                </p>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Annuler
                    </Button>
                    <Button disabled>
                    Enregistrer
                    </Button>
                </div>
                </Card>
            </div>
          )}
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