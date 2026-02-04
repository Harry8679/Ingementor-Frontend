import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { 
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';
import type { StudentSubjectProgress } from '../../types/student.types';
import { mapApiProgressToUi } from '../../types/student.types';


const Progress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<StudentSubjectProgress[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await studentAPI.getProgress();
    setProgress(
        (response.data || []).map(mapApiProgressToUi)
    );

    } catch (error) {
      console.error('Erreur chargement progression:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = progress.length > 0
    ? Math.round(progress.reduce((acc, p) => acc + p.progress, 0) / progress.length)
    : 0;

  const totalLessons = progress.reduce((acc, p) => acc + p.lessonCount, 0);
  const completedLessons = progress.reduce((acc, p) => acc + p.completedLessons, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">
                Ma Progression 📈
              </h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Suivez votre évolution et vos objectifs
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Progression globale</p>
                    <p className="text-4xl font-black text-gray-900">{overallProgress}%</p>
                  </div>
                  <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Cours complétés</p>
                    <p className="text-4xl font-black text-gray-900">{completedLessons}/{totalLessons}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Matières actives</p>
                    <p className="text-4xl font-black text-gray-900">{progress.length}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Série actuelle</p>
                    <div className="flex items-center gap-2">
                      <p className="text-4xl font-black text-orange-600">7</p>
                      <FireIcon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <FireIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overall Progress */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Vue d'ensemble
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Progression totale</span>
                    <span className="text-sm font-black text-purple-600">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-linear-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Assiduité</span>
                    <span className="text-sm font-black text-blue-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-linear-to-r from-blue-500 to-indigo-500 h-4 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Devoirs rendus</span>
                    <span className="text-sm font-black text-green-600">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-linear-to-r from-green-500 to-emerald-500 h-4 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress by Subject */}
            {progress.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucune donnée de progression</p>
                </div>
              </Card>
            ) : (
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Progression par matière
                </h2>
                <div className="space-y-6">
                  {progress.map((subject) => (
                    <div key={subject.subjectId} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-gray-900">{subject.subjectName}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-600">
                              {subject.completedLessons}/{subject.lessonCount} cours
                            </span>
                            <span className="text-xs text-gray-600">
                              Moyenne: {subject.averageGrade.toFixed(1)}/20
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {new Date(subject.lastActivity).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-gray-900">{subject.progress}%</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-linear-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Achievements */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <TrophyIcon className="h-7 w-7 text-yellow-600" />
                Réalisations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-sm font-black text-gray-900">Premier cours</p>
                  <p className="text-xs text-gray-600 mt-1">Complété</p>
                </div>
                
                <div className="text-center p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-sm font-black text-gray-900">Assidu</p>
                  <p className="text-xs text-gray-600 mt-1">7 jours de suite</p>
                </div>
                
                <div className="text-center p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <div className="text-4xl mb-2">⭐</div>
                  <p className="text-sm font-black text-gray-900">Excellent</p>
                  <p className="text-xs text-gray-600 mt-1">Moyenne &gt;16</p>
                </div>
                
                <div className="text-center p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 opacity-50">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm font-black text-gray-900">Expert</p>
                  <p className="text-xs text-gray-600 mt-1">100% complété</p>
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

export default Progress;