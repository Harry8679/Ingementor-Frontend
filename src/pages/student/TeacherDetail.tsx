import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { studentAPI } from "../../api/student.api";
import type { Teacher } from "../../types/common.types";

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (teacherId: number) => {
    try {
      const response = await studentAPI.getTeacher(teacherId); 
      setTeacher(response.data.data); // ApiResponse<Teacher>
    } catch (error) {
      console.error("Erreur chargement professeur :", error);
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

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Professeur introuvable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background animation */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Détails du Professeur 👨‍🏫
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Informations complètes du professeur
                </p>
              </div>

              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Informations générales
              </h2>

              <div className="space-y-3">
                <p><strong>Nom :</strong> {teacher.firstName} {teacher.lastName}</p>
                <p><strong>Email :</strong> {teacher.email}</p>
                {teacher.bio && <p><strong>Bio :</strong> {teacher.bio}</p>}
                {teacher.experience && (
                  <p>
                    <strong>Expérience :</strong> {teacher.experience}
                  </p>
                )}
                {teacher.hourlyRate && (
                  <p>
                    <strong>Tarif horaire :</strong> {teacher.hourlyRate} €
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Matières enseignées
              </h2>

              {teacher.subjects && teacher.subjects.length > 0 ? (
                <ul className="space-y-2">
                  {teacher.subjects.map((subject) => (
                    <li key={subject.id} className="p-3 bg-white rounded shadow">
                      {subject.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Aucune matière renseignée.</p>
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

export default TeacherDetail;