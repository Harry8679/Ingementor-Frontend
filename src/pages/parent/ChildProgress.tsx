import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { parentAPI } from '../../api/parent.api';

import type { ChildProgress } from '../../types/common.types';

const ChildProgress: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ChildProgress | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await parentAPI.getChildProgress(Number(id));
      setData(response.data.data ?? response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
                <h1 className="text-5xl font-black text-gray-900">Progression 🚀</h1>
                <p className="text-xl text-gray-600 mt-2">Suivi de la progression de l'enfant</p>
              </div>
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Contenu</h2>
              <pre className="text-gray-600">{JSON.stringify(data, null, 2)}</pre>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ChildProgress;