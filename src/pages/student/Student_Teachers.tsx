import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  EnvelopeIcon,
  AcademicCapIcon,
  StarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { studentAPI } from '../../api/student.api';
import type { Teacher } from '../../types/common.types';

// ✅ Interface pour la réponse Hydra
interface HydraResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems'?: number;
}

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await studentAPI.getTeachers();
      // ✅ Type-safe avec l'interface HydraResponse
      const data = response.data as HydraResponse<Teacher>;
      setTeachers(data['hydra:member'] || []);
    } catch (error) {
      console.error('Erreur chargement professeurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects?.some(subject => 
      subject.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Mes Professeurs 👨‍🏫
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Liste de vos enseignants
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/student/lessons')}>
                Mes cours
              </Button>
            </div>

            {/* Search bar */}
            <Card>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un professeur ou une matière..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
            </Card>

            {/* Teachers List */}
            {filteredTeachers.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    {searchTerm ? 'Aucun professeur trouvé' : 'Aucun professeur'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <Card key={teacher.id}>
                    <div className="space-y-4">
                      {/* Avatar & Name */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-black text-white">
                            {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-gray-900 truncate">
                            {teacher.firstName} {teacher.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            Professeur
                          </p>
                        </div>
                      </div>

                      {/* Matières */}
                      {teacher.subjects && teacher.subjects.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-2">MATIÈRES</p>
                          <div className="flex flex-wrap gap-2">
                            {teacher.subjects.slice(0, 3).map((subject) => (
                              <span 
                                key={subject.id}
                                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200"
                              >
                                {subject.name}
                              </span>
                            ))}
                            {teacher.subjects.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                                +{teacher.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expérience */}
                      {teacher.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-700 font-medium">
                            {teacher.experience} d'expérience
                          </span>
                        </div>
                      )}

                      {/* Bio */}
                      {teacher.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {teacher.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="secondary"
                          onClick={() => navigate(`/dashboard/student/messages/new?teacher=${teacher.id}`)}
                          className="flex-1 text-sm"
                        >
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          Contacter
                        </Button>
                        <Button 
                          onClick={() => navigate(`/dashboard/student/lessons/new?teacher=${teacher.id}`)}
                          className="flex-1 text-sm"
                        >
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          Réserver
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Stats */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Professeurs</p>
                  <p className="text-4xl font-black text-gray-900">{teachers.length}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Matières disponibles</p>
                  <p className="text-4xl font-black text-gray-900">
                    {new Set(teachers.flatMap(t => t.subjects?.map(s => s.id) || [])).size}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Moyenne satisfaction</p>
                  <p className="text-4xl font-black text-gray-900">4.8/5</p>
                </div>
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
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Teachers;