import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { teacherAPI } from "../../api/teacher.api";
import type { Availability } from "../../types/common.types";

const AvailabilityPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await teacherAPI.getAvailability(); // ApiResponse<Availability[]>
      setAvailabilities(response.data.data); // extraction correcte
    } catch (error) {
      console.error("Erreur chargement disponibilités :", error);
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
      
      {/* Background blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Disponibilités 🕒</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Gérer mes disponibilités hebdomadaires
                </p>
              </div>

              <Button onClick={() => navigate("/teacher/availability/new")}>
                Ajouter une disponibilité
              </Button>
            </div>

            {/* Disponibilités */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Mes disponibilités
              </h2>

              {availabilities.length === 0 ? (
                <p className="text-gray-600">Aucune disponibilité pour le moment.</p>
              ) : (
                <ul className="space-y-4">
                  {availabilities.map((slot) => (
                    <li
                      key={slot.id}
                      className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][slot.dayOfWeek]}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {slot.startTime} → {slot.endTime}
                        </p>
                      </div>

                      <Button
                        variant="danger"
                        onClick={() => navigate(`/teacher/availability/${slot.id}`)}
                      >
                        Modifier
                      </Button>
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

export default AvailabilityPage;