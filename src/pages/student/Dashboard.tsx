import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { studentAPI } from '../../api/student.api';
import type { DashboardStats } from '../../types/common.types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getStats();

      // ❗ studentAPI retourne directement DashboardStats
      const stats = response.data;

      setData(stats);
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
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black">
                  Dashboard Élève 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Vue d'ensemble
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black mb-6">Contenu</h2>

              <p className="text-gray-600">Données chargées avec succès</p>

              <pre className="mt-4 text-xs text-gray-500">
                {JSON.stringify(data, null, 2)}
              </pre>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;