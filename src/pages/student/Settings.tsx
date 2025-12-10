import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";

import type { Student } from "../../types/common.types";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Student | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await studentAPI.getProfile();
        setProfile(response.data.data); // <-- ICI : le vrai Student
      } catch (error) {
        console.error("Erreur chargement profil :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Paramètres 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Configurer mon compte
                </p>
              </div>
              <Button>Modifier</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Mes informations</h2>

              {profile ? (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Nom :</strong> {profile.firstName} {profile.lastName}
                  </p>
                  <p>
                    <strong>Email :</strong> {profile.email}
                  </p>
                  {profile.phone && (
                    <p>
                      <strong>Téléphone :</strong> {profile.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Aucune donnée disponible.</p>
              )}
            </Card>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default Settings;