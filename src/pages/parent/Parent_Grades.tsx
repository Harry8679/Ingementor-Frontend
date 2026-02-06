import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  UserIcon
} from '@heroicons/react/24/solid';

interface Grade {
  id: number;
  childName: string;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  comment?: string;
  teacher: string;
}

interface ChildGradeStats {
  childId: number;
  childName: string;
  average: number;
  gradeCount: number;
  bestGrade: number;
  worstGrade: number;
}

const Grades: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('all');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async (): Promise<void> => {
    try {
      // TODO: API call
      setGrades([
        { id: 1, childName: 'Emma', subject: 'Mathématiques', grade: 16, maxGrade: 20, date: '2026-02-03', comment: 'Excellent travail', teacher: 'M. Martin' },
        { id: 2, childName: 'Emma', subject: 'Physique', grade: 14, maxGrade: 20, date: '2026-02-02', comment: 'Bien', teacher: 'Mme Dubois' },
        { id: 3, childName: 'Lucas', subject: 'Français', grade: 15, maxGrade: 20, date: '2026-02-03', comment: 'Très bien', teacher: 'M. Bernard' },
        { id: 4, childName: 'Lucas', subject: 'Histoire', grade: 13, maxGrade: 20, date: '2026-02-01', comment: 'Assez bien', teacher: 'Mme Leroy' }
      ]);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChildStats = (): ChildGradeStats[] => {
    const childrenMap = new Map<string, Grade[]>();
    
    grades.forEach(grade => {
      if (!childrenMap.has(grade.childName)) {
        childrenMap.set(grade.childName, []);
      }
      childrenMap.get(grade.childName)?.push(grade);
    });

    const stats: ChildGradeStats[] = [];
    childrenMap.forEach((childGrades, childName) => {
      const gradeValues = childGrades.map(g => (g.grade / g.maxGrade) * 20);
      stats.push({
        childId: childGrades[0].id,
        childName,
        average: gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length,
        gradeCount: childGrades.length,
        bestGrade: Math.max(...gradeValues),
        worstGrade: Math.min(...gradeValues)
      });
    });

    return stats;
  };

  const filteredGrades = selectedChild === 'all' 
    ? grades 
    : grades.filter(g => g.childName === selectedChild);

  const childStats = calculateChildStats();
  const children = Array.from(new Set(grades.map(g => g.childName)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">Notes 📝</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Consultez les notes de vos enfants
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Moyenne générale</p>
                    <p className="text-3xl font-black text-gray-900">
                      {(childStats.reduce((acc, c) => acc + c.average, 0) / childStats.length).toFixed(1)}/20
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Nombre de notes</p>
                    <p className="text-3xl font-black text-gray-900">{grades.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Meilleure note</p>
                    <p className="text-3xl font-black text-gray-900">
                      {Math.max(...grades.map(g => (g.grade / g.maxGrade) * 20)).toFixed(1)}/20
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Progression</p>
                    <p className="text-3xl font-black text-green-600">+0.5</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filter */}
            <Card>
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Filtrer par enfant:</label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                >
                  <option value="all">Tous les enfants</option>
                  {children.map((child) => (
                    <option key={child} value={child}>{child}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Stats par enfant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childStats.map((stat) => (
                <Card key={stat.childId}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-black text-white">
                        {stat.childName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{stat.childName}</h3>
                      <p className="text-sm text-gray-600 font-medium">{stat.gradeCount} notes</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <p className="text-2xl font-black text-gray-900">{stat.average.toFixed(1)}/20</p>
                      <p className="text-xs text-gray-600 font-bold mt-1">Moyenne</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-black text-gray-900">{stat.bestGrade.toFixed(1)}/20</p>
                      <p className="text-xs text-gray-600 font-bold mt-1">Meilleure</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <p className="text-2xl font-black text-gray-900">{stat.worstGrade.toFixed(1)}/20</p>
                      <p className="text-xs text-gray-600 font-bold mt-1">Plus basse</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Liste des notes */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Historique des notes
              </h2>
              <div className="space-y-4">
                {filteredGrades.map((grade) => {
                  const percentage = (grade.grade / grade.maxGrade) * 100;
                  const gradeOn20 = ((grade.grade / grade.maxGrade) * 20).toFixed(1);
                  const color = percentage >= 75 ? 'green' : percentage >= 50 ? 'blue' : 'red';
                  
                  return (
                    <div 
                      key={grade.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-black text-gray-900">{grade.childName}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <h3 className="text-lg font-black text-gray-900">{grade.subject}</h3>
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(grade.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {grade.comment && (
                          <p className="text-sm text-gray-600">{grade.comment}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Prof. {grade.teacher}</p>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className={`text-4xl font-black text-${color}-600`}>
                          {gradeOn20}/20
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {grade.grade}/{grade.maxGrade}
                        </div>
                      </div>
                    </div>
                  );
                })}
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

export default Grades;