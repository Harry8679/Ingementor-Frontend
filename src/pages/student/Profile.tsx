import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";
import type { Student } from "../../types/common.types";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getProfile();
      setStudent(response.data.data); // ApiResponse<T> → data.data
    } catch (error) {
      console.error("Erreur chargement profil :", error);
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

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Impossible de charger le profil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Effet visuel */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Mon Profil 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Modifier mes informations personnelles
                </p>
              </div>
              <Button onClick={() => navigate("/student/profile/edit")}>
                Modifier
              </Button>
            </div>

            {/* CARTE PROFIL */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Informations</h2>

              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Nom :</strong> {student.lastName}
                </p>
                <p>
                  <strong>Prénom :</strong> {student.firstName}
                </p>
                <p>
                  <strong>Email :</strong> {student.email}
                </p>

                {student.grade && (
                  <p>
                    <strong>Classe :</strong> {student.grade.name}
                  </p>
                )}

                <p>
                  <strong>Téléphone :</strong>{" "}
                  {student.phone ? student.phone : "Non renseigné"}
                </p>

                <p className="text-sm text-gray-400">
                  Membre depuis : {new Date(student.createdAt || "").toLocaleDateString()}
                </p>
              </div>
            </Card>

          </div>
        </main>
      </div>

      {/* Animation */}
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

export default Profile;
