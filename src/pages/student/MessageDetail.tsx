import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import { messagesAPI } from "../../api/messages.api";
import type { Message } from '../../types/common.types';

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMessage = async () => {
      try {
        if (!id) return;
        const response = await messagesAPI.getMessage(parseInt(id));
        setMessage(response.data.data ?? []);
        
        // Marquer comme lu
        if (response.data && !response.data.data.isRead) {
          await messagesAPI.markAsRead(parseInt(id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !replyText.trim()) return;

    try {
      setSending(true);
      await messagesAPI.sendMessage({
        recipientId: message.sender?.id || 0,
        subject: `Re: ${message.subject}`,
        content: replyText,
      });
      setReplyText('');
      navigate('/dashboard/student/messages');
    } catch (error) {
      console.error('Erreur envoi réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    
    try {
      await messagesAPI.deleteMessage(parseInt(id || '0'));
      navigate('/dashboard/student/messages');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600 mb-4">Message introuvable</p>
          <Button onClick={() => navigate('/dashboard/student/messages')}>
            Retour aux messages
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header avec bouton retour */}
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard/student/messages')}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Message 💬
                </h1>
                <p className="text-lg text-gray-600 mt-1 font-medium">
                  Conversation avec {message.sender?.firstName} {message.sender?.lastName}
                </p>
              </div>
            </div>

            {/* Carte du message */}
            <Card>
              {/* En-tête du message */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-3 rounded-full">
                  <UserCircleIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">
                        {message.sender?.firstName} {message.sender?.lastName}
                      </h2>
                      <p className="text-sm text-gray-500 font-medium">
                        {message.sender?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.isRead ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Lu
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          Nouveau
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>{new Date(message.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Sujet */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {message.subject}
                </h3>
              </div>

              {/* Contenu du message */}
              <div className="py-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>

            {/* Formulaire de réponse */}
            <Card>
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                Répondre ✉️
              </h3>
              <form onSubmit={handleReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Votre réponse
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"
                    placeholder="Écrivez votre réponse ici..."
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="flex-1"
                  >
                    {sending ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                        Envoyer la réponse
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/dashboard/student/messages')}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Card>

            {/* Actions rapides */}
            <Card>
              <h3 className="text-lg font-black text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/dashboard/student/messages/new?recipient=${message.sender?.id}`)}
                  className="flex-1"
                >
                  Nouveau message
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  className="flex-1 hover:bg-red-50 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Supprimer
                </Button>
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

export default MessageDetail;