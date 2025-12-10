import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { studentAPI } from "../../api/student.api";
import type { Teacher } from "../../types/common.types";

const Teachers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getTeachers(); // ApiResponse<Teacher[]>
      setTeachers(response.data.data); // extraction correcte
    } catch (error) {
      console.error("Erreur chargement professeurs :", error);
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
      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Page header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mes Professeurs 👨‍🏫
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste de mes professeurs assignés
                </p>
              </div>

              <Button onClick={() => navigate("/student/search-teachers")}>
                Trouver un professeur
              </Button>
            </div>

            {/* Teachers list */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Professeurs assignés
              </h2>

              {teachers.length === 0 ? (
                <p className="text-gray-600">
                  Aucun professeur pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => navigate(`/student/teachers/${teacher.id}`)}
                      className="p-5 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
                    >
                      <h3 className="text-xl font-bold text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </h3>

                      {teacher.bio && (
                        <p className="text-gray-600 text-sm mt-1">
                          {teacher.bio}
                        </p>
                      )}

                      {teacher.subjects && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {teacher.subjects.map((sub) => (
                            <span
                              key={sub.id}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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

export default Teachers;
