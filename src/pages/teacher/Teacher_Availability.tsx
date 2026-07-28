import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ============================================================================
//  GET    /api/teachers/me/availabilities   → { availabilities: [...], grouped: {...} }
//  POST   /api/teachers/me/availabilities   → { dayOfWeek, startTime, endTime, isAvailable? }
//  DELETE /api/teachers/me/availabilities/{id}
//
//  dayOfWeek = chaîne EN majuscules : MONDAY, TUESDAY, ..., SUNDAY
//  startTime / endTime au format "HH:mm"
// ============================================================================

interface Availability {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string;
}

// Ordre + libellés FR des jours
const DAYS: { key: string; label: string }[] = [
  { key: 'MONDAY', label: 'Lundi' },
  { key: 'TUESDAY', label: 'Mardi' },
  { key: 'WEDNESDAY', label: 'Mercredi' },
  { key: 'THURSDAY', label: 'Jeudi' },
  { key: 'FRIDAY', label: 'Vendredi' },
  { key: 'SATURDAY', label: 'Samedi' },
  { key: 'SUNDAY', label: 'Dimanche' },
];

// Calcule la durée d'un créneau en heures
const slotHours = (start: string, end: string): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? diff / 60 : 0;
};

const TeacherAvailability: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Availability[]>([]);

  // Formulaire d'ajout par jour : jour actif du "+"
  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('18:00');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/teachers/me/availabilities');
      const list = res.data?.availabilities ?? [];
      setSlots(Array.isArray(list) ? list : []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos disponibilités.'
        : 'Impossible de charger vos disponibilités.';
      setError(msg);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Créneaux regroupés par jour
  const byDay = useMemo(() => {
    const map: Record<string, Availability[]> = {};
    DAYS.forEach((d) => (map[d.key] = []));
    slots.forEach((s) => {
      if (!map[s.dayOfWeek]) map[s.dayOfWeek] = [];
      map[s.dayOfWeek].push(s);
    });
    return map;
  }, [slots]);

  // Stats réelles
  const stats = useMemo(() => {
    const activeSlots = slots.filter((s) => s.isAvailable);
    const totalHours = activeSlots.reduce(
      (sum, s) => sum + slotHours(s.startTime, s.endTime),
      0,
    );
    const activeDays = new Set(activeSlots.map((s) => s.dayOfWeek)).size;
    return { totalHours, activeDays };
  }, [slots]);

  const handleAdd = async (dayKey: string) => {
    if (slotHours(newStart, newEnd) <= 0) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/teachers/me/availabilities', {
        dayOfWeek: dayKey,
        startTime: newStart,
        endTime: newEnd,
        isAvailable: true,
      });
      setAddingDay(null);
      setNewStart('09:00');
      setNewEnd('18:00');
      loadData();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erreur lors de l'ajout"
        : "Erreur lors de l'ajout";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/teachers/me/availabilities/${id}`);
      loadData();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Erreur lors de la suppression'
        : 'Erreur lors de la suppression';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

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
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Disponibilités ⏰</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérez vos créneaux horaires
                </p>
              </div>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Actualiser
              </button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700">{error}</p>
                  <button
                    onClick={loadData}
                    className="mt-2 rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Stats — réelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Heures / semaine</p>
                    <p className="text-3xl font-black text-gray-900">
                      {stats.totalHours % 1 === 0
                        ? stats.totalHours
                        : stats.totalHours.toFixed(1)}
                      h
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
                    <p className="text-sm font-bold text-gray-600">Jours actifs</p>
                    <p className="text-3xl font-black text-gray-900">{stats.activeDays}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Horaires de la semaine */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Horaires de la semaine
              </h2>

              <div className="space-y-4">
                {DAYS.map((day) => {
                  const daySlots = byDay[day.key] ?? [];
                  const isAdding = addingDay === day.key;

                  return (
                    <div
                      key={day.key}
                      className="rounded-2xl border-2 border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-gray-900 w-28">
                          {day.label}
                        </h3>

                        {daySlots.length === 0 && !isAdding && (
                          <span className="text-sm font-bold text-gray-400">
                            Aucun créneau
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setAddingDay(isAdding ? null : day.key);
                            setNewStart('09:00');
                            setNewEnd('18:00');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-600 hover:bg-purple-100 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Créneau
                        </button>
                      </div>

                      {/* Créneaux existants */}
                      {daySlots.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {daySlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                                slot.isAvailable
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {slot.isAvailable ? (
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                                )}
                                <span className="font-bold text-gray-900">
                                  {slot.startTime} — {slot.endTime}
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                  ({slotHours(slot.startTime, slot.endTime)}h)
                                </span>
                              </div>
                              <button
                                onClick={() => handleDelete(slot.id)}
                                disabled={deletingId === slot.id}
                                className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Supprimer ce créneau"
                              >
                                {deletingId === slot.id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <TrashIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulaire d'ajout inline */}
                      {isAdding && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-purple-50 p-3">
                          <input
                            type="time"
                            value={newStart}
                            onChange={(e) => setNewStart(e.target.value)}
                            className="rounded-lg border-2 border-purple-200 px-3 py-1.5 font-bold focus:border-purple-500 focus:outline-none"
                          />
                          <span className="font-bold text-gray-500">à</span>
                          <input
                            type="time"
                            value={newEnd}
                            onChange={(e) => setNewEnd(e.target.value)}
                            className="rounded-lg border-2 border-purple-200 px-3 py-1.5 font-bold focus:border-purple-500 focus:outline-none"
                          />
                          <button
                            onClick={() => handleAdd(day.key)}
                            disabled={saving}
                            className="rounded-lg bg-linear-to-r from-purple-500 to-indigo-500 px-4 py-1.5 font-bold text-white hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {saving ? '...' : 'Ajouter'}
                          </button>
                          <button
                            onClick={() => setAddingDay(null)}
                            className="rounded-lg border-2 border-gray-200 px-4 py-1.5 font-bold text-gray-600 hover:bg-white transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
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

export default TeacherAvailability;