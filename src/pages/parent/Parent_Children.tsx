import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { UserGroupIcon, PlusIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface Child {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  birthDate: string;
  averageGrade: number;
  attendance: number;
  lessonCount: number;
}

const Children: React.FC = () => {
  const [children] = useState<Child[]>([
    { id: 1, firstName: 'Emma', lastName: 'Dupont', grade: '3ème', birthDate: '2010-05-15', averageGrade: 15.2, attendance: 98, lessonCount: 24 },
    { id: 2, firstName: 'Lucas', lastName: 'Dupont', grade: 'Terminale', birthDate: '2007-08-22', averageGrade: 14.4, attendance: 95, lessonCount: 24 }
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Enfants 👶</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">Gérez les profils de vos enfants</p>
              </div>
              <Button><PlusIcon className="h-5 w-5 mr-2" />Ajouter un enfant</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-pink-500 to-rose-500 p-4 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total enfants</p>
                    <p className="text-3xl font-black text-gray-900">{children.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Moyenne générale</p>
                    <p className="text-3xl font-black text-gray-900">
                      {(children.reduce((acc, c) => acc + c.averageGrade, 0) / children.length).toFixed(1)}/20
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Cours totaux</p>
                    <p className="text-3xl font-black text-gray-900">
                      {children.reduce((acc, c) => acc + c.lessonCount, 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {children.map((child) => (
                <Card key={child.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-linear-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-black text-white">{child.firstName[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">{child.firstName} {child.lastName}</h3>
                          <p className="text-gray-600 font-medium">{child.grade}</p>
                          <p className="text-sm text-gray-500">Né le {new Date(child.birthDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-2xl font-black text-gray-900">{child.averageGrade}/20</p>
                        <p className="text-xs text-gray-600 font-bold mt-1">Moyenne</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-black text-gray-900">{child.attendance}%</p>
                        <p className="text-xs text-gray-600 font-bold mt-1">Assiduité</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-black text-gray-900">{child.lessonCount}</p>
                        <p className="text-xs text-gray-600 font-bold mt-1">Cours</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1 text-sm">Voir détails</Button>
                      <Button className="flex-1 text-sm">Notes</Button>
                    </div>
                  </div>
                </Card>
              ))}
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

export default Children;