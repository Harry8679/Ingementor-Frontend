import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { teacherAPI } from '../../api/teacher.api';

import type { DashboardStats } from '../../types/common.types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await teacherAPI.getStats();

      // Ton backend renvoie directement DashboardStats
      setData(response.data);

    } catch (error) {
      console.error('Erreur chargement stats professeur :', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
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
                <h1 className="text-5xl font-black text-gray-900">
                  Dashboard Professeur 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Vue d'ensemble
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Statistiques
              </h2>

              <div className="text-gray-700 space-y-2">
                <p>Élèves suivis : <strong>{data.studentsCount ?? 0}</strong></p>
                <p>Cours total : <strong>{data.lessonsCount ?? 0}</strong></p>
                <p>Messages non lus : <strong>{data.unreadMessages ?? 0}</strong></p>
              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;