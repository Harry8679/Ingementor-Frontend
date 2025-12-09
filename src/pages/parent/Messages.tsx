import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  EnvelopeIcon, 
  EnvelopeOpenIcon,
  PlusIcon,
  UserCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import type { Message } from '../../types/common.types';
import { messagesAPI } from '../../api/messages.api';

const Messages: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const [inboxRes, sentRes] = await Promise.all([
        messagesAPI.getMessages(),
        messagesAPI.getSentMessages(),
      ]);
      setMessages(inboxRes.data.data ?? []);
      setSentMessages(sentRes.data.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentMessages = activeTab === 'inbox' ? messages : sentMessages;
  const unreadCount = messages.filter(m => !m.isRead).length;

  const filteredMessages = currentMessages.filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Messages 💬
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Communiquez avec les professeurs
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/parent/messages/new')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouveau message
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                    <EnvelopeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Messages reçus</p>
                    <p className="text-3xl font-black text-gray-900">{messages.length}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                    <EnvelopeOpenIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Non lus</p>
                    <p className="text-3xl font-black text-gray-900">{unreadCount}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                    <EnvelopeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Messages envoyés</p>
                    <p className="text-3xl font-black text-gray-900">{sentMessages.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs & Search */}
            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      activeTab === 'inbox'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Boîte de réception
                    {unreadCount > 0 && activeTab === 'inbox' && (
                      <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      activeTab === 'sent'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Messages envoyés
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium w-full md:w-64"
                  />
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      {searchTerm ? 'Aucun message trouvé' : 'Aucun message'}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => navigate(`/dashboard/parent/messages/${message.id}`)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        !message.isRead && activeTab === 'inbox'
                          ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`p-3 rounded-full ${
                          !message.isRead && activeTab === 'inbox'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                            : 'bg-gray-200'
                        }`}>
                          <UserCircleIcon className={`h-8 w-8 ${
                            !message.isRead && activeTab === 'inbox' ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-black text-gray-900 truncate">
                              {activeTab === 'inbox' 
                                ? `${message.sender?.firstName} ${message.sender?.lastName}`
                                : `${message.recipient?.firstName} ${message.recipient?.lastName}`
                              }
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4" />
                              <span>{new Date(message.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                          <p className="text-base font-bold text-gray-700 mb-2">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {message.content}
                          </p>
                        </div>

                        {/* Badge */}
                        {!message.isRead && activeTab === 'inbox' && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Messages;