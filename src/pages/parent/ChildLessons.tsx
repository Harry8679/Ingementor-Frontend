import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { parentAPI } from '../../api/parent.api';

import type { Lesson } from '../../types/common.types';

const ChildLessons: React.FC = () => {
  const { id } = useParams(); // ID de l'enfant
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Lesson[] | null>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    if (!id) return;

    try {
      const response = await parentAPI.getChildLessons(Number(id));
      
      // Si ton API retourne ApiResponse<Lesson[]>
      setData(response.data.data ?? response.data);

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

  if (!data) {
    return <div>Aucun cours trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Cours de l’enfant 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste des cours de l’enfant
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Cours</h2>

              {data.length === 0 ? (
                <p className="text-gray-600">Aucun cours disponible</p>
              ) : (
                data.map((lesson) => (
                  <div key={lesson.id} className="border-b border-gray-200 py-3">
                    <p className="text-gray-900 font-bold">{lesson.title}</p>
                    <p className="text-gray-600 text-sm">{lesson.startTime} → {lesson.endTime}</p>
                  </div>
                ))
              )}
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
      `}</style>
    </div>
  );
};

export default ChildLessons;