import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { teacherAPI } from "../../api/teacher.api";
import type { Teacher } from "../../types/common.types";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Teacher | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await teacherAPI.getProfile();
      setProfile(response.data.data); // <-- données réelles
    } catch (error) {
      console.error("Erreur chargement paramètres :", error);
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

      {/* Décoration */}
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
                  Paramètres 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Configurer mon compte
                </p>
              </div>
              <Button>Modifier</Button>
            </div>

            {/* CONTENU */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Informations personnelles
              </h2>

              {profile ? (
                <div className="space-y-2 text-gray-700">
                  <p><strong>Nom :</strong> {profile.lastName}</p>
                  <p><strong>Prénom :</strong> {profile.firstName}</p>
                  <p><strong>Email :</strong> {profile.email}</p>
                  <p><strong>Téléphone :</strong> {profile.phone || "Non renseigné"}</p>
                  <p><strong>Bio :</strong> {profile.bio || "Aucune bio"}</p>
                  <p><strong>Expérience :</strong> {profile.experience || "Non renseignée"}</p>
                  <p><strong>Tarif horaire :</strong> {profile.hourlyRate ?? "Non renseigné"} €</p>
                </div>
              ) : (
                <p className="text-gray-600">Impossible de charger les paramètres.</p>
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

export default Settings;