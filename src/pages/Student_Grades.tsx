import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';

interface Grade {
  id: number;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  comment?: string;
  teacher?: string;
}

const Grades: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const response = await studentAPI.getGrades();
      setGrades(response.data.grades || []);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (gradesList: Grade[]) => {
    if (gradesList.length === 0) return 0;
    const sum = gradesList.reduce((acc, g) => acc + (g.grade / g.maxGrade) * 20, 0);
    return (sum / gradesList.length).toFixed(1);
  };

  const filteredGrades = selectedSubject === 'all' 
    ? grades 
    : grades.filter(g => g.subject === selectedSubject);

  const subjects = [...new Set(grades.map(g => g.subject))];
  const average = calculateAverage(filteredGrades);

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
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-black text-gray-900">
                Mes Notes 📊
              </h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Consultez vos résultats et votre progression
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Moyenne générale</p>
                    <p className="text-4xl font-black text-gray-900">{average}/20</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Nombre de notes</p>
                    <p className="text-4xl font-black text-gray-900">{grades.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Meilleure note</p>
                    <p className="text-4xl font-black text-gray-900">
                      {grades.length > 0 
                        ? Math.max(...grades.map(g => (g.grade / g.maxGrade) * 20)).toFixed(1)
                        : '0'
                      }/20
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Progression</p>
                    <div className="flex items-center gap-2">
                      <p className="text-4xl font-black text-green-600">+0.5</p>
                      <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filter */}
            <Card>
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Filtrer par matière:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  <option value="all">Toutes les matières</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Grades List */}
            {filteredGrades.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucune note pour le moment</p>
                </div>
              </Card>
            ) : (
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
                            <h3 className="text-lg font-black text-gray-900">{grade.subject}</h3>
                            <span className="text-sm text-gray-500 font-medium">
                              {new Date(grade.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          {grade.comment && (
                            <p className="text-sm text-gray-600">{grade.comment}</p>
                          )}
                          {grade.teacher && (
                            <p className="text-xs text-gray-500 mt-1">Prof. {grade.teacher}</p>
                          )}
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
            )}

            {/* Average by Subject */}
            {subjects.length > 0 && (
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Moyenne par matière
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => {
                    const subjectGrades = grades.filter(g => g.subject === subject);
                    const avg = calculateAverage(subjectGrades);
                    const percentage = parseFloat(avg) / 20 * 100;
                    
                    return (
                      <div key={subject} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">{subject}</h3>
                        <p className="text-3xl font-black text-gray-900 mb-2">{avg}/20</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{subjectGrades.length} note(s)</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
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

export default Grades;