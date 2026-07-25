import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { teacherAPI } from "../../api/teacher.api";
import type { Subject } from "../../types/common.types";

const Subjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await teacherAPI.getSubjects(); // ApiResponse<Subject[]>
      setSubjects(response.data.data); // <-- données réelles
    } catch (error) {
      console.error("Erreur chargement matières :", error);
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

      {/* Décor animé */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mes Matières 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérer mes matières
                </p>
              </div>
              <Button>Ajouter</Button>
            </div>

            {/* SUBJECTS LIST */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Liste des matières</h2>

              {subjects.length === 0 ? (
                <p className="text-gray-600">Aucune matière trouvée.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    >
                      <p className="text-lg font-bold text-gray-900">
                        {subject.name}
                      </p>

                      {subject.description && (
                        <p className="text-gray-600 mt-1">{subject.description}</p>
                      )}
                    </div>
                  ))}

                </div>
              )}
            </Card>

          </div>
        </main>
      </div>

      {/* Animation CSS */}
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