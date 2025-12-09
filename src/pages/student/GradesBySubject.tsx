import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";
import type { StudentGradesResponse } from "../../types/common.types";

const GradesBySubject: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentGradesResponse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getGrades();
      setData(response.data); 

    } catch (error) {
      console.error("Erreur chargement notes :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Notes par Matière 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Toutes vos notes classées par matière
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Résultats obtenus
              </h2>

              {data && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>Total :</strong> {data.total} notes trouvées
                  </p>

                  {data.grades.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 bg-white/60 rounded-xl shadow flex justify-between items-center"
                    >
                      <div>
                        <div className="text-lg font-bold">
                          {g.subject.name} — {g.grade}/20
                        </div>
                        <div className="text-gray-600 text-sm">
                          {g.examName} — {g.examDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GradesBySubject;
