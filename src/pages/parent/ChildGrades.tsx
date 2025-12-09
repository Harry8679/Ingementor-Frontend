import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

import { parentAPI } from '../../api/parent.api';
import type { Student } from '../../types/common.types';

const ChildGrades: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Student[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await parentAPI.getChildren();
      setData(response.data.data);
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
    return <div>Aucun enfant trouvé</div>;
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
                  Notes des Enfants 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste des enfants pour voir leurs notes
                </p>
              </div>
              <Button>Ajouter</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Enfants</h2>

              {data.map(child => (
                <p key={child.id} className="text-gray-600">
                  {child.firstName} {child.lastName}
                </p>
              ))}
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

export default ChildGrades;