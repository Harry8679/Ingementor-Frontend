import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { parentAPI } from '../../api/parent.api';
import type { Student } from '../../types/common.types';

// Import du type existant
// import { Student } from '../../types/common.types';

const AddChild: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await parentAPI.getChildren();

      // Typage automatique : ApiResponse<Student[]>
      setChildren(response.data.data);

    } catch (error) {
      console.error(error);
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
      {/* Effet blob conservé */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Ajouter un Enfant 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Lier un compte enfant
                </p>
              </div>
              <Button>Action</Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Contenu
              </h2>

              {children.length === 0 ? (
                <p className="text-gray-600">Aucun enfant trouvé.</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    {children.length} enfant(s) chargé(s) avec succès :
                  </p>

                  <ul className="space-y-2">
                    {children.map((child) => (
                      <li key={child.id} className="text-gray-800 font-medium">
                        {child.firstName} {child.lastName}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>

          </div>
        </main>
      </div>

      {/* Animation blob */}
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

export default AddChild;
