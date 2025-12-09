import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { studentAPI } from "../../api/student.api";

import type { Teacher, TeacherSearchParams } from "../../types/common.types";

const SearchTeachers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filters] = useState<TeacherSearchParams>({}); // On garde filters sans setter

  const loadData = useCallback(async () => {
    try {
      const response = await studentAPI.searchTeachers(filters);
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Erreur chargement professeurs :", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
            <h1 className="text-5xl font-black text-gray-900">
              Rechercher un Prof 🚀
            </h1>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Résultats
              </h2>

              {teachers.length === 0 ? (
                <p className="text-gray-600">Aucun professeur trouvé.</p>
              ) : (
                <ul className="space-y-3">
                  {teachers.map((teacher) => (
                    <li key={teacher.id} className="p-4 bg-white shadow rounded-xl">
                      <p className="font-bold text-xl">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                      <p className="text-gray-600">{teacher.bio}</p>
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

export default SearchTeachers;
