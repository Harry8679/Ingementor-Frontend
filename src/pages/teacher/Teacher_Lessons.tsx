import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  // UserCircleIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET  /messages         → { messages: [...], total, unreadCount }
//  POST /messages         → { recipientId, subject, content }
//  PUT  /messages/{id}/read
//  DELETE /messages/{id}
//  Destinataires : /api/teachers/me/students  ({ studentId, fullName })
// ============================================================================

interface Message {
  id: number;
  sender: { id: number; fullName: string; email: string };
  subject: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string | null;
}

interface StudentOption {
  studentId: number;
  fullName: string;
}

const formatDate = (raw: string | null): string => {
  if (!raw) return '';
  const d = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('fr-FR');
};

const TeacherMessages: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Message ouvert (lecture)
  const [openMsg, setOpenMsg] = useState<Message | null>(null);

  // Composer
  const [showCompose, setShowCompose] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [form, setForm] = useState({ recipientId: '', subject: '', content: '' });
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (!showCompose) return;
    const loadStudents = async () => {
      try {
        const res = await api.get('/api/teachers/me/students');
        const list = res.data?.students ?? res.data?.data ?? [];
        setStudents(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Erreur chargement élèves:', err);
        setStudents([]);
      }
    };
    loadStudents();
  }, [showCompose]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/messages');
      const list = res.data?.messages ?? [];
      setMessages(Array.isArray(list) ? list : []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos messages.'
        : 'Impossible de charger vos messages.';
      setError(msg);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages],
  );

  const handleOpen = async (msg: Message) => {
    setOpenMsg(msg);
    // Marquer comme lu si nécessaire
    if (!msg.isRead) {
      try {
        await api.put(`/messages/${msg.id}/read`);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
        );
      } catch (err) {
        console.error('Erreur marquage lu:', err);
      }
    }
  };

  const handleSend = async () => {
    setFormError(null);
    if (!form.recipientId || !form.subject.trim() || !form.content.trim()) {
      setFormError('Destinataire, sujet et contenu sont obligatoires.');
      return;
    }
    setSending(true);
    try {
      await api.post('/messages', {
        recipientId: Number(form.recipientId),
        subject: form.subject,
        content: form.content,
      });
      setShowCompose(false);
      setForm({ recipientId: '', subject: '', content: '' });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erreur lors de l'envoi"
        : "Erreur lors de l'envoi";
      setFormError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/messages/${id}`);
      if (openMsg?.id === id) setOpenMsg(null);
      loadMessages();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Erreur lors de la suppression'
        : 'Erreur lors de la suppression';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Messages 💬</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Messagerie avec vos élèves
                </p>
              </div>
              <Button onClick={() => setShowCompose(true)}>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                Nouveau message
              </Button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700">{error}</p>
                  <button
                    onClick={loadMessages}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
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
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total messages</p>
                    <p className="text-3xl font-black text-gray-900">{messages.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Boîte de réception */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Boîte de réception</h2>
                <button
                  onClick={loadMessages}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Actualiser
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="py-16 text-center">
                  <EnvelopeIcon className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="font-bold text-gray-500">Aucun message</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Vos messages reçus apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleOpen(m)}
                      className={`flex items-start gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                        m.isRead
                          ? 'border-gray-100 bg-white hover:border-gray-200'
                          : 'border-orange-200 bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-sm font-black text-white">
                        {initials(m.sender.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-gray-900 truncate">{m.subject}</h3>
                          {!m.isRead && (
                            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                              NOUVEAU
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-700">{m.sender.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{m.content}</p>
                        <p className="mt-1 text-xs text-gray-400 font-bold">
                          {formatDate(m.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(m.id);
                        }}
                        disabled={deletingId === m.id}
                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingId === m.id ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* ==================== MODALE LECTURE ==================== */}
      {openMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-sm font-black text-white">
                  {initials(openMsg.sender.fullName)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">{openMsg.sender.fullName}</h2>
                  <p className="text-xs text-gray-500 font-bold">{openMsg.sender.email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenMsg(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <EnvelopeOpenIcon className="h-5 w-5 text-purple-500" />
                <h3 className="text-xl font-black text-gray-900">{openMsg.subject}</h3>
              </div>
              <p className="text-xs text-gray-400 font-bold mb-4">
                {formatDate(openMsg.createdAt)}
              </p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {openMsg.content}
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 p-6">
              <button
                onClick={() => {
                  // Pré-remplit une réponse
                  setForm({
                    recipientId: String(openMsg.sender.id),
                    subject: openMsg.subject.startsWith('Re:')
                      ? openMsg.subject
                      : `Re: ${openMsg.subject}`,
                    content: '',
                  });
                  setOpenMsg(null);
                  setShowCompose(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-4 py-3 font-bold text-white hover:shadow-lg transition-all"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                Répondre
              </button>
              <button
                onClick={() => setOpenMsg(null)}
                className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALE COMPOSER ==================== */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
                <PaperAirplaneIcon className="h-6 w-6 text-purple-500" />
                Nouveau message
              </h2>
              <button
                onClick={() => {
                  setShowCompose(false);
                  setFormError(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {formError && (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Destinataire
                </label>
                <select
                  value={form.recipientId}
                  onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Sélectionner un élève...</option>
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="mt-1 text-xs text-gray-400 font-bold">
                    Aucun élève rattaché — vous ne pouvez écrire qu'à vos élèves.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Sujet</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Objet du message"
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Message</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  placeholder="Votre message..."
                  className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 p-6">
              <button
                onClick={() => {
                  setShowCompose(false);
                  setFormError(null);
                }}
                disabled={sending}
                className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex-1 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 px-4 py-3 font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default TeacherMessages;