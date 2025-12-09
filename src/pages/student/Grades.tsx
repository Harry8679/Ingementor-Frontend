import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { studentAPI } from '../../api/student.api';
import type { StudentGrade } from '../../types/common.types';

const Grades: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<StudentGrade[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await studentAPI.getGrades();

      // Ton backend renvoie directement StudentGrade[]
      const data = response.data;

      setGrades(data);
    } catch (error) {
      console.error('Erreur chargement notes :', error);
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
                <h1 className="text-5xl font-black text-gray-900">Mes Notes 🚀</h1>
                <p className="text-xl text-gray-600 mt-2">Toutes mes notes</p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Liste des notes
              </h2>

              {grades.length === 0 ? (
                <p className="text-gray-600">Aucune note trouvée.</p>
              ) : (
                <ul className="space-y-3">
                  {grades.map(grade => (
                    <li key={grade.id} className="p-4 bg-white rounded-xl shadow">
                      <p className="font-bold">
                        {grade.subject.name} — {grade.value}/20
                      </p>
                      <p className="text-gray-500 text-sm">
                        Coefficient : {grade.coefficient}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(grade.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Grades;