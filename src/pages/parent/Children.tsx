import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { parentAPI } from '../../api/parent.api';

import type { Student } from '../../types/common.types';

const Children: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Student[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await parentAPI.getChildren();
      
      // TON API RENVOIE { data: Student[], message: string }
      setData(response.data.data ?? null);

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

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Enfants 🚀</h1>
                <p className="text-xl text-gray-600 mt-2">Liste de mes enfants</p>
              </div>
              <Button>Ajouter un enfant</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Enfants</h2>

              <ul className="space-y-4">
                {data?.map((child) => (
                  <li key={child.id} className="text-gray-700">
                    {child.firstName} {child.lastName} – {child.grade?.name}
                  </li>
                ))}
              </ul>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Children;