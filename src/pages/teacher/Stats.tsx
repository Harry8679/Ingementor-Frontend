import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { teacherAPI } from "../../api/teacher.api";
import type { TeacherStats } from "../../types/common.types";

const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await teacherAPI.getStats();
      setStats(response.data.data); // <-- données réelles
    } catch (error) {
      console.error("Erreur chargement statistiques :", error);
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

      {/* Décor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Statistiques 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Mes statistiques
                </p>
              </div>
              <Button>Exporter</Button>
            </div>

            {/* STATS */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Vue d'ensemble
              </h2>

              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Cours donnés</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalLessons}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Heures enseignées</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalHours}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Étudiants suivis</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.studentsCount}
                    </p>
                  </div>

                </div>
              ) : (
                <p className="text-gray-600">Aucune statistique à afficher.</p>
              )}
            </Card>

          </div>
        </main>
      </div>

      {/* ANIMATION */}
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

export default Stats;