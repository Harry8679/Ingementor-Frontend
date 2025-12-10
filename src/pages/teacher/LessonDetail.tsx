import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import type { Lesson } from "../../types/common.types";
import { teacherAPI } from "../../api/teacher.api";

const LessonDetail: React.FC = () => {
  const { id } = useParams(); // /teacher/lessons/:id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (lessonId: number) => {
    try {
      // ⚠️ À ADAPTER selon ta vraie route API :
      const response = await teacherAPI.getLessonById(lessonId);

      // Si APIResponse { data: Lesson }
      setLesson(response.data.data);
    } catch (error) {
      console.error("Erreur chargement du cours :", error);
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

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Cours introuvable
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">Détail du cours 🚀</h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Informations détaillées
                </p>
              </div>
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Informations du cours</h2>

              <p className="text-gray-700"><b>Titre :</b> {lesson.title}</p>
              <p className="text-gray-700"><b>Date :</b> {new Date(lesson.startTime).toLocaleString()}</p>

              {lesson.teacher && (
                <p className="text-gray-700">
                  <b>Professeur :</b> {lesson.teacher.firstName} {lesson.teacher.lastName}
                </p>
              )}

              {lesson.subject && (
                <p className="text-gray-700">
                  <b>Matière :</b> {lesson.subject.name}
                </p>
              )}
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
};

export default LessonDetail;