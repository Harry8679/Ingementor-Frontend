import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";

import type { SubjectProgress } from "../../types/common.types";

const Progress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<SubjectProgress[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getProgress();
      setProgress(response.data.data); // ApiResponse<SubjectProgress[]>
    } catch (error) {
      console.error("Erreur chargement progression :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!progress) {
    return <p className="text-center text-gray-600">Aucune progression trouvée.</p>;
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
                <h1 className="text-5xl font-black text-gray-900">Ma Progression 🚀</h1>
                <p className="text-xl text-gray-600 mt-2">
                  Vos performances par matière
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Détail par matière
              </h2>

              <ul className="space-y-4">
                {progress.map((item) => (
                  <li
                    key={item.subject.id}
                    className="p-4 bg-white/70 rounded-xl shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="text-lg font-bold">
                        {item.subject.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Moyenne : {item.averageGrade}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Nombre de notes : {item.gradesCount}
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-white font-bold ${
                        item.trend === "UP"
                          ? "bg-green-500"
                          : item.trend === "DOWN"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {item.trend === "UP"
                        ? "📈 En hausse"
                        : item.trend === "DOWN"
                        ? "📉 En baisse"
                        : "➖ Stable"}
                    </span>
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

export default Progress;