import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { studentAPI } from "../../api/student.api";
import type { StudentSubject } from "../../types/common.types";

const Subjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<StudentSubject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getSubjects(); // ApiResponse<StudentSubject[]>

      setSubjects(response.data.data); // <-- CORRECTION
    } catch (error) {
      console.error("Erreur chargement matières :", error);
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
      {/* Effet visuel */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Matières 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérer mes matières
                </p>
              </div>
              <Button>Ajouter une matière</Button>
            </div>

            {/* Liste */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Mes matières</h2>

              {subjects.length === 0 ? (
                <p className="text-gray-600">Aucune matière trouvée.</p>
              ) : (
                <ul className="space-y-4">
                  {subjects.map((s) => (
                    <li key={s.id} className="p-4 bg-white rounded-xl shadow">
                      <p className="text-lg font-bold">{s.subject.name}</p>

                      <p className="text-gray-600 text-sm mt-1">
                        Besoin d’aide : {s.needHelp ? "Oui" : "Non"}
                      </p>

                      <p className="text-gray-500 text-xs">
                        Priorité : {s.priority}
                      </p>
                    </li>
                  ))}
                </ul>
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

export default Subjects;