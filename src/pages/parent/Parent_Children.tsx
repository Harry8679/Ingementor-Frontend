import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  UserGroupIcon,
  PlusIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import api from '../../services/api';

// ---- Aligné sur ParentChildController::getChildren ----
// Réponse : { children: [ { id, student: {...}, relationship, createdAt } ], total }

interface StudentGrade {
  id: number;
  name: string;
  level: string;
}

interface StudentInfo {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  grade: StudentGrade | null;
}

interface ChildLink {
  id: number; // ID de la relation StudentParent (pas de l'élève !)
  student: StudentInfo;
  relationship: string | null;
  createdAt: string | null;
}

const Children: React.FC = () => {
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/parents/me/children');
      // ⚠️ Pas d'enveloppe { success, data } ici : la réponse est { children, total }
      setChildren(res.data.children || []);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Impossible de charger vos enfants.'
        : 'Impossible de charger vos enfants.';
      setError(msg);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const initials = (student: StudentInfo) =>
    `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserGroupIcon className="h-8 w-8 text-pink-500" />
                Mes Enfants
              </h1>
              <p className="text-gray-500 mt-1">Gérez les profils de vos enfants</p>
            </div>
            <Button onClick={() => alert('À brancher sur POST /parents/me/children')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter un enfant
            </Button>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
              <div>
                <p>{error}</p>
                <button
                  onClick={fetchChildren}
                  className="mt-2 rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Chargement */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          )}

          {/* Statistiques */}
          {!loading && !error && (
            <>
              <div className="mb-8">
                <Card>
                  <div className="flex items-center gap-4 p-2">
                    <div className="rounded-xl bg-pink-100 p-3">
                      <UserGroupIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total enfants</p>
                      <p className="text-3xl font-bold text-gray-900">{children.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Liste des enfants */}
              {children.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun enfant enregistré</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Ajoutez un enfant pour commencer à suivre sa scolarité.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((link) => {
                    const child = link.student;
                    return (
                      <Card key={link.id}>
                        <div className="p-2">
                          <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 text-xl font-bold text-white">
                              {initials(child)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {child.fullName?.trim() || child.email}
                              </h3>

                              {/* Classe — la vraie donnée de la base */}
                              {child.grade ? (
                                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                  <AcademicCapIcon className="h-3.5 w-3.5" />
                                  {child.grade.name}
                                </span>
                              ) : (
                                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                  <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                                  Classe non renseignée
                                </span>
                              )}

                              <p className="mt-2 text-sm text-gray-500 truncate">{child.email}</p>
                              {child.phone && (
                                <p className="text-sm text-gray-500">{child.phone}</p>
                              )}
                              {link.relationship && (
                                <p className="mt-1 text-xs text-gray-400">
                                  Lien : {link.relationship}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Children;