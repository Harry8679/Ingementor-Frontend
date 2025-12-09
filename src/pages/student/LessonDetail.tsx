import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";
import type { Lesson } from "../../types/common.types";

const LessonDetail: React.FC = () => {
  const { id } = useParams(); // /lessons/:id
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (lessonId: number) => {
    try {
      // TODO → remplacer par la bonne route
      const response = await studentAPI.getLessonById(lessonId);

      setLesson(response.data.data);
    } catch (error) {
      console.error("Erreur chargement du cours :", error);
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

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Cours introuvable
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
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  {lesson.title} 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  {lesson.subject?.name ?? "Matière inconnue"}
                </p>
              </div>
              <Button>Modifier</Button>
            </div>

            {/* CARD */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Informations du cours
              </h2>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Professeur :</strong>{" "}
                  {lesson.teacher
                    ? `${lesson.teacher.firstName} ${lesson.teacher.lastName}`
                    : "Non assigné"}
                </p>

                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(lesson.startTime).toLocaleString()}
                </p>

                <p>
                  <strong>Statut :</strong> {lesson.status}
                </p>

                {lesson.description && (
                  <p>
                    <strong>Description :</strong> {lesson.description}
                  </p>
                )}
              </div>
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

export default LessonDetail;