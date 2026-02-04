import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PlusIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  EnvelopeOpenIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';
import type { Message } from '../../types/common.types';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await studentAPI.getMessages();
      setMessages(response.data['hydra:member']);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]); // sécurité
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = filter === 'all'
    ? messages
    : filter === 'unread'
    ? messages.filter(m => !m.isRead)
    : messages.filter(m => m.isRead);

  const unreadCount = messages.filter(m => !m.isRead).length;

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
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Messages 💬
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Communiquez avec vos professeurs
                </p>
              </div>
              <Button onClick={() => alert('Fonctionnalité à venir')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouveau message
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Messages non lus</p>
                    <p className="text-4xl font-black text-gray-900">{unreadCount}</p>
                  </div>
                  <div className="bg-linear-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <EnvelopeIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Messages lus</p>
                    <p className="text-4xl font-black text-gray-900">{messages.length - unreadCount}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <EnvelopeOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Total messages</p>
                    <p className="text-4xl font-black text-gray-900">{messages.length}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Filtrer:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'unread'
                        ? 'bg-orange-600 text-white'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    Non lus ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      filter === 'read'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    Lus
                  </button>
                </div>
              </div>
            </Card>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Aucun message</p>
                  <Button variant="secondary" onClick={() => alert('Fonctionnalité à venir')}>
                    Envoyer un message
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((message) => {
                  const date = new Date(message.createdAt);
                  
                  return (
                    <Card 
                      key={message.id}
                      className={`cursor-pointer hover:shadow-lg transition-all ${
                        !message.isRead ? 'border-l-4 border-orange-500' : ''
                      }`}
                      onClick={() => navigate(`/dashboard/student/messages/${message.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-linear-to-br from-orange-500 to-red-500 p-3 rounded-full shrink-0">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-lg font-black text-gray-900 ${!message.isRead ? 'font-extrabold' : ''}`}>
                                  {message.subject}
                                </h3>
                                {!message.isRead && (
                                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                    Nouveau
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-medium">
                                De: {message.sender?.firstName ?? '—'} {message.sender?.lastName ?? ''}
                                {message.sender && ` (${message.sender.userType})`}
                              </p>
                            </div>
                            
                            <div className="text-right shrink-0 ml-4">
                              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                <ClockIcon className="h-3 w-3" />
                                {date.toLocaleDateString('fr-FR', { 
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
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

export default Messages;