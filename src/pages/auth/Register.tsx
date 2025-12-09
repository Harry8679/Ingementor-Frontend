import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { authAPI } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import type { RegisterPayload } from "../../types/auth.types";

type UserType = "teacher" | "student" | "parent";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("student");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Champs spécifiques
    gradeId: "",
    bio: "",
    experience: "",
    address: "",
  });

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ---------------------------------------
      // PAYLOAD TYPÉ DYNAMIQUE
      // ---------------------------------------
      let payload: RegisterPayload;

      if (userType === "student") {
        payload = {
          userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          gradeId: Number(formData.gradeId),
        };
      } else if (userType === "teacher") {
        payload = {
          userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          bio: formData.bio || "",
          experience: formData.experience || "",
        };
      } else {
        payload = {
          userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          address: formData.address || "",
        };
      }

      const response = await authAPI.register(payload);
      const { token, user } = response.data;

      login(token, user);
      navigate(`/dashboard/${userType}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // USER TYPE CARD CONFIG
  // ---------------------------------------
  const userTypes = [
    {
      type: "student" as UserType,
      icon: AcademicCapIcon,
      title: "Élève",
      emoji: "🎓",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      type: "teacher" as UserType,
      icon: BookOpenIcon,
      title: "Professeur",
      emoji: "👨‍🏫",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      type: "parent" as UserType,
      icon: UserIcon,
      title: "Parent",
      emoji: "👨‍👩‍👧",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 relative overflow-hidden">
      {/* Animation background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IngéMentor
            </span>
          </Link>

          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Rejoins-nous ! 🚀
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Déjà inscrit ?{" "}
            <Link
              to="/connexion"
              className="font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600"
            >
              Connecte-toi →
            </Link>
          </p>
        </div>

        {/* SELECT USER TYPE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {userTypes.map((t) => (
            <button
              key={t.type}
              onClick={() => setUserType(t.type)}
              className={`p-8 rounded-3xl border-3 transition-all ${
                userType === t.type
                  ? "bg-white border-transparent shadow-2xl scale-105"
                  : "bg-white/60 border-white hover:bg-white hover:shadow-xl"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${t.gradient} rounded-2xl mb-4 shadow-lg`}
              >
                <t.icon className="h-8 w-8 text-white" />
              </div>

              <div className="text-4xl mb-3">{t.emoji}</div>
              <div className="text-2xl font-black text-gray-900">{t.title}</div>
            </button>
          ))}
        </div>

        {/* FORM */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NOM / PRÉNOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Confirmer *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* ---------------------------------- */}
            {/* CHAMPS SPÉCIFIQUES PAR USER TYPE  */}
            {/* ---------------------------------- */}
            {userType === "student" && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Niveau (gradeId) *
                </label>
                <input
                  type="number"
                  value={formData.gradeId}
                  onChange={(e) =>
                    setFormData({ ...formData, gradeId: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl"
                  required
                />
              </div>
            )}

            {userType === "teacher" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Années d’expérience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl"
                  />
                </div>
              </div>
            )}

            {userType === "parent" && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl"
                />
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes blob { 
          0% { transform: translate(0px, 0px) scale(1); } 
          33% { transform: translate(30px, -50px) scale(1.1); } 
          66% { transform: translate(-20px, 20px) scale(0.9); } 
          100% { transform: translate(0px, 0px) scale(1); } 
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>
  );
};

export default RegisterPage;
