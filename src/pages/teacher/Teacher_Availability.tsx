import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ClockIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/solid';

const TeacherAvailability: React.FC = () => {
  const [availabilities] = useState([
    { id: 1, day: 'Lundi', start: '09:00', end: '18:00', active: true },
    { id: 2, day: 'Mardi', start: '09:00', end: '18:00', active: true },
    { id: 3, day: 'Mercredi', start: '09:00', end: '12:00', active: true },
    { id: 4, day: 'Jeudi', start: '09:00', end: '18:00', active: true },
    { id: 5, day: 'Vendredi', start: '09:00', end: '18:00', active: true },
    { id: 6, day: 'Samedi', start: '10:00', end: '16:00', active: false },
    { id: 7, day: 'Dimanche', start: '10:00', end: '16:00', active: false },
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Disponibilités ⏰</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">Gérez vos créneaux horaires</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Heures / semaine</p>
                    <p className="text-3xl font-black text-gray-900">40h</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Jours actifs</p>
                    <p className="text-3xl font-black text-gray-900">{availabilities.filter(a => a.active).length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Horaires de la semaine</h2>
                <Button><PlusIcon className="h-5 w-5 mr-2" />Ajouter un créneau</Button>
              </div>

              <div className="space-y-3">
                {availabilities.map((avail) => (
                  <div key={avail.id} className={`flex items-center justify-between p-4 rounded-xl border-2 ${avail.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <p className="text-sm font-black text-gray-900">{avail.day}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="time" value={avail.start} className="px-3 py-2 border-2 border-gray-200 rounded-lg font-medium" />
                        <span className="text-gray-600">à</span>
                        <input type="time" value={avail.end} className="px-3 py-2 border-2 border-gray-200 rounded-lg font-medium" />
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={avail.active} className="sr-only peer" onChange={() => {}} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Congés et absences</h2>
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Aucun congé programmé</p>
                <Button variant="secondary">Ajouter une période d'absence</Button>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1">Enregistrer les modifications</Button>
              <Button variant="secondary" className="flex-1">Annuler</Button>
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

export default TeacherAvailability;