import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

import { parentAPI } from '../../api/parent.api';
import type { Subject } from '../../types/common.types';

const ChildSubjects: React.FC = () => {
  const { id } = useParams(); // ← ID de l’enfant dans l’URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Subject[] | null>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    if (!id) return; // sécurité

    try {
      const response = await parentAPI.getChildSubjects(Number(id));

      // Ton API renvoie ApiResponse<Subject[]>
      setData(response.data.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* TITRE */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Matières de l’Enfant 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Liste des matières suivies
                </p>
              </div>
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>

            {/* CONTENU */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Matières
              </h2>

              {!data?.length ? (
                <p className="text-gray-600">Aucune matière trouvée.</p>
              ) : (
                <ul className="space-y-4">
                  {data.map((subject) => (
                    <li key={subject.id} className="text-gray-700">
                      {subject.name}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default ChildSubjects;