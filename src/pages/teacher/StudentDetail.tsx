import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

import { teacherAPI } from '../../api/teacher.api';
import type { Student } from '../../types/common.types';

const StudentDetail: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  const { id } = useParams<{ id: string }>(); // Récupère l'ID de l'URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    loadData(Number(id));
  }, [id]);

  const loadData = async (studentId: number) => {
    try {
      const response = await teacherAPI.getStudentDetail(studentId); 
      setStudent(response.data.data); // ApiResponse<Student>
    } catch (error) {
      console.error("Erreur chargement élève :", error);
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
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        ⚠ Élève introuvable.
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
                  Détail Élève 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Informations de l'élève
                </p>
              </div>
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>

            {/* STUDENT DATA */}
            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Informations générales
              </h2>

              <p className="text-gray-700">
                <strong>Nom :</strong> {student.firstName} {student.lastName}
              </p>

              <p className="text-gray-700">
                <strong>Email :</strong> {student.email}
              </p>

              <p className="text-gray-700">
                <strong>Niveau :</strong> {student.grade?.name ?? "Non défini"}
              </p>
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

export default StudentDetail;