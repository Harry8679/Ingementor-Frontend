import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { parentAPI } from '../../api/parent.api';
import type { Teacher } from '../../types/common.types';
import { useParams } from 'react-router-dom';

const ChildTeachers: React.FC = () => {
  const { id } = useParams();   // <-- récupérer l'ID de l'enfant
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Teacher[] | null>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    if (!id) return; // sécurité

    try {
      const response = await parentAPI.getChildTeachers(Number(id));

      // ApiResponse<Teacher[]>
      setData(response.data.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Professeurs 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste des professeurs assignés à l'enfant
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Contenu</h2>

              {data && data.length > 0 ? (
                <ul>
                  {data.map((teacher) => (
                    <li key={teacher.id} className="text-gray-700">
                      {teacher.firstName} {teacher.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Aucun professeur pour cet enfant.</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChildTeachers;