import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import { ChartBarIcon, CurrencyEuroIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/solid';

const TeacherStatistics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Statistiques 📊</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">Analysez vos performances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Cours ce mois</p>
                    <p className="text-3xl font-black text-gray-900">32</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <CurrencyEuroIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Revenus</p>
                    <p className="text-3xl font-black text-gray-900">4,500€</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Élèves actifs</p>
                    <p className="text-3xl font-black text-gray-900">24</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Satisfaction</p>
                    <p className="text-3xl font-black text-gray-900">4.8/5</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Évolution des revenus</h2>
              <div className="space-y-4">
                {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'].map((month, i) => {
                  const value = 3000 + Math.random() * 2000;
                  return (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">{month}</span>
                        <span className="text-sm font-black text-purple-600">{Math.round(value)}€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full" style={{ width: `${(value/5000)*100}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Matières les plus demandées</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Mathématiques', count: 48, color: 'blue' },
                    { name: 'Physique-Chimie', count: 32, color: 'green' },
                    { name: 'SVT', count: 24, color: 'purple' }
                  ].map((subject) => (
                    <div key={subject.name} className={`p-4 bg-${subject.color}-50 rounded-xl border-2 border-${subject.color}-100`}>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900">{subject.name}</span>
                        <span className={`text-2xl font-black text-${subject.color}-600`}>{subject.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Top 3 élèves</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Marie Martin', avg: 16.8, lessons: 18 },
                    { name: 'Jean Dupont', avg: 14.5, lessons: 12 },
                    { name: 'Pierre Bernard', avg: 12.3, lessons: 8 }
                  ].map((student, i) => (
                    <div key={student.name} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-100 flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-black">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">Moyenne: {student.avg}/20 • {student.lessons} cours</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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

export default TeacherStatistics;