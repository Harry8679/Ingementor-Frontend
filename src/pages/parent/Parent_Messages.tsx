import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { EnvelopeIcon, PlusIcon, UserIcon, ClockIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid';

interface Message {
  id: number;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  childName: string;
}

const ParentMessages: React.FC = () => {
  const [messages] = useState<Message[]>([
    { id: 1, from: 'M. Martin (Prof. Math)', subject: 'Résultats du contrôle', content: 'Bonjour, Emma a obtenu une excellente note...', date: '2026-02-04', read: false, childName: 'Emma' },
    { id: 2, from: 'Mme Dubois (Prof. Physique)', subject: 'Devoirs à rendre', content: 'Lucas doit rendre son devoir pour...', date: '2026-02-03', read: false, childName: 'Lucas' },
    { id: 3, from: 'M. Bernard (Prof. Français)', subject: 'Félicitations', content: 'Je tenais à vous féliciter...', date: '2026-02-02', read: true, childName: 'Emma' }
  ]);

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Messages 💬</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">Messagerie avec les enseignants</p>
              </div>
              <Button><PlusIcon className="h-5 w-5 mr-2" />Nouveau message</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <EnvelopeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Non lus</p>
                    <p className="text-3xl font-black text-gray-900">{unreadCount}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <EnvelopeOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total messages</p>
                    <p className="text-3xl font-black text-gray-900">{messages.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Boîte de réception</h2>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${msg.read ? 'bg-gray-50 border-gray-200 hover:border-gray-300' : 'bg-orange-50 border-orange-200 hover:border-orange-300'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shrink-0">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm ${msg.read ? 'font-bold' : 'font-black'} text-gray-900`}>{msg.subject}</h3>
                          {!msg.read && <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">Nouveau</span>}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{msg.from}</p>
                        <p className="text-xs text-purple-600 font-bold mt-1">Concerne: {msg.childName}</p>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-2">{msg.content}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <ClockIcon className="h-3 w-3" />
                          {new Date(msg.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default ParentMessages;