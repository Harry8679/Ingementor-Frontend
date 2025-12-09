import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

import { parentAPI } from '../../api/parent.api';
import type { Lesson } from '../../services';

// Import du type Lesson déjà existant
// import { Lesson } from '../../types/common.types';

const AllLessons: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await parentAPI.getAllLessons();

      // response.data.data est un Lesson[]
      setLessons(response.data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Tous les Cours 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Tous les cours des enfants
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Contenu
              </h2>

              {lessons.length === 0 ? (
                <p className="text-gray-600">Aucun cours trouvé.</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    {lessons.length} cours chargés avec succès :
                  </p>

                  <ul className="space-y-3">
                    {lessons.map((lesson) => (
                      <li key={lesson.id} className="text-gray-800">
                        <span className="font-semibold">{lesson.title}</span>  
                        — {lesson.student?.firstName} {lesson.student?.lastName}
                        — {lesson.subject?.name}
                        — <span className="italic">{lesson.status}</span>
                      </li>
                    ))}
                  </ul>
                </>
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

export default AllLessons;