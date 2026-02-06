import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { AcademicCapIcon, EnvelopeIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/solid';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  subject: string;
  email: string;
  phone: string;
  rating: number;
  studentCount: number;
  children: string[];
}

const Teachers: React.FC = () => {
  const [teachers] = useState<Teacher[]>([
    { id: 1, firstName: 'Pierre', lastName: 'Martin', subject: 'Mathématiques', email: 'p.martin@school.fr', phone: '06 12 34 56 78', rating: 4.8, studentCount: 24, children: ['Emma'] },
    { id: 2, firstName: 'Sophie', lastName: 'Dubois', subject: 'Physique-Chimie', email: 's.dubois@school.fr', phone: '06 23 45 67 89', rating: 4.9, studentCount: 18, children: ['Lucas'] },
    { id: 3, firstName: 'Jean', lastName: 'Bernard', subject: 'Français', email: 'j.bernard@school.fr', phone: '06 34 56 78 90', rating: 4.7, studentCount: 20, children: ['Emma', 'Lucas'] }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Professeurs 👨‍🏫</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">Liste des enseignants de vos enfants</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Professeurs</p>
                    <p className="text-3xl font-black text-gray-900">{teachers.length}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
                    <StarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Note moyenne</p>
                    <p className="text-3xl font-black text-gray-900">
                      {(teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length).toFixed(1)}/5
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <EnvelopeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Matières</p>
                    <p className="text-3xl font-black text-gray-900">{new Set(teachers.map(t => t.subject)).size}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-black text-white">{teacher.firstName[0]}{teacher.lastName[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900">{teacher.firstName} {teacher.lastName}</h3>
                        <p className="text-gray-600 font-medium">{teacher.subject}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < teacher.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm font-bold text-gray-700 ml-2">{teacher.rating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span className="font-medium">{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span className="font-medium">{teacher.phone}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-pink-50 rounded-xl">
                      <p className="text-sm font-bold text-gray-700 mb-1">Enseigne à:</p>
                      <div className="flex gap-2">
                        {teacher.children.map((child) => (
                          <span key={child} className="px-3 py-1 bg-white border-2 border-pink-200 rounded-full text-xs font-bold text-gray-900">
                            {child}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 text-sm">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      <Button variant="secondary" className="flex-1 text-sm">Voir profil</Button>
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

export default Teachers;